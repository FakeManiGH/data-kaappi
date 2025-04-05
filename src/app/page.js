"use client"
import React from "react";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Footer from "./_components/Footer";
import { useNavigation } from "@/app/contexts/NavigationContext";

export default function Home() {
  const { setCurrentIndex } = useNavigation();

  React.useEffect(() => {
    setCurrentIndex("/");
  }
  , [setCurrentIndex]);

  return (
    <>
      <Header />
      <Hero />
      <Footer />
    </>
  );
}
