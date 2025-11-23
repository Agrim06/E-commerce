import React from "react";
import { Link } from "react-router-dom";
import image1 from '../images/1.png';
import image2 from '../images/2.png';
import image3 from '../images/3.png';

function HomePage(){
    const sampleProducts = [
        { _id: '1', name: 'Sample Product A', price: 99.99, image: image1 },
        { _id: '2', name: 'Sample Product B', price: 49.99, image: image2 },
        { _id: '3', name: 'Sample Product C', price: 29.99, image: image3 },
    ];

    return(
        <div className="container page">
            <div className="page-title">Featured Products</div>
            <div className="product-grid">
                {sampleProducts.map((p) => (
                    <div key={p._id} className="product-card">
                        <Link to={`/product/${p._id}`}>
                            <img src={p.image} alt={p.name} className="product-img" />
                        </Link>
                        <div className="product-info">
                            <Link to={`/product/${p._id}`} className="product-name">{p.name}</Link>
                            <div className="product-bottom">
                                <div className="product-price">${p.price}</div>
                                 <button className="btn">Add</button>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default HomePage;