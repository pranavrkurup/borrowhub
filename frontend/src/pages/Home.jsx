import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container" style={{ paddingBottom: '90px' }}>
      
      {/* ─── 2-Column Hero Section ─── */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center pt-16 pb-20 px-6">

        {/* ── Left Column: Copy & CTA ── */}
        <div className="flex flex-col items-start">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#485550] leading-tight tracking-tight mb-6">
            Borrow What You Need.
            <span className="text-[#C0EB6A] block mt-2">Share What You Have.</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
            A frictionless college peer-to-peer equipment sharing platform. Access scientific calculators, textbooks, IoT kits, and DSLR cameras directly from fellow students across campus.
          </p>

          {/* CTA Button */}
          <Link
            to="/feed"
            className="inline-block bg-[#C0EB6A] text-[#485550] px-10 py-4 rounded-full font-bold text-lg shadow-md hover:shadow-lg hover:scale-105 hover:bg-[#aee050] transition-all duration-200 mb-16"
          >
            Browse the Feed →
          </Link>

          {/* Stat Cards */}
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-xl flex-1 min-w-[140px] text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-2xl font-extrabold text-[#485550]">2,500+</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Active Students</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-xl flex-1 min-w-[140px] text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-2xl font-extrabold text-[#485550]">8,000+</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Items Shared</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-xl flex-1 min-w-[140px] text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-2xl font-extrabold text-[#485550]">100%</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Trusted Peers</div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Hub Graphic ── */}
        <div className="relative w-full aspect-square flex items-center justify-center hidden lg:flex">
          {/* Concentric Orbit Circles */}
          <div className="border border-gray-200 rounded-full absolute w-[85%] h-[85%] opacity-60"></div>
          <div className="border border-gray-200 rounded-full absolute w-[62%] h-[62%] opacity-50"></div>
          <div className="border border-gray-100 rounded-full absolute w-[40%] h-[40%] opacity-40"></div>

          {/* Center Logo */}
          <img
            src="/logo.png"
            alt="BorrowHub Logo"
            className="w-24 h-24 object-contain drop-shadow-lg z-10 relative"
          />

          {/* Floating Item: Camera */}
          <div className="absolute top-8 right-12 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="text-2xl">📷</span>
            <span className="text-sm font-semibold text-[#485550]">DSLR Camera</span>
          </div>

          {/* Floating Item: Calculator */}
          <div className="absolute bottom-24 left-6 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <span className="text-2xl">🧮</span>
            <span className="text-sm font-semibold text-[#485550]">Calculator</span>
          </div>

          {/* Floating Item: Textbook */}
          <div className="absolute top-1/3 left-2 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <span className="text-2xl">📚</span>
            <span className="text-sm font-semibold text-[#485550]">Textbooks</span>
          </div>

          {/* Floating Item: IoT Kit */}
          <div className="absolute bottom-12 right-8 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>
            <span className="text-2xl">🔌</span>
            <span className="text-sm font-semibold text-[#485550]">IoT Kit</span>
          </div>
        </div>
      </div>

      {/* ─── Value Props Row (Full Width) ─── */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 py-12 px-6 border-t border-gray-100">
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">🎓</span>
          <h3 className="font-bold text-[#485550] text-sm">Verified Students</h3>
          <p className="text-xs text-gray-500">Every user is a verified college student on your campus.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">🤝</span>
          <h3 className="font-bold text-[#485550] text-sm">Easy & Safe</h3>
          <p className="text-xs text-gray-500">Simple request flow with built-in accountability tracking.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">♻️</span>
          <h3 className="font-bold text-[#485550] text-sm">Sustainable Campus</h3>
          <p className="text-xs text-gray-500">Share resources instead of buying new — reduce waste together.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">💰</span>
          <h3 className="font-bold text-[#485550] text-sm">Save Money</h3>
          <p className="text-xs text-gray-500">Why buy when you can borrow? Keep more in your pocket.</p>
        </div>
      </div>

    </div>
  );
};

export default Home;
