import Icon from "./Icon";

function Header({ menuOpen, onToggleMenu, onOpenAuth }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top">Mercato</a>
      <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
        <a href="#discover" onClick={onToggleMenu}>Discover</a>
        <a href="#sellers" onClick={onToggleMenu}>For sellers</a>
        <a href="#how-it-works" onClick={onToggleMenu}>How it works</a>
      </nav>
      <div className="header-actions">
        <button className="text-button" onClick={() => onOpenAuth("login")}>Log in</button>
        <button className="button primary small" onClick={() => onOpenAuth("signup")}>Sign up</button>
        <button className="bag-button" aria-label="Shopping bag"><Icon name="bag" /><span>0</span></button>
        <button className="menu-button" onClick={onToggleMenu} aria-label="Toggle navigation">
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}

export default Header;
