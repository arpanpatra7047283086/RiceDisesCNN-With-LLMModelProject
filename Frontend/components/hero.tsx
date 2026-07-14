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
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-white text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Detect Rice Leaf Diseases with AI
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Powered by advanced artificial intelligence to help you protect your rice crops and maximize yields.
        </p>
        <button
          onClick={onScrollToDetector}
          className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition inline-flex items-center gap-2"
        >
          Start Detection Now
          <ArrowDown className="w-5 h-5" />
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 text-white/80">
          <div>
            <p className="text-3xl md:text-4xl font-bold">95%</p>
            <p className="text-sm md:text-base">Accuracy Rate</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold">&lt;1s</p>
            <p className="text-sm md:text-base">Detection Time</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold">50K+</p>
            <p className="text-sm md:text-base">Farmers Helped</p>
          </div>
        </div>
      </div>
    </section>
  )
}
