export const SCALES = {
  envAesthetic: {
    title: "S1 环境美化价值 — Environmental Aesthetic Value",
    levels: [
      {
        score: 2,
        zh: "主要提供视觉美感，对空气、温度、湿度、噪音等调节作用有限，主要用于装饰性绿化或背景绿化。",
        en: "Mainly provides visual aesthetics; limited regulation of air/temperature/humidity/noise; mostly for decorative or background greening.",
      },
      {
        score: 6,
        zh: "提供视觉美感，并能改善局部环境（如净化空气、降温、增湿、减噪等），适用于大多数公共绿化和园艺景观中。",
        en: "Provides aesthetics and improves local micro-environment (air purification, cooling, humidifying, noise reduction); suitable for most public greening and landscape use.",
      },
      {
        score: 10,
        zh: "提供视觉美感显著，改善环境能力强，并能丰富生态多样性，广泛用于城市绿化与景观设计中。",
        en: "Strong aesthetic effect and strong environmental improvement; enhances ecological diversity; widely used in urban greening and landscape design.",
      },
    ],
  },

  psychoEdu: {
    title: "S2 心理与教育价值 — Psychological and Educational Value",
    levels: [
      {
        score: 2,
        zh: "缺乏情绪调节和文化教育功能。",
        en: "Limited function in emotional regulation and cultural/educational value.",
      },
      {
        score: 6,
        zh: "在情绪调节和文化理解方面具有一定作用。",
        en: "Has a certain role in emotional regulation and cultural understanding.",
      },
      {
        score: 10,
        zh: "在情绪调节和文化理解方面具有显著作用。",
        en: "Has a significant role in emotional regulation and cultural understanding.",
      },
    ],
  },

  marketGrowth: {
    title: "S3 市场增长潜力 — Market Growth Potential",
    levels: [
      {
        score: 2,
        zh: "在市场中的扩展空间小，未来需求小，经济价值提升速度慢。",
        en: "Limited room for expansion in the market; future demand is small; slow growth in economic value.",
      },
      {
        score: 6,
        zh: "在市场中的扩展空间适中，未来需求稳定，经济价值提升速度稳定。",
        en: "Moderate room for expansion in the market; future demand is stable; steady growth in economic value.",
      },
      {
        score: 10,
        zh: "在市场中的扩展空间大，未来需求大，经济价值提升速度快。",
        en: "Large room for expansion in the market; strong future demand; rapid growth in economic value.",
      },
    ],
  },
  marketCompetitiveness: {
    title: "S4 市场竞争力 — Market Competitiveness",
    levels: [
      {
        score: 2,
        zh: "同质化严重，与竞争品种几乎无差异，竞争优势很弱。",
        en: "Highly homogeneous with competitors; little differentiation; very weak competitive advantage.",
      },
      {
        score: 4,
        zh: "有微小改进，具备一些技术或文化创新，但差异化程度较小。",
        en: "Slight differentiation exists, with minor technological or cultural innovation.",
      },
      {
        score: 6,
        zh: "具有独特卖点或创新，引发行业关注，定义新趋势（如花期延长、变色、抗病性增强等）。",
        en: "Has unique features or innovations that attract industry attention and define new trends (e.g., extended flowering period, color change, improved disease resistance).",
      },
      {
        score: 8,
        zh: "差异化明显，具有较强竞争优势（如极耐寒、超低维护）。",
        en: "Strong differentiation with clear competitive advantages (e.g., extreme cold tolerance, very low maintenance).",
      },
      {
        score: 10,
        zh: "高度差异化，能够充分占据细分市场空白。",
        en: "Highly differentiated and able to fully occupy market niches.",
      },
    ],
  },
  varietalChar: {
    title: "S5 品种特性 — Varietal (Cultivar) Characteristics",

    levels: [
      {
        score: 2,
        zh:
          "观花：颜色普通、形状常见、花期短、抗病虫性差；\n" +
          "观叶：叶形无特别吸引力、颜色单一、质感差、抗病虫能力差；\n" +
          "观果：果形普通、果量少、挂果时间短、抗病虫性差；\n" +
          "观形：形态普通，主要用于填充或作为背景植物。",
        en:
          "Flower: ordinary color and common shape; short flowering period; poor pest resistance.\n" +
          "Leaf: ordinary shape, dull color, weak texture, poor pest resistance.\n" +
          "Fruit: ordinary fruit shape, small quantity, short fruiting period, poor pest resistance.\n" +
          "Form: ordinary form; mainly used as filler or background plant.",
      },
      {
        score: 6,
        zh:
          "观花：颜色较鲜艳、形状美观，花期较长，抗病虫性一般；\n" +
          "观叶：叶形独特、颜色较丰富，具有一定美感，抗病虫性一般；\n" +
          "观果：果形美观，果量较多，挂果时间较长，抗病虫性一般；\n" +
          "观形：形态规整、美观，适合用于园林布局。",
        en:
          "Flower: brighter color, attractive shape; relatively long flowering period; moderate pest resistance.\n" +
          "Leaf: distinct leaf shape, richer color, moderate ornamental value and pest resistance.\n" +
          "Fruit: attractive fruit appearance, more fruit, longer fruiting period; moderate pest resistance.\n" +
          "Form: regular and aesthetically pleasing form; suitable for landscape composition.",
      },
      {
        score: 10,
        zh:
          "观花：颜色艳丽、形态独特、花期长，抗病虫性好且一致；\n" +
          "观叶：叶形优美、颜色多样、季节变化明显，抗病虫能力好；\n" +
          "观果：果形饱满美观、果量大、果实色彩亮丽、抗病虫能力好；\n" +
          "观形：形态独特、优雅，适合作为园艺设计中的视觉焦点。",
        en:
          "Flower: outstanding color and unique form; long flowering period; good and consistent pest resistance.\n" +
          "Leaf: elegant leaf form, diverse colors with clear seasonal changes; strong pest resistance.\n" +
          "Fruit: plump and visually appealing fruit, large quantity, bright color, strong pest resistance.\n" +
          "Form: unique and elegant form; suitable as a visual focal point in garden design.",
      },
    ],
  },
  economicLifespan: {
    title: "S6 经济寿命 - Economic Lifespan",
    note: "Quantified using the years-based method (年限法).",
    levels: [
      /* ... */
    ],
  },
  adaptability: {
    title: "S7 适应能力 — Adaptability",
    levels: [
      {
        score: 2,
        zh: "高度依赖人工控制环境（如温室恒温恒湿）。",
        en: "Highly dependent on artificial control; can only survive in controlled environments (e.g., constant temperature/humidity greenhouse).",
      },
      {
        score: 4,
        zh: "适应有限：仅能适应一种气候带或特定环境条件。",
        en: "Limited adaptability: can adapt to one climate zone or specific environmental conditions.",
      },
      {
        score: 6,
        zh: "可适应两种气候条件（如中温带与暖温带，或耐旱土壤等）。",
        en: "Can adapt to two types of climatic conditions (e.g., temperate & warm-temperate; tolerates some stress such as drought).",
      },
      {
        score: 8,
        zh: "可适应多种气候带或多样环境（如耐寒/耐旱且耐轻度盐碱土壤）。",
        en: "Can adapt to multiple climate zones or diverse environments (e.g., cold/drought tolerance and light saline-alkali tolerance).",
      },
      {
        score: 10,
        zh: "适应范围广，综合抗逆能力强（如跨寒/温/热，耐旱、耐盐碱、抗涝等）。",
        en: "Broad adaptability with strong comprehensive stress resistance (e.g., across cold/temperate/hot zones; drought, saline-alkali, waterlogging tolerance, etc.).",
      },
    ],
  },

  prodTechMaturity: {
    title: "S8 生产技术成熟度 — Maturity of Production Technology",
    note: "Quantified using an assignment-based method (赋值法).",
    levels: [
      /* ... */
    ],
  },

  breedingBarrier: {
    title: "S9 育种技术进入难度 — Barriers to Entry in Breeding Technology",
    levels: [
      {
        score: 2,
        zh: "操作简单，仅使用常规技术，无需高端设备（如杂交育种、选择育种等）。",
        en: "Simple operation using conventional techniques; no high-end equipment required (e.g., basic hybridization/selection).",
      },
      {
        score: 6,
        zh: "操作较复杂，涉及一定专业技术和设备（如诱变育种等）。",
        en: "Moderately complex; requires some specialized techniques and equipment (e.g., mutation breeding).",
      },
      {
        score: 10,
        zh: "依赖先进科学知识与尖端设备，如基因编辑、转基因育种等。",
        en: "Highly complex; relies on advanced scientific knowledge and cutting-edge equipment (e.g., gene editing, transgenic breeding).",
      },
    ],
  },

  prodBarrier: {
    title: "S10 生产技术进入难度 — Barriers to Entry in Production Technology",
    levels: [
      {
        score: 2,
        zh: "生产技术简单，操作难度低，无需特殊设备，易上手，门槛低。",
        en: "Simple production techniques; low operational difficulty; no special equipment; easy to start; low barrier.",
      },
      {
        score: 6,
        zh: "生产操作有一定复杂性，需要常规技术设备及一定技能要求。",
        en: "Moderately complex production; requires standard technical equipment and some skill.",
      },
      {
        score: 10,
        zh: "生产技术复杂、操作难度大，依赖先进新技术与设备，对专业知识和经验要求高，门槛高。",
        en: "Highly complex production; high operational difficulty; relies on advanced technologies/equipment; requires strong expertise and experience; high barrier.",
      },
    ],
  },

  rdCost: {
    title: "S11 研发成本 — R&D Cost",
    note: "Quantified using an assignment-based method (赋值法).",
    levels: [],
  },

  symbolicMeaning: {
    title: "S12 花卉象征意义 — Symbolic/Cultural Meaning of the Flower",
    levels: [
      {
        score: 2,
        zh: "无深厚历史或文化背景，象征意义不明确，认知范围有限。",
        en: "Lacks deep historical/cultural background; symbolism is unclear; limited recognition.",
      },
      {
        score: 6,
        zh: "具有一定文化或历史背景，象征意义较明确，但认知度或适用范围有限。",
        en: "Has some cultural/historical background; symbolism is relatively clear, but recognition or applicability is limited.",
      },
      {
        score: 10,
        zh: "具有深厚历史或文化背景，象征意义深刻，且被社会广泛认可。",
        en: "Has deep historical/cultural background; strong symbolism; widely recognized by society.",
      },
    ],
  },

  marketingChannels: {
    title: "S13 营销渠道 — Marketing Channels",
    note: "Quantified using an assignment-based method (赋值法).",
    levels: [],
  },

  transactionModel: {
    title: "S14 转化交易方式 — Commercialization / Transaction Model",
    note: "Quantified using an assignment-based method (赋值法).",
    levels: [],
  },

  transportReq: {
    title: "S15 运输要求 — Transportation Requirements",
    levels: [
      {
        score: 2,
        zh: "需要专业包装和严格温湿度管理；运输时间需尽量缩短。",
        en: "Requires professional packaging and strict temperature/humidity control; transport time should be minimized.",
      },
      {
        score: 6,
        zh: "抗性较好、环境适应能力较强，仅需普通包装和基本环境保护。",
        en: "Good resistance and environmental tolerance; only normal packaging and basic protection needed.",
      },
      {
        score: 10,
        zh: "抗性强，对环境变化不敏感，基本不需要特殊包装与环境控制。",
        en: "Very strong resistance; insensitive to environmental changes; basically no special packaging or environmental control required.",
      },
    ],
  },

  storageReq: {
    title: "S16 仓储要求 — Storage Requirements",
    levels: [
      {
        score: 2,
        zh: "需要较高的环境调控要求，维护成本高。",
        en: "Requires high-level environmental control; high maintenance cost.",
      },
      {
        score: 6,
        zh: "需要基本的温湿度、光照和通风控制设备，维护成本较高。",
        en: "Needs basic control of temperature/humidity/light/ventilation; relatively higher maintenance cost.",
      },
      {
        score: 10,
        zh: "只需自然存储、少量人工维护即可，维护成本低。",
        en: "Can be stored naturally with minimal manual maintenance; low maintenance cost.",
      },
    ],
  },

  policyProtection: {
    title: "S17 保护政策完善性 — Protection Policy Completeness",
    levels: [
      {
        score: 2,
        zh: "法律框架基本缺失，无专门的品种权保护条款。",
        en: "Legal framework is largely absent; no specialized regulations for variety protection.",
      },
      {
        score: 4,
        zh: "法律基础薄弱，有初步的品种权保护条款，但定义模糊、可操作性差。",
        en: "Legal basis is weak; some preliminary protection clauses exist but are vague and poorly operable.",
      },
      {
        score: 6,
        zh: "法律体系相对健全，条款清晰，具备可操作性。",
        en: "Legal system is relatively complete; protection clauses are clear and operable.",
      },
      {
        score: 8,
        zh: "法律体系全面，与国际标准接轨，执法力度较强。",
        en: "Legal system is comprehensive and aligned with international standards; enforcement is relatively strong.",
      },
      {
        score: 10,
        zh: "法律法规高度完善，与国际规则完全同步，具有极强的可操作性和执行力。",
        en: "Highly standardized legal framework fully aligned with international regulations; very strong operability and enforceability.",
      },
    ],
  },

  publicAwareness: {
    title: "S18 公众认知程度 — Public Awareness Level",
    levels: [
      {
        score: 2,
        zh: "从未听说过该植物品种，对品种权保护等概念基本不了解。",
        en: "Public has never heard of the variety; no basic understanding of plant variety rights or protection concepts.",
      },
      {
        score: 4,
        zh: "听说过受保护品种，但无法解释具体含义或相关法律规则。",
        en: "Has heard of protected varieties but cannot clearly explain their meaning or related legal rules.",
      },
      {
        score: 6,
        zh: "能列举1–2个受保护品种，知晓基本法律条款（如保护期限、DUS标准），但仍存在混淆。",
        en: "Can list 1–2 protected varieties and understands basic laws/policies (e.g., protection period, DUS testing), but still confuses related concepts.",
      },
      {
        score: 8,
        zh: "熟悉受保护品种和相关法规，反对侵权并避免购买盗版品种。",
        en: "Familiar with protected varieties and related regulations; opposes infringement and avoids buying pirated varieties.",
      },
      {
        score: 10,
        zh: "高度重视品种权保护，积极宣传并影响他人。",
        en: "Highly aware of plant variety rights; actively promotes protection and influences others.",
      },
    ],
  },
  regulatoryIntensity: {
    title: "S19 监管检查力度 — Regulatory Supervision Intensity",
    levels: [
      {
        score: 2,
        zh: "主要为被动监管，仅在接到投诉后调查。",
        en: "Mostly passive supervision; inspections mainly complaint-driven.",
      },
      {
        score: 4,
        zh: "有限的主动监管，每年1–2次抽查。",
        en: "Limited proactive supervision; 1–2 random inspections per year.",
      },
      {
        score: 6,
        zh: "每月例行检查并进行重点抽查，具备基本执法能力。",
        en: "Monthly routine inspections with key spot checks; basic enforcement capacity exists.",
      },
      {
        score: 8,
        zh: "不定期暗访，设有专业检测实验室，配备专职执法人员。",
        en: "Irregular undercover inspections; professional testing labs established; dedicated enforcement officers in place.",
      },
      {
        score: 10,
        zh: "全流程监管，多部门联合执法，采用DNA检测技术，品种权数据库互通。",
        en: "Full-process supervision; multi-agency coordinated enforcement; DNA-based detection used; variety databases interconnected.",
      },
    ],
  },
  penaltyStrength: {
    title: "S20 惩处力度 — Enforcement / Penalty Strength",
    levels: [
      {
        score: 2,
        zh: "侵权行为普遍，仅处以低额经济赔偿，威慑力弱。",
        en: "Infringement is widespread; mainly small economic fines; weak deterrence.",
      },
      {
        score: 4,
        zh: "罚款额度提高，部分纳入惩戒体系，但执行仍不均衡。",
        en: "Penalties strengthened (higher fines, partial inclusion in penalty records), but enforcement is still imbalanced.",
      },
      {
        score: 6,
        zh: "严重侵权案件可追究刑事责任，建立基本赔偿机制。",
        en: "Serious infringement cases may face criminal liability; basic compensation system exists.",
      },
      {
        score: 8,
        zh: "实施较强惩戒，如终身禁业+高额赔偿（3–5倍）。",
        en: "Strong punitive measures such as lifetime bans plus high compensation (3–5× damages).",
      },
      {
        score: 10,
        zh: "惩罚体系完善、执行严格，具有高度威慑力且应用一致。",
        en: "Comprehensive punishment system with strict, consistent enforcement and high deterrence.",
      },
    ],
  },
};
