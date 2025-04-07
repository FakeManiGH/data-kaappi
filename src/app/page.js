"use client"
import React, { useEffect } from "react";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Footer from "./_components/Footer";
import { useNavigation } from "@/app/contexts/NavigationContext";

export default function Home() {
  const { setCurrentIndex } = useNavigation();

  useEffect(() => {
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
