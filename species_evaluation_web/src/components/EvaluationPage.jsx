

const FIELDS = Array.from({ length: 20 }, (_, i) => {
    const n = i + 1;
    return { key: `initialS${n}`, label: `S${n}` };
  });

export default function EvaluationPage({ userInput, onChange }) {
  return (
    <section id="user-input">
      <div className="input-scroll-container">
        <div className="input-grid">
          {FIELDS.map(({ key, label }) => (
            <p key={key}>
              <label>{label}</label>
              <input
                type="number"
                required
                value={userInput[key]}
                onChange={(e) => onChange(key, e.target.value)}
                onWheel={(e) => e.target.blur()} 
              />
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
