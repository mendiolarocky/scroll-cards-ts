import logo from "./assets/magic-logo.png";
function Header({ cardsLength }: { cardsLength: number }) {
  return (
    <>
      <header className="fixed-header">
        <div className="image-container">
          <img src={logo} alt="Magic Logo" />
        </div>
        <div className="actions-tab">
          <span className="action-item row">
            <p className="text-info">Total Rows: {cardsLength}</p>
          </span>
        </div>
      </header>
    </>
  );
}

export default Header;
