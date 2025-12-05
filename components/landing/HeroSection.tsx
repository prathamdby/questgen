"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGetStarted = async () => {
    const { signIn } = await import("@/lib/auth-client");
    await signIn.social({
      provider: "google",
      callbackURL: "/home",
    });
  };

  const handleViewDemo = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-black via-purple-950/20 to-black pt-16 pb-20 sm:pt-24 sm:pb-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-0" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 h-full flex flex-col justify-center">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className={`mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-purple-200 transition-all duration-700 ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{ animationDelay: "0.1s" }}
          >
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Assessment Engine</span>
          </div>

          {/* Main heading */}
          <h1
            className={`font-playfair text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight mb-8 transition-all duration-700 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            <span className="inline-block bg-gradient-to-r from-purple-200 via-pink-200 to-purple-400 bg-clip-text text-transparent">
              Generate
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-pink-200 via-purple-200 to-pink-400 bg-clip-text text-transparent">
              Perfect Papers
            </span>
            <br />
            <span className="inline-block text-white">in Seconds</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            Transform your teaching workflow. Upload materials, choose patterns,
            and let AI create professional question papers with solutions. Used
            by 10,000+ educators worldwide.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ animationDelay: "0.4s" }}
          >
            <button
              onClick={handleGetStarted}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ touchAction: "manipulation" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-100 group-hover:opacity-90 transition-opacity rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 blur-xl group-hover:opacity-40 transition-all -z-10 rounded-xl" />
              <div className="relative flex items-center justify-center gap-2">
                <span>Start Creating Free</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              onClick={handleViewDemo}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-purple-100 text-lg border border-purple-500/50 hover:border-purple-400/100 bg-black/40 hover:bg-purple-950/40 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              style={{ touchAction: "manipulation" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/20 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <span className="relative">Explore Features</span>
            </button>
          </div>

          {/* Stats bar */}
          <div
            className={`mt-16 grid grid-cols-3 gap-6 pt-16 border-t border-purple-500/20 transition-all duration-700 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ animationDelay: "0.5s" }}
          >
            <div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                10k+
              </div>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                Active Users
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                50k+
              </div>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                Papers Generated
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                92%
              </div>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                Time Saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-0 {
          animation-delay: 0s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
