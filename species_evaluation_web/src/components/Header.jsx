import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="app-header">
      <img src={logo} alt="Crabapple logo" className="app-logo" />
      <h1 className="app-title">Species Evaluation</h1>
    </header>
  );
}
