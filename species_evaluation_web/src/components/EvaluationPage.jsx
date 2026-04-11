import { FIELDS } from "../constants/fields";
import { SCALES } from "../constants/Scales";
import { useState } from "react";
import ScaleModal from "./ScaleModal";

export default function EvaluationPage({ userInput, onChange, aiFilledKeys = new Set() }) {
  const [openKey, setOpenKey] = useState(null);

  return (
    <section id="user-input">
      {aiFilledKeys.size > 0 && (
        <div className="ai-fill-notice">
          <span className="ai-fill-icon">✦</span>
          AI 已预填 {aiFilledKeys.size} 个字段
          <span className="ai-fill-hint">（蓝色高亮）—— 可手动修改</span>
        </div>
      )}

      <div className="input-scroll-container">
        <div className="input-grid">
          {FIELDS.map(({ key, label, en }) => {
            const isAiFilled = aiFilledKeys.has(key);
            return (
              <p key={key} className={isAiFilled ? "ai-filled-field" : ""}>
                <button
                  type="button"
                  className={`field-label-btn ${isAiFilled ? "ai-filled-label" : ""}`}
                  onClick={() => setOpenKey(key)}
                >
                  {isAiFilled && <span className="ai-dot" title="AI 预填">✦</span>}
                  {label}
                  {en ? <span className="label-en"> — {en}</span> : null}
                </button>

                <input
                  type="number"
                  value={userInput[key].value}
                  placeholder="6"
                  className={isAiFilled ? "ai-filled-input" : ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </p>
            );
          })}
        </div>
      </div>

      <ScaleModal
        open={!!openKey}
        scale={openKey ? SCALES[openKey] : null}
        onClose={() => setOpenKey(null)}
      />
    </section>
  );
}
