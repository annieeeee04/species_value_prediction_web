import { useState } from "react";

export default function AgentSearch({ onScoresApplied, apiBase, context }) {
  const [speciesName, setSpeciesName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!speciesName.trim()) return;
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/agent-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species_name: speciesName.trim(),
          context_market: context?.market || "",
          context_production: context?.production || "",
          context_cultural: context?.cultural || "",
          context_regulatory: context?.regulatory || "",
        }),
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }

      if (!res.ok) {
        const msg = data?.detail
          ? (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail))
          : (text || "Agent search failed");
        throw new Error(msg);
      }

      setResult(data);
    } catch (e) {
      setError(e?.message || "Agent search failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleApplyScores() {
    if (!result?.scores) return;
    onScoresApplied(
      Object.fromEntries(
        Object.entries(result.scores).map(([k, v]) => [k, String(v)])
      )
    );
  }

  return (
    <section className="agent-search-section">
      <h2 className="agent-search-title">
        <span className="agent-icon">🤖</span> Agent 智能搜索评估
      </h2>
      <p className="agent-search-desc">
        输入植物品种名称，Agent 将自动联网搜索市场、生态和文化信息，并预测其品种价值。
      </p>

      <div className="agent-search-row">
        <input
          className="agent-search-input"
          type="text"
          placeholder="例如：海棠、月季 Rosa、Malus spectabilis..."
          value={speciesName}
          onChange={(e) => setSpeciesName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
          disabled={loading}
        />
        <button
          className="primary-btn agent-search-btn"
          onClick={handleSearch}
          disabled={loading || !speciesName.trim()}
        >
          {loading ? "搜索中..." : "开始搜索"}
        </button>
      </div>

      {loading && (
        <div className="agent-loading">
          <div className="agent-spinner" />
          <span>Agent 正在联网搜索并分析，请稍候（约30-60秒）...</span>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="agent-result">
          <div className="agent-result-header">
            <span className="agent-species-name">📌 {result.species_name}</span>
            <span className="agent-prediction-badge">
              预测价值：<strong>{Number(result.prediction).toFixed(3)}</strong>
            </span>
          </div>

          {result.summary && (
            <p className="agent-summary">{result.summary}</p>
          )}

          {result.search_queries?.length > 0 && (
            <details className="agent-queries">
              <summary>已执行 {result.search_queries.length} 次搜索</summary>
              <ul>
                {result.search_queries.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </details>
          )}

          {result.sources?.length > 0 && (
            <details className="agent-sources">
              <summary>参考来源</summary>
              <ul>
                {result.sources.map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="agent-scores-grid">
            {Object.entries(result.scores).map(([k, v]) => (
              <span key={k} className="agent-score-chip">
                {k.replace("initialS", "S")}: <strong>{v}</strong>
              </span>
            ))}
          </div>

          <button className="secondary-btn agent-apply-btn" onClick={handleApplyScores}>
            ✦ 将评分填入表单并重新预测
          </button>
        </div>
      )}
    </section>
  );
}
