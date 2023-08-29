import React from 'react';
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
    return(
        <footer id = "footer">
            <div className = "leftFooter">
                <h4>Download Our App</h4>
                <p>Coming Soon, if we reach 1K milestone</p>
                <img src={playStore} alt="playStore" />
                <img src={appStore} alt="appStore" />
            </div>
            <div className = "middleFooter">
                <h1>स्वादिष्ट Achar</h1>
                <p>One stop destination for all kinds of freshly homemade pickles, from Gaau</p>
                <p> Copyrights &copy; Suman</p>
            </div>
            <div className = "rightFooter">
                <h4>Follow US</h4>
                <a href = "https://www.facebook.com/suman.khadka.9028" target = "_blank" rel = "noreferrer">Facebook</a>
                <a href = "https://www.instagram.com/suman_khadka_9028/" target = "_blank" rel = "noreferrer">Instagram</a>
                <a href = "https://twitter.com/suman_khadka_9" target = "_blank" rel = "noreferrer">Twitter</a>
            </div>

        </footer>
    );
};

export default Footer;