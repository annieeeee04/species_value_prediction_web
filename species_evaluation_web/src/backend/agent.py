"""
Agent layer: search the web for species information, then score S1-S20 using Claude tool_use.
User-supplied context (market, production, cultural, regulatory) takes priority over web search.
"""
import os
import json
import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import anthropic

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "rf_model.joblib")
_model = joblib.load(MODEL_PATH)

router = APIRouter()


# ─── Request / Response ───────────────────────────────────────────────────────

class AgentSearchRequest(BaseModel):
    species_name: str
    context_market: Optional[str] = ""       # S3 S4 S6 S13 S14
    context_production: Optional[str] = ""   # S8 S9 S10 S11
    context_cultural: Optional[str] = ""     # S2 S12
    context_regulatory: Optional[str] = ""   # S17 S18 S19 S20


# ─── Tool definitions for Claude ─────────────────────────────────────────────

TOOLS = [
    {
        "name": "web_search",
        "description": (
            "Search the web for information about a plant species. "
            "Use this to find market data, horticultural characteristics, "
            "cultural significance, production requirements, and protection policies. "
            "Run multiple targeted queries to gather comprehensive information. "
            "Focus searches on dimensions where user context is missing or thin."
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


def _build_context_block(req: AgentSearchRequest) -> str:
    """Build a formatted block of user-provided context to inject into the prompt."""
    parts = []
    if req.context_market and req.context_market.strip():
        parts.append(
            f"【市场与商业信息（用户提供，对应 S3/S4/S6/S13/S14）】\n{req.context_market.strip()}"
        )
    if req.context_production and req.context_production.strip():
        parts.append(
            f"【生产与育种信息（用户提供，对应 S8/S9/S10/S11）】\n{req.context_production.strip()}"
        )
    if req.context_cultural and req.context_cultural.strip():
        parts.append(
            f"【文化与象征信息（用户提供，对应 S2/S12）】\n{req.context_cultural.strip()}"
        )
    if req.context_regulatory and req.context_regulatory.strip():
        parts.append(
            f"【法规与知识产权信息（用户提供，对应 S17/S18/S19/S20）】\n{req.context_regulatory.strip()}"
        )
    return "\n\n".join(parts)


# ─── Agentic loop ─────────────────────────────────────────────────────────────

def run_agent(req: AgentSearchRequest, api_key: str) -> dict:
    client = anthropic.Anthropic(api_key=api_key)

    context_block = _build_context_block(req)
    has_user_context = bool(context_block)

    # Tell Claude which dimensions already have user-supplied data so it
    # prioritises web searches on the dimensions that are still uncovered.
    covered_dims = []
    if req.context_market and req.context_market.strip():
        covered_dims += ["S3", "S4", "S6", "S13", "S14"]
    if req.context_production and req.context_production.strip():
        covered_dims += ["S8", "S9", "S10", "S11"]
    if req.context_cultural and req.context_cultural.strip():
        covered_dims += ["S2", "S12"]
    if req.context_regulatory and req.context_regulatory.strip():
        covered_dims += ["S17", "S18", "S19", "S20"]

    uncovered_note = ""
    if covered_dims:
        all_dims = {f"S{i}" for i in range(1, 21)}
        uncovered = sorted(all_dims - set(covered_dims), key=lambda x: int(x[1:]))
        uncovered_note = (
            f"\n用户已提供以下维度的背景信息：{', '.join(covered_dims)}。"
            f"\n请重点通过搜索补充以下维度的信息：{', '.join(uncovered)}。"
            "\n对于用户已提供的维度，优先采用用户信息评分，搜索可作为补充验证。"
        )

    system = (
        "你是一位观赏植物品种价值评估专家。你的任务是：\n"
        "1. 阅读用户提供的背景信息（如有）\n"
        "2. 使用 web_search 工具搜索该植物品种的信息，重点补充用户未覆盖的维度\n"
        "   ⚠️ 搜索次数限制：最多进行 4 次搜索，每次查询尽量覆盖多个维度\n"
        "3. 综合用户信息和搜索结果，为全部20个维度评分\n"
        "4. 用户提供的信息优先级高于网络搜索结果\n"
        "5. 完成搜索后立即输出JSON评分结果，不要继续搜索"
        + uncovered_note
    )

    user_message = f"请评估植物品种：**{req.species_name}**\n\n"
    if has_user_context:
        user_message += (
            "以下是用户提供的背景信息，请优先参考：\n\n"
            + context_block
            + "\n\n请在此基础上进行最多4次网络搜索补充缺失维度的信息，然后立即给出20个维度的评分。"
        )
    else:
        user_message += "请进行最多4次搜索收集关键信息，然后立即给出20个维度的评分和总结。"

    messages = [{"role": "user", "content": user_message}]

    search_queries = []
    search_results_log = []
    MAX_SEARCHES = 4
    MAX_ROUNDS = 15

    for round_num in range(MAX_ROUNDS):
        # If search cap reached, tell Claude to stop searching and output results
        search_limit_reached = len(search_queries) >= MAX_SEARCHES
        active_tools = [] if search_limit_reached else TOOLS

        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=4096,
            system=system,
            tools=active_tools if active_tools else None,
            tool_choice={"type": "none"} if search_limit_reached else {"type": "auto"},
            messages=messages,
        )

        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
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

            # If cap just hit, append results then inject a nudge to finish
            messages.append({"role": "user", "content": tool_results})
            if len(search_queries) >= MAX_SEARCHES:
                messages.append({
                    "role": "user",
                    "content": "搜索已完成。请现在立即输出最终的JSON评分结果，不要再搜索。"
                })
            continue

        break

    # Hard fallback: force a final scoring pass with whatever info was gathered
    messages.append({
        "role": "user",
        "content": (
            "请立即基于已有信息输出最终JSON评分结果。"
            "不要再搜索，直接给出所有20个维度的分数。"
        )
    })
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=4096,
        system=system,
        messages=messages,
    )
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


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@router.post("/agent-search")
async def agent_search(req: AgentSearchRequest):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY 未配置")

    if not req.species_name.strip():
        raise HTTPException(status_code=400, detail="请提供物种名称")

    try:
        agent_result = run_agent(req, api_key)
        final_text = agent_result["final_text"]

        # Strip markdown fences if present
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
