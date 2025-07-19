import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { delay, motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (user) {
      navigate("/result");
    } else {
      setShowLogin(true);
    }
  };
  return (
    <motion.div
      className="flex flex-col items-center text-center my-20 px-4"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Badge */}
      <motion.div
        className="text-stone-500 inline-flex items-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p>Best text to image generator</p>
        <img src={assets.star_icon} alt="star icon" className="w-4 h-4" />
      </motion.div>

      {/* Main Heading */}
      <motion.h1 className="text-4xl sm:text-7xl max-w-[90%] sm:max-w-[720px] mx-auto font-bold leading-tight">
        Turn text to{" "}
        <span
          className="text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 2 }}
        >
          image
        </span>
        , in seconds.
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="text-gray-600 max-w-2xl mx-auto mt-5 text-base sm:text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Unleash your creativity with AI. Turn your imagination into visual art
        in seconds—just type, and watch the magic happen.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        onClick={onClickHandler}
        className="sm:text-lg text-white bg-black mt-8 px-8 sm:px-12 py-2.5 flex items-center gap-2 rounded-full hover:bg-gray-800 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          default: { duration: 0.5 },
          opacity: { delay: 0.8, duration: 1 },
        }}
      >
        Generate Images
        <img src={assets.star_group} alt="star group" className="w-5 h-5" />
      </motion.button>

      {/* Sample Images */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex flex-wrap justify-center mt-12 gap-3"
      >
        {Array(6)
          .fill("")
          .map((_, index) => (
            <motion.img
              whileHover={{ scale: 1.05, duration: 0.1 }}
              key={index}
              className="rounded hover:scale-105 transition-all duration-300 cursor-pointer w-16 sm:w-20"
              src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1}
              alt={`sample-${index}`}
            />
          ))}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-2 text-neutral-600"
      >
        Generated Images from imagify
      </motion.p>
    </motion.div>
  );
};

export default Header;
