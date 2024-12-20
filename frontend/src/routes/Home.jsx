import Destination from "../components/destination/Destination";
import Footer from "../components/sections/Footer";
import Hero from "../components/Hero/Hero";
import Navbar from "../components/sections/Navbar";
import Trip from "../components/trip/Trip";
import ImageSlider from "../components/Slider/ImageSlider";
import Features from "../components/Features/Features";


import img1 from '../assets/5.jpg';
import img2 from '../assets/8.jpg';
import img3 from '../assets/6.jpg';
import img4 from '../assets/Chauli_ki_Jal.jpeg';
import img5 from '../assets/Nainadevi.jpeg';

import HomeImage from '../assets/Hero.jpeg'

function Home() {

  const images = [
    img1,
    img2,
    img3,
    img4,
    img5,
  ];

  const heading = [
    "Barapatthar",
    "Khurpa Tal",
    "Nanital Caves",
    "Chauli ki Jal",
    "Nainadevi",
  ]

  return (
    <>
       <Navbar />
       <Hero 
       cName="hero" 
       heroImg={HomeImage}
      title="SunRaj Taxi Services"
       text="EMBARK ON UNFORGETTABLE JOURNEYS" 
       buttonText="Get Started"
       url="/"
       btnClass="hide" 
       />
       <Features />
       <ImageSlider heading={heading} images={images} interval={2000} />
       <Destination />
       <Trip />
       <Footer />
    </>
  );
}

export default Home;
