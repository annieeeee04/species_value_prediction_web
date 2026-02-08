import { useMemo, useState } from "react";
import Header from "./components/Header";
import EvaluationPage from "./components/EvaluationPage";
import { FIELDS } from "./constants/fields";

const INITIAL_INPUTS = Object.fromEntries(
  FIELDS.map(({ key }) => [key, { value: "", touched: false }])
);

export default function App() {
  const [userInput, setUserInput] = useState(INITIAL_INPUTS);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const[saved, setSaved] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

  const canPredict = useMemo(() => {
    return Object.values(userInput).every(({ value }) => {
      if (value === "") return true;
      return !Number.isNaN(Number(value));
    });
  }, [userInput]);

  function handleChange(inputIdentifier, newValue) {
    setUserInput((prev) => ({
      ...prev,
      [inputIdentifier]: {
        value: newValue,
        touched: true,
      },
    }));
    setPrediction(null);
    setSaved(false);
    setError("");
  }

  async function handlePredict() {
    setError("");

    const payload = {};

    for (const [k, {value}] of Object.entries(userInput)) {
      const finalVal = value === "" ? 6 : Number(value);

      if (Number.isNaN(finalVal)) {
        setError("Please enter a valid number for this field.");
        return;
      }

      payload[k] = finalVal;
    }

    setLoading(true);
    try {
      console.log("API_BASE:", API_BASE);
      console.log("payload:", payload);

      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg = data?.detail
          ? typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail)
          : text || "API error";
        throw new Error(msg);
      }

      setPrediction(data.prediction);
      setSaved(data.saved);
    } catch (e) {
      setError(e?.message || "Prediction failed.");
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

        {!loading && (
          <p className="hint-text">
            Leave any field blank to use the default value (6).
          </p>
        )}

        {error && <p className="error-text">{error}</p>}

        {prediction !== null && (
          <p className="result-text">
            Prediction: <strong>{Number(prediction).toFixed(3)}</strong>
            {saved && <span className="saved-badge"> ✔️ saved</span>}
          </p>
        )}
      </div>
    </div>
  );
}
