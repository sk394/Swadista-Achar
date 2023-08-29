import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { getProduct, clearErrors } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const categories = [
  "Vegetable Achar",
  "Fruit Achar",
  "Spicy Delight",
  "Mild Pleasures",
  "Special Blends",
  "Sukako Achar",
  "Tomato Achar",
  "Achar Masala",
  "Non Veg Achar",
  "Achar Mix Wine",
  "Achar Wild Mix",
];

const Products = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { keyword } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 25000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productCount,
    resPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);
  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  let count = filteredProductsCount;
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  
  useEffect(() => {
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

 

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Swadista Achar"} />
          <div id="base-container">
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          {/* filternation */}
          <div className="filterBox">
            <Typography>
              Price
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={50000}
              />
            </Typography>

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => setRatings(newRating)}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {/* pagination */}
          {resPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productCount}
                onChange={setCurrentPageNo}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
          
          </div>
        </Fragment>
      )}
    </>
  );
};

export default Products;
