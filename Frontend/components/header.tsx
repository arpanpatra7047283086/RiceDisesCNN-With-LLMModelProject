'use client'

import Image from 'next/image'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 text-white sticky top-0 z-50 shadow-xl border-b border-emerald-700/30">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition">
          <div className="relative w-10 h-10">
            <Image
              src="/leaf-logo.png"
              alt="RiceDetect Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">RiceDetect</h1>
            <p className="text-xs text-emerald-200/70">AI-Powered Disease Detection</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 items-center text-sm">
          <a href="#how-it-works" className="text-emerald-100 hover:text-emerald-300 transition duration-200 font-medium">
            How It Works
          </a>
          <a href="#features" className="text-emerald-100 hover:text-emerald-300 transition duration-200 font-medium">
            Features
          </a>
          <a href="#detector" className="text-emerald-100 hover:text-emerald-300 transition duration-200 font-medium">
            Detect Now
          </a>
        </nav>
      </div>
    </header>
  )
}
