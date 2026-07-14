import { useState } from "react";
import Icon from "./Icon";

function ProductCard({ product }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} />
        <button
          className={saved ? "heart-button saved" : "heart-button"}
          onClick={() => setSaved((current) => !current)}
          aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
        >
          <Icon name="heart" filled={saved} />
        </button>
      </div>
      <div className="product-details">
        <div><h3>{product.name}</h3><p>by {product.seller}</p></div>
        <strong>${product.price.toFixed(2)}</strong>
      </div>
    </article>
  );
}

export default ProductCard;
