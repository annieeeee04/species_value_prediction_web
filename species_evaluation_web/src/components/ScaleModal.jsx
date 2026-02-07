import { createPortal } from "react-dom";

export default function ScaleModal({ open, scale, onClose }) {
  if (!open || !scale) return null;

  const levels = scale.levels ?? [];

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{scale.title}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {scale.note && <p className="scale-note">{scale.note}</p>}

          {levels.length > 0 ? (
            <div className="scale-table">
              <div className="scale-row scale-head">
                <div>Score</div>
                <div>说明 (中文)</div>
                <div>Description (EN)</div>
              </div>

              {levels.map((lvl) => (
                <div className="scale-row" key={lvl.score}>
                  <div className="scale-score">{lvl.score}</div>
                  <div>{lvl.zh}</div>
                  <div>{lvl.en}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="scale-empty">No rating scale defined yet for this indicator.</p>
          )}

          <p className="scale-tip">
            Tip: leave blank = default 6 (if you enabled that logic).
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
