import React from "react";
import { useParams } from "react-router-dom";

function ProductPage() {
  const { id } = useParams();
  const fallbackIndex = (Number(id) % 3) + 1;
  const product = { 
    _id: id, 
    name: `Product ${id}`,
    price: 79.9, 
    description: 'Sample product description with premium fabrics and a minimalist silhouette.',
    image: `/images/product${fallbackIndex}.jpg`
  };

  return (
    <div className="container page product-page">
      <div className="product-page-grid">
        <img src={product.image} className="product-page-img" alt={product.name} />
        <div className="product-page-details">
          <h2 className="product-title">{product.name}</h2>
          <div className="price">${product.price}</div>
          <p className="description">{product.description}</p>
          <button className="btn">Add to Cart</button>    
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

