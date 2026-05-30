"""
Agent layer: search the web for species information, then score S1-S20 using Claude tool_use.
"""
import os
import json
import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import anthropic

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "rf_model.joblib")
_model = joblib.load(MODEL_PATH)

router = APIRouter()


# ─── Request / Response ───────────────────────────────────────────────────────

class AgentSearchRequest(BaseModel):
    species_name: str


# ─── Tool definitions for Claude ─────────────────────────────────────────────

TOOLS = [
    {
        "name": "web_search",
        "description": (
            "Search the web for information about a plant species. "
            "Use this to find market data, horticultural characteristics, "
            "cultural significance, production requirements, and protection policies. "
            "Run multiple targeted queries to gather comprehensive information."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query (in English or Chinese)"
                }
            },
            "required": ["query"]
        }
    }
]


def _do_web_search(query: str) -> str:
    """Execute a web search using duckduckgo_search."""
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
        if not results:
            return "No results found."
        lines = []
        for r in results:
            title = r.get("title", "")
            body = r.get("body", "")
            href = r.get("href", "")
            lines.append(f"**{title}**\n{body}\nURL: {href}")
        return "\n\n---\n\n".join(lines)
    except Exception as e:
        return f"Search error: {str(e)}"


SCORING_PROMPT = """你是一位观赏植物品种评估专家。你已经通过网络搜索收集了关于该植物品种的信息。
现在请基于这些信息，为以下20个维度评分（1-10分）：

S1 环境美化价值, S2 心理与教育价值, S3 市场增长潜力, S4 市场竞争力,
S5 品种特性, S6 经济寿命, S7 适应能力, S8 生产技术成熟度,
S9 育种技术进入难度, S10 生产技术进入难度, S11 研发成本,
S12 花卉象征意义, S13 营销渠道, S14 转化交易方式,
S15 运输要求（分高=要求低=耐运输）, S16 仓储要求（分高=要求低=耐存储）,
S17 保护政策完善性, S18 公众认知程度, S19 监管检查力度, S20 惩处力度

只返回如下JSON，不要任何其他文字：
{
  "scores": {
    "S1": <1-10>, "S2": <1-10>, "S3": <1-10>, "S4": <1-10>, "S5": <1-10>,
    "S6": <1-10>, "S7": <1-10>, "S8": <1-10>, "S9": <1-10>, "S10": <1-10>,
    "S11": <1-10>, "S12": <1-10>, "S13": <1-10>, "S14": <1-10>, "S15": <1-10>,
    "S16": <1-10>, "S17": <1-10>, "S18": <1-10>, "S19": <1-10>, "S20": <1-10>
  },
  "summary": "<2-3句话总结搜索到的关键信息>",
  "sources": ["<url1>", "<url2>"]
}"""


# ─── Agentic loop ─────────────────────────────────────────────────────────────

def run_agent(species_name: str, api_key: str) -> dict:
    client = anthropic.Anthropic(api_key=api_key)

    system = (
        "你是一位观赏植物品种价值评估专家。你的任务是：\n"
        "1. 使用 web_search 工具搜索该植物品种的市场、生态、文化和生产信息（至少搜索3-5次，涵盖不同方面）\n"
        "2. 综合所有搜索结果，为20个维度评分\n"
        "3. 搜索应包括：市场价格/需求、生产技术、文化意义、适应性/分布范围、品种保护政策等\n"
        "4. 完成搜索后，输出最终的JSON评分结果"
    )

    messages = [
        {
            "role": "user",
            "content": (
                f"请搜索并评估植物品种：**{species_name}**\n\n"
                "请先进行多次搜索收集全面信息，然后给出20个维度的评分和总结。"
            )
        }
    ]

    search_queries = []
    search_results_log = []

    # Agentic loop — max 10 rounds to prevent runaway
    for _ in range(10):
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=4096,
            system=system,
            tools=TOOLS,
            messages=messages,
        )

        # Collect assistant message
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            # Extract final text
            final_text = ""
            for block in response.content:
                if hasattr(block, "text"):
                    final_text = block.text
                    break
            return {
                "final_text": final_text,
                "search_queries": search_queries,
                "search_results_log": search_results_log,
            }

        if response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type == "tool_use" and block.name == "web_search":
                    query = block.input.get("query", "")
                    search_queries.append(query)
                    result = _do_web_search(query)
                    search_results_log.append({"query": query, "result": result[:500]})
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            messages.append({"role": "user", "content": tool_results})
            continue

        # Unexpected stop reason
        break

    raise ValueError("Agent did not complete within the allowed rounds.")


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@router.post("/agent-search")
async def agent_search(req: AgentSearchRequest):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY 未配置")

    if not req.species_name.strip():
        raise HTTPException(status_code=400, detail="请提供物种名称")

    try:
        agent_result = run_agent(req.species_name.strip(), api_key)
        final_text = agent_result["final_text"]

        # Parse JSON from final text
        raw = final_text.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        parsed = json.loads(raw)
        scores_raw = parsed["scores"]

        # Clamp scores to [1, 10]
        scores = {}
        for i in range(1, 21):
            k = f"S{i}"
            v = float(scores_raw.get(k, 6))
            scores[k] = max(1.0, min(10.0, v))

        # Run RF model
        df = pd.DataFrame([scores])
        prediction = float(_model.predict(df)[0])

        # Build initialS* format for frontend compatibility
        frontend_scores = {f"initialS{i}": scores[f"S{i}"] for i in range(1, 21)}

        return {
            "success": True,
            "species_name": req.species_name,
            "scores": frontend_scores,
            "prediction": prediction,
            "summary": parsed.get("summary", ""),
            "sources": parsed.get("sources", []),
            "search_queries": agent_result["search_queries"],
        }

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI 返回格式解析失败: {str(e)}")
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Claude API 调用失败: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
