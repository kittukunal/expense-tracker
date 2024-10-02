import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

import NavBar from "../components/NavBar";
import bgImage from "../assets/landing-bg4.jpeg";

const Home = () => {
  const navigate = useNavigate();
  const userIsVerified = useSelector((state) => state.auth?.user?.verified);

  useEffect(() => {
    if (userIsVerified) {
      navigate("/dashboard");
    }
  }, [userIsVerified]);

  return (
    <main
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10">
        <NavBar />

        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center px-4 sm:px-6 py-16 sm:py-20 text-center min-h-[90vh]">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white leading-snug sm:leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Simplify Your{" "}
            <TypeAnimation
              sequence={["Money", 2000, "Expenses", 2000, "Savings", 2000]}
              wrapper="span"
              speed={20}
              className="text-blue-400 inline-block"
              repeat={Infinity}
            />{" "}
            Management in Minutes
          </motion.h2>

          <div className="relative mt-6 w-full px-2 sm:px-4 max-w-2xl">
            <div className="absolute inset-0 bg-black/70 rounded-md blur-sm -z-10" />

            <motion.p
              className="text-white text-base sm:text-lg font-medium leading-relaxed tracking-wide px-2 py-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Track your expenses, monitor your incomes, and get instant insights into
              your finances. <span className="font-semibold">Expense Tracker</span> makes budgeting easy and effective — with zero stress.
            </motion.p>
          </div>

          <motion.div
            className="mt-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Button
              color="primary"
              size="lg"
              onClick={() => navigate("/register")}
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
            >
              Get Started
            </Button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full text-center py-4 text-white/80 text-xs sm:text-sm">
          © 2025 Expense Tracker · Developed by <span className="font-semibold text-white">Kunal Yadav</span>
        </footer>
      </div>
    </main>
  );
};

export default Home;
