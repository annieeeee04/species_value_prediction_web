const CONTEXT_FIELDS = [
  {
    key: "market",
    icon: "📈",
    label: "市场与商业",
    labelEn: "Market & Commercial",
    dims: "S3 · S4 · S6 · S13 · S14",
    placeholder:
      "例如：该品种主要销往哪些市场？终端售价区间是多少？主要买家群体（礼品、园艺爱好者、商业景观）？是否已在电商/花卉批发市场上架？与同类品种相比有何差异化卖点？",
  },
  {
    key: "production",
    icon: "🌱",
    label: "生产与育种",
    labelEn: "Production & Breeding",
    dims: "S8 · S9 · S10 · S11",
    placeholder:
      "例如：繁殖方式（扦插/嫁接/组培/种子）？栽培难度和技术门槛？育种年限和研发投入？是否需要温控设施或特殊基质？大规模量产是否已实现？",
  },
  {
    key: "cultural",
    icon: "🎋",
    label: "文化与象征",
    labelEn: "Cultural & Symbolic",
    dims: "S2 · S12",
    placeholder:
      "例如：该植物在中国或其他文化中有哪些象征意义？是否与特定节日、习俗或文学作品相关？是否常用于婚庆、祭祀、礼品赠送等场合？公众认知度如何？",
  },
  {
    key: "regulatory",
    icon: "⚖️",
    label: "法规与知识产权",
    labelEn: "Regulatory & IP",
    dims: "S17 · S18 · S19 · S20",
    placeholder:
      "例如：是否已申请植物新品种权（PVP）或专利？在哪个国家/地区受保护？市场上是否存在侵权问题？监管部门是否有定期检查？侵权处罚力度如何？",
  },
];

export default function ContextInput({ context, onChange }) {
  return (
    <section className="context-input-section">
      <div className="context-input-header">
        <span className="context-input-title">
          <span className="context-icon">📋</span> 补充背景信息
          <span className="context-title-en"> — Background Context</span>
        </span>
        <span className="context-input-hint">
          填写越详细，Agent 评分越准确；所有字段均为选填
        </span>
      </div>

      <div className="context-grid">
        {CONTEXT_FIELDS.map(({ key, icon, label, labelEn, dims, placeholder }) => (
          <div key={key} className="context-card">
            <div className="context-card-header">
              <span className="context-card-icon">{icon}</span>
              <div>
                <span className="context-card-label">{label}</span>
                <span className="context-card-label-en"> — {labelEn}</span>
              </div>
              <span className="context-card-dims">{dims}</span>
            </div>
            <textarea
              className="context-textarea"
              rows={3}
              placeholder={placeholder}
              value={context[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
