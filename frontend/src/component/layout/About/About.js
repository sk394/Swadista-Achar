import React from 'react';
import "./About.css";
import { Button, Avatar, Typography } from '@mui/material';
import { GitHub, YouTube, Instagram, LinkedIn } from '@mui/icons-material';
import Logo2 from "../../../images/logo2.jpeg";

const About = () => {
    const visitInstagram = () => {
        window.location="https://www.instagram.com/iamsumankd/";
    };
  return (
    <div className="aboutSection">
    <div></div>
    <div className="aboutSectionGradient"></div>
    <div className="aboutSectionContainer">
      <Typography component="h1">About स्वादिष्ट Achar</Typography>

      <div>
        <div>
          <Avatar
            style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
            src= {Logo2}
            alt="logopickle"
          />
          <Typography>स्वादिष्ट Achar</Typography>
          <Button onClick={visitInstagram} color="primary">
          Welcome to Swadista Achar, your one-stop destination for authentic Nepali achaar (pickles). 
          We take immense pride in offering you a diverse range of locally crafted, freshly homemade pickles that 
          are deeply rooted in Nepali tradition and culture. Our mission is to bring 
          the rich flavors and traditional essence of Nepali achaar to your table, wherever you are in the world.
          </Button>
          <span>
            This Ecommerce project is created for learning purpose,  by @sk394. 
          </span>
        </div>
        <div className="aboutSectionContainer2">
          <Typography component="h2">Follow US</Typography>
          <a
            href="https://www.youtube.com/channel/UCJKr5bIL9ZoUTdy3dt3Bulw"
            target="blank"
          >
            <YouTube className="youtubeSvgIcon" />
          </a>

          <a href="https://www.instagram.com/iamsumankd/" target="blank">
            <Instagram className="instagramSvgIcon" />
          </a>
          <a href="https://github.com/sk394" target="blank">
            <GitHub className="instagramSvgIcon" />
          </a>
          <a href="https://www.linkedin.com/in/iamsumankd/" target="blank">
            <LinkedIn className="instagramSvgIcon" />
          </a>
          <Typography component="h2">Our Story</Typography>
          <p>
          <Button color="primary">
          Our journey began with a deep appreciation for the flavors of Nepal. The art of making
           achaar has been passed down through generations, and we saw the need to share these unique
            tastes with pickle enthusiasts globally. Each jar of achaar represents the love, heritage, 
            and meticulous attention to detail that Nepali households have put into their culinary traditions 
            for years. We work closely with local artisans and home cooks to curate a collection
           that celebrates the diversity of Nepali achaar, offering you a taste of the Himalayan kitchen.
          </Button>
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default About
