import { FIELDS } from "../constants/fields";
import { SCALES } from "../constants/Scales";
import { useState } from "react";
import ScaleModal from "./ScaleModal";

export default function EvaluationPage({ userInput, onChange }) {
  const [openKey, setOpenKey] = useState(null);

  return (
    <section id="user-input">
      <div className="input-scroll-container">
        <div className="input-grid">
          {FIELDS.map(({ key, label, en }) => (
            <p key={key}>
              <button
                type="button"
                className="field-label-btn"
                onClick={() => setOpenKey(key)}
              >
                {label}
                {en ? <span className="label-en"> — {en}</span> : null}
                {SCALES[key] ? <span className="label-help"></span> : null}
              </button>

              <input
                type="number"
                value={userInput[key].touched ? userInput[key].value : ""}
                onChange={(e) => onChange(key, e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </p>
          ))}
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
