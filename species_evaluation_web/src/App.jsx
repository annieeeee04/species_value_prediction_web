import { useMemo, useState } from "react";
import Header from "./components/Header";
import EvaluationPage from "./components/EvaluationPage";

const INITIAL_INPUTS = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => [`initialS${i + 1}`, ""])
);

export default function App() {
  const [userInput, setUserInput] = useState(INITIAL_INPUTS);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canPredict = useMemo(
    () =>
      Object.values(userInput).every((v) => v !== "" && !Number.isNaN(Number(v))),
    [userInput]
  );

  function handleChange(inputIdentifier, newValue) {
    setUserInput((prev) => ({ ...prev, [inputIdentifier]: newValue }));
    setPrediction(null);
    setError("");
  }

  async function handlePredict() {
    setError("");

    const payload = {};
    for (const [k, v] of Object.entries(userInput)) {
      if (v === "" || Number.isNaN(Number(v))) {
        setError(`Please enter a valid number for ${k.replace("initial", "")}`);
        return;
      }
      payload[k] = Number(v);
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.detail
            ? typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail)
            : "API error";
        throw new Error(msg);
      }

      setPrediction(data.prediction);
    } catch (e) {
      setError(e.message || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <EvaluationPage userInput={userInput} onChange={handleChange} />

      <div className="predict-panel">
        <button
          className="primary-btn"
          onClick={handlePredict}
          disabled={loading || !canPredict}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {!canPredict && !loading && (
          <p className="hint-text">Fill in all S1–S20 to enable prediction.</p>
        )}

        {error && <p className="error-text">{error}</p>}

        {prediction !== null && (
          <p className="result-text">
            Prediction: <strong>{Number(prediction).toFixed(3)}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
