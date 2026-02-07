import heroImg from "../assets/crabapple_bg1.png";

export default function Header() {
    return (
      <header className="app-header">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="hero-content">
          <h1 className="app-title">Species Evaluation</h1>
        </div>
      </header>
    );
  }
