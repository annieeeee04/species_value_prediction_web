import os
import json
import base64
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic

from db import SessionLocal, engine, Base
from models import PredictionRecord

Base.metadata.create_all(bind=engine)
app = FastAPI()

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://species-value-prediction-web.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "rf_model.joblib")
model = joblib.load(MODEL_PATH)

class PredictRequest(BaseModel):
    initialS1: float
    initialS2: float
    initialS3: float
    initialS4: float
    initialS5: float
    initialS6: float
    initialS7: float
    initialS8: float
    initialS9: float
    initialS10: float
    initialS11: float
    initialS12: float
    initialS13: float
    initialS14: float
    initialS15: float
    initialS16: float
    initialS17: float
    initialS18: float
    initialS19: float
    initialS20: float


ANALYSIS_PROMPT = """你是一位观赏植物品种评估专家。请仔细观察这张植物图片，并根据以下20个评估维度给出1-10分的评分。

**评估维度说明：**

S1 环境美化价值 (Environmental Aesthetic Value)：该植物对环境美化、净化空气、调节温湿度的作用。2=装饰性为主，6=有改善微环境作用，10=显著改善环境并增加生态多样性。

S2 心理与教育价值 (Psychological & Educational Value)：对情绪调节和文化教育的作用。2=几乎无，6=有一定作用，10=显著作用。

S3 市场增长潜力 (Market Growth Potential)：市场扩展空间和未来需求。2=增长慢，6=稳定增长，10=高速增长。

S4 市场竞争力 (Market Competitiveness)：与竞争品种的差异化程度。2=同质化严重，6=有独特卖点，10=高度差异化占据细分市场。

S5 品种特性 (Varietal Characteristics)：观花/观叶/观果/观形的综合观赏价值。2=普通，6=较佳，10=优秀独特。

S6 经济寿命 (Economic Lifespan)：品种的商业使用年限长短。2=极短（<5年），6=中等（10-20年），10=极长（>30年）。

S7 适应能力 (Adaptability)：对不同气候和环境条件的适应范围。2=需温控温室，6=适应2种气候带，10=广泛适应多种气候。

S8 生产技术成熟度 (Production Technology Maturity)：栽培生产技术的成熟和普及程度。2=不成熟，6=较成熟，10=高度成熟标准化。

S9 育种技术进入难度 (Breeding Entry Barriers)：育种技术门槛。2=常规杂交，6=需专业技术设备，10=依赖基因编辑等尖端技术。

S10 生产技术进入难度 (Production Entry Barriers)：生产技术门槛。2=简单易上手，6=需一定技能设备，10=高度复杂专业。

S11 研发成本 (R&D Cost)：研发所需投入成本。2=极低，6=中等，10=极高。

S12 花卉象征意义 (Symbolic/Cultural Meaning)：植物的文化内涵和象征意义。2=无明显文化背景，6=有一定文化象征，10=深厚历史文化背景。

S13 营销渠道 (Marketing Channels)：可利用的销售和营销渠道数量。2=渠道极少，6=渠道适中，10=渠道多样完善。

S14 转化交易方式 (Commercialization Model)：商业化和交易模式的多样性。2=单一模式，6=多种模式，10=完整商业生态。

S15 运输要求 (Transportation Requirements)：运输条件的苛刻程度（分越高=要求越低=越耐运输）。2=需严格温控，6=普通包装即可，10=几乎无特殊要求。

S16 仓储要求 (Storage Requirements)：仓储条件苛刻程度（分越高=要求越低=越耐存储）。2=需高级环境控制，6=基本温湿度控制，10=自然存储即可。

S17 保护政策完善性 (Protection Policy Completeness)：植物品种权保护法规的完善程度。2=法规缺失，6=法规基本健全，10=法规完善与国际接轨。

S18 公众认知程度 (Public Awareness Level)：大众对该植物品种及品种权的了解程度。2=几乎无人知晓，6=有一定认知，10=高度认知并主动维权。

S19 监管检查力度 (Regulatory Supervision)：市场监管和执法检查的频率与力度。2=被动监管，6=月度例行检查，10=全流程多部门联合监管。

S20 惩处力度 (Enforcement Strength)：侵权惩罚力度。2=低额罚款威慑弱，6=可追刑责，10=体系完善高度威慑。

**请基于图片中可以观察到的植物信息（品种外观、花/叶/果形态、植株状态等）以及你对该植物类型的专业知识，为所有20个维度评分。**

**只返回如下JSON格式，不要任何其他文字：**
{
  "initialS1": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS2": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS3": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS4": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS5": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS6": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS7": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS8": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS9": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS10": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS11": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS12": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS13": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS14": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS15": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS16": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS17": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS18": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS19": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"},
  "initialS20": {"score": <数字>, "confidence": "<high|medium|low>", "reason": "<简短理由>"}
}"""


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(req: PredictRequest):

    db = SessionLocal()
    try:
        df = pd.DataFrame([{
            "S1": req.initialS1,
            "S2": req.initialS2,
            "S3": req.initialS3,
            "S4": req.initialS4,
            "S5": req.initialS5,
            "S6": req.initialS6,
            "S7": req.initialS7,
            "S8": req.initialS8,
            "S9": req.initialS9,
            "S10": req.initialS10,
            "S11": req.initialS11,
            "S12": req.initialS12,
            "S13": req.initialS13,
            "S14": req.initialS14,
            "S15": req.initialS15,
            "S16": req.initialS16,
            "S17": req.initialS17,
            "S18": req.initialS18,
            "S19": req.initialS19,
            "S20": req.initialS20,
        }])

        pred = float(model.predict(df)[0])

        # Save to DB
        record = PredictionRecord(
            S1=req.initialS1,  S2=req.initialS2,  S3=req.initialS3,  S4=req.initialS4,  S5=req.initialS5,
            S6=req.initialS6,  S7=req.initialS7,  S8=req.initialS8,  S9=req.initialS9,  S10=req.initialS10,
            S11=req.initialS11, S12=req.initialS12, S13=req.initialS13, S14=req.initialS14, S15=req.initialS15,
            S16=req.initialS16, S17=req.initialS17, S18=req.initialS18, S19=req.initialS19, S20=req.initialS20,
            prediction=pred
        )
        db.add(record)
        db.commit()

        return {"prediction": pred, "saved": True}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY 未配置，请在后端 .env 文件中设置。")

    # Read and encode image
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="图片过大，请上传10MB以内的图片。")

    b64_image = base64.standard_b64encode(contents).decode("utf-8")
    media_type = file.content_type or "image/jpeg"
    if media_type not in ("image/jpeg", "image/png", "image/gif", "image/webp"):
        media_type = "image/jpeg"

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=2048,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": b64_image,
                            },
                        },
                        {
                            "type": "text",
                            "text": ANALYSIS_PROMPT,
                        },
                    ],
                }
            ],
        )

        raw_text = message.content[0].text.strip()

        # Strip markdown code fences if present
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()

        result = json.loads(raw_text)

        # Validate structure
        for i in range(1, 21):
            key = f"initialS{i}"
            if key not in result:
                raise ValueError(f"Missing key: {key}")
            score = result[key].get("score")
            if not isinstance(score, (int, float)) or not (1 <= score <= 10):
                result[key]["score"] = max(1, min(10, float(score or 6)))

        return {"success": True, "scores": result}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI 返回格式解析失败: {str(e)}")
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Claude API 调用失败: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
