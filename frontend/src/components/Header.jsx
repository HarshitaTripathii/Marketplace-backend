import { Menu, ShoppingBag, X } from "lucide-react";

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
        <button className="bag-button" aria-label="Shopping bag"><ShoppingBag size={19} /><span>0</span></button>
        <button className="menu-button" onClick={onToggleMenu} aria-label="Toggle navigation">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
