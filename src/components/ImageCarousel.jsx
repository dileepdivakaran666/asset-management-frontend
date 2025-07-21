import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";

const images = [
  {
    url: "https://images.unsplash.com/photo-1581093588401-94c52fd00f01?auto=format&fit=crop&w=1400&q=80",
    title: "Welcome to Dashboard",
  },
  {
    url: "https://images.unsplash.com/photo-1555421689-43cad7100751?auto=format&fit=crop&w=1400&q=80",
    title: "Track Your Assets Efficiently",
  },
  {
    url: "https://images.unsplash.com/photo-1581090700227-1d736f73ca09?auto=format&fit=crop&w=1400&q=80",
    title: "Powerful Asset Management System",
  },
];

const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <Box sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
      <Slider {...settings}>
        {images.map((img, i) => (
          <Box
            key={i}
            sx={{
              position: "relative",
              height: { xs: 200, sm: 300, md: 350 },
              backgroundImage: `url(${img.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
              px: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(0,0,0,0.5)",
                py: 2,
                px: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" fontWeight={700}>
                {img.title}
              </Typography>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ImageCarousel;
