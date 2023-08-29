import React from 'react';
import { Link } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";


const ProductCard = ({product}) => {
  const options = {
    edit: false,
    color:"rgba(77, 19, 78, 0.2)",
    activeColor: "rgba(255, 0, 0, 1)",
    value:product.ratings,
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 25,
};
  return (
   <Link className="productCard" to={`/product/${product._id}`}>
    <img src={product.images[0].url} alt ={product.name} />
    <p>{product.name}</p>
    <div>
        <ReactStars {...options} /><span>({product.numOfReviews} reviews) </span>
    </div>
    <span style={{color:"#001a14"}}>{`$${product.price}`}</span>
    </Link>
  )
}

export default ProductCard
