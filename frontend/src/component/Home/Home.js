import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import ProductCard from "./ProductCard.js";
import { getProduct } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Home = ({ start }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }),
  ]);
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (error) {
      return alert.error(error);
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="स्वादिष्ट Achar" />

          <div className="banner">
            <p>Welcome to स्वादिष्ट Achar</p>
            <div className="embla" ref={emblaRef}>
            <div className="embla_container">
                {start &&
                  start.map((item, i) => (
                    <div className="embla_slide">
                      <Link to={item.imageurl}>
                        <img
                          className="CarouselImage"
                          key={i}
                          src={item.imagelink}
                          alt={`${i} Slide`}
                        />
                      </Link>
                    </div>
                  ))}
              </div>

              <a href="#container">
                <button>
                  Scroll <CgMouse />
                </button>
              </a>
            </div>
          </div>
          <h2 className="homeHeading">Featured Pickles</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
          </div>

          <div className="btn-div">
            <Link to="/products">
              <button className="showmorebtn">View All Pickles</button>
            </Link>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
