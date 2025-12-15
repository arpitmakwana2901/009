import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarIcon,
  ClockIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";

const HeroSection = () => {
  const [heroes, setHeroes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/homepage`)
      .then((res) => setHeroes(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [heroes.length]);

  if (heroes.length === 0)
    return <div className="text-white p-6">Loading...</div>;

  const hero = heroes[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroes.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroes.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={hero._id}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.image})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent"></div>

      <div className="relative z-10 flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 h-full text-white">
        <img src={hero.logo} alt="" className="max-h-10 lg:h-11 mt-20" />

        <h1 className="text-4xl md:text-[70px] font-semibold max-w-110 drop-shadow-lg leading-tight">
          {hero.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-300 flex-wrap">
          <span>{hero.genres}</span>
          <div className="flex items-center gap-1 text-sm">
            <CalendarIcon className="w-4 h-4" /> {hero.year}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <ClockIcon className="w-4 h-4" /> {hero.duration}
          </div>
        </div>

        <p className="max-w-md text-gray-300 text-sm md:text-base">
          {hero.description}
        </p>

        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-2 px-6 py-3 text-sm bg-red-500 hover:bg-red-600 text-white transition rounded-full font-medium cursor-pointer"
        >
          Explore Movies
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 md:px-16 lg:px-36">
          <button
            onClick={goToPrev}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition focus:outline-none"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition focus:outline-none"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {heroes.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === currentIndex
                ? "bg-red-500"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
