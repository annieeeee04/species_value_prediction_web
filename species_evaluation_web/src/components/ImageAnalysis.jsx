import { useRef, useState } from "react";

const CONFIDENCE_LABELS = {
  high: { text: "高置信", color: "#0f766e", bg: "#ecfeff", border: "#67e8f9" },
  medium: { text: "中置信", color: "#92400e", bg: "#fffbeb", border: "#fcd34d" },
  low: { text: "低置信", color: "#6b21a8", bg: "#faf5ff", border: "#c4b5fd" },
};

export default function ImageAnalysis({ onScoresApplied, apiBase }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { scores }
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);

  function handleFile(f) {
    if (!f || !f.type.startsWith("image/")) {
      setError("请上传图片文件（JPG / PNG / WebP）。");
      return;
    }
    setError("");
    setResult(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiBase}/analyze-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "分析失败，请重试。");
      }
      setResult(data);
      setExpanded(true);
    } catch (e) {
      setError(e?.message || "网络错误，请重试。");
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!result?.scores) return;
    const simplified = {};
    for (const [key, val] of Object.entries(result.scores)) {
      simplified[key] = String(val.score);
    }
    onScoresApplied(simplified);
  }

  function clearImage() {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="image-analysis-panel">
      {/* Header */}
      <div className="ia-header">
        <span className="ia-badge">✦ AI 多模态识别</span>
        <p className="ia-desc">上传植物照片，AI 自动分析并填充 S1–S20 评分</p>
      </div>

      {/* Drop Zone */}
      {!preview && (
        <div
          className={`ia-dropzone ${dragOver ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="ia-drop-icon">🌿</div>
          <p className="ia-drop-text">拖拽图片至此，或点击上传</p>
          <p className="ia-drop-hint">支持 JPG、PNG、WebP，最大 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {/* Preview + Actions */}
      {preview && (
        <div className="ia-preview-row">
          <div className="ia-preview-wrap">
            <img src={preview} alt="Plant preview" className="ia-preview-img" />
            <button className="ia-clear-btn" onClick={clearImage} title="移除图片">✕</button>
          </div>

          <div className="ia-action-col">
            <p className="ia-filename">{file?.name}</p>

            <button
              className="ia-analyze-btn"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <span className="ia-spinner-row">
                  <span className="ia-spinner" />
                  AI 分析中…
                </span>
              ) : (
                "✦ 开始 AI 分析"
              )}
            </button>

            {result && (
              <button className="ia-apply-btn" onClick={handleApply}>
                ↓ 应用至评估表单
              </button>
            )}

            {error && <p className="ia-error">{error}</p>}
          </div>
        </div>
      )}

      {/* Result breakdown */}
      {result?.scores && (
        <div className="ia-result-section">
          <button
            className="ia-toggle-btn"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "▲ 收起详情" : "▼ 查看 AI 评分详情"}
          </button>

          {expanded && (
            <div className="ia-scores-grid">
              {Object.entries(result.scores).map(([key, val]) => {
                const idx = key.replace("initialS", "S");
                const conf = CONFIDENCE_LABELS[val.confidence] || CONFIDENCE_LABELS.medium;
                return (
                  <div key={key} className="ia-score-card">
                    <div className="ia-score-row">
                      <span className="ia-score-key">{idx}</span>
                      <span className="ia-score-val">{val.score}</span>
                      <span
                        className="ia-conf-badge"
                        style={{ color: conf.color, background: conf.bg, borderColor: conf.border }}
                      >
                        {conf.text}
                      </span>
                    </div>
                    {val.reason && (
                      <p className="ia-score-reason">{val.reason}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
