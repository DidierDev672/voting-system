"use client";

import { useEffect, useState } from "react";

interface WelcomeBannerProps {
  userName?: string;
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const [greeting, setGreeting] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 18) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");

    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const currentDate = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#3d2f1f] via-[#5a4332] to-[#8b7355] rounded-2xl p-8 md:p-12">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#d4c5b0] rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#f5f1eb] rounded-full translate-x-20 translate-y-20 blur-3xl"></div>
      </div>

      <div
        className={`relative transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-[#d4c5b0] text-sm uppercase tracking-widest mb-2">
          {currentDate}
        </p>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#faf8f5] mb-4">
          {greeting}{" "}
          <span className="font-medium text-[#d4a574]">
            {userName || "Usuario"}
          </span>
        </h1>

        <p className="text-[#b8a896] text-base md:text-lg max-w-xl leading-relaxed">
          Es un placer tenerte de vuelta. Aquí encontrarás todo lo necesario para
          gestionar el sistema de votación municipal.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-[#faf8f5]/10 backdrop-blur-sm rounded-full text-[#faf8f5] text-sm border border-[#faf8f5]/20 animate-pulse">
            Sistema Activo
          </div>
          <div className="px-4 py-2 bg-[#faf8f5]/10 backdrop-blur-sm rounded-full text-[#d4c5b0] text-sm border border-[#faf8f5]/20">
            Democracy Lab
          </div>
        </div>
      </div>

      <div
        className={`absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#d4a574]/20 rounded-full transition-all duration-1000 delay-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      ></div>
      <div
        className={`absolute -bottom-8 -right-8 w-32 h-32 border border-[#d4a574]/10 rounded-full transition-all duration-1000 delay-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      ></div>
    </div>
  );
}
