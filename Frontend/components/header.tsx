'use client'

import { Leaf } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500 rounded-lg p-2">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">RiceDetect</h1>
            <p className="text-xs text-gray-300">AI-Powered Disease Detection</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 items-center text-sm">
          <a href="#how-it-works" className="hover:text-teal-400 transition duration-200">
            How It Works
          </a>
          <a href="#features" className="hover:text-teal-400 transition duration-200">
            Features
          </a>
          <a href="#detector" className="hover:text-teal-400 transition duration-200">
            Detect Now
          </a>
        </nav>
      </div>
    </header>
  )
}
