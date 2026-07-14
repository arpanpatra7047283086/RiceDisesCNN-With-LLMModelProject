'use client'

import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

interface HeroProps {
  onScrollToDetector: () => void
}

export function Hero({ onScrollToDetector }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-rice-field.png"
          alt="Rice Field"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-emerald-900/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-white text-center">
        <div className="mb-8 inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-200 text-sm font-semibold">
          ✨ AI-Powered Agricultural Intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
          Detect Rice Leaf Diseases with AI
        </h1>
        <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto font-light">
          Powered by advanced artificial intelligence to help you protect your rice crops and maximize yields with precision farming.
        </p>
        <button
          onClick={onScrollToDetector}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/50 transition duration-300 inline-flex items-center gap-2"
        >
          Start Detection Now
          <ArrowDown className="w-5 h-5" />
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-20 text-white">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition">
            <p className="text-3xl md:text-4xl font-bold text-emerald-300">95%</p>
            <p className="text-sm md:text-base text-white/80">Accuracy Rate</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition">
            <p className="text-3xl md:text-4xl font-bold text-emerald-300">&lt;1s</p>
            <p className="text-sm md:text-base text-white/80">Detection Time</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition">
            <p className="text-3xl md:text-4xl font-bold text-emerald-300">50K+</p>
            <p className="text-sm md:text-base text-white/80">Farmers Helped</p>
          </div>
        </div>
      </div>
    </section>
  )
}
