import { ArrowRight, BadgeCheck, Search, Store } from "lucide-react";
import { useState } from "react";
import AuthModal from "./components/AuthModal";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import { categories, products } from "./data/products";

function App() {
  const [authMode, setAuthMode] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  function openAuth(mode) {
    setAuthMode(mode);
    setMenuOpen(false);
  }

  return (
    <div id="top">
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((current) => !current)} onOpenAuth={openAuth} />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <h1>Everything worth finding, in one marketplace.</h1>
            <p>Curated products from independent sellers. Thoughtful design, useful goods, real people.</p>
            <div className="hero-actions">
              <a className="button primary" href="#discover">Explore products</a>
              <button className="button outline" onClick={() => openAuth("signup")}>Start selling</button>
            </div>
            <div className="hero-trust"><BadgeCheck size={19} /><span>Sellers are reviewed before they can publish products.</span></div>
          </div>
          <div className="hero-media" role="img" aria-label="Curated lamp, ceramic vessel and headphones" />
        </section>

        <section className="discover-section" id="discover">
          <div className="category-bar">
            <div className="category-scroll">
              {categories.map((category) => (
                <button key={category} className={activeCategory === category ? "category active" : "category"} onClick={() => setActiveCategory(category)}>
                  {category}
                </button>
              ))}
            </div>
            <button className="search-button" aria-label="Search products"><Search size={19} /></button>
          </div>

          <div className="section-heading">
            <div><h2>Fresh finds</h2><p>Small-batch pieces from sellers worth knowing.</p></div>
            <a href="#discover">View all <ArrowRight size={16} /></a>
          </div>
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        <section className="seller-section" id="sellers">
          <div className="seller-icon"><Store size={28} /></div>
          <div className="seller-copy"><h2>Bring your shop to Mercato</h2><p>Apply with your brand and business details. An admin reviews every seller before products go live.</p></div>
          <button className="button primary" onClick={() => openAuth("signup")}>Apply to sell <ArrowRight size={17} /></button>
        </section>

        <section className="steps-section" id="how-it-works">
          <h2>A marketplace with clear roles</h2>
          <div className="steps-grid">
            <article><span>01</span><h3>Users discover</h3><p>Create an account, explore products, and apply if you want to start selling.</p></article>
            <article><span>02</span><h3>Sellers build</h3><p>Approved sellers create, update, and manage their own product catalogue.</p></article>
            <article><span>03</span><h3>Admins protect</h3><p>Admins review seller applications and can approve or suspend marketplace access.</p></article>
          </div>
        </section>
      </main>

      <footer><a className="wordmark" href="#top">Mercato</a><p>Independent products. Verified sellers.</p><button onClick={() => openAuth("login")}>Account access</button></footer>

      {authMode ? <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} /> : null}
    </div>
  );
}

export default App;
