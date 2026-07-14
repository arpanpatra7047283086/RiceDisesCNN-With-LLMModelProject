'use client'

import { Leaf } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-500 rounded-lg p-2">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">RiceDetect</h3>
            </div>
            <p className="text-sm text-gray-300">
              Advanced AI-powered rice leaf disease detection system for modern agriculture.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-teal-400">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-teal-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Detection</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">About</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-teal-400">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-teal-400 transition">Documentation</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Support</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 RiceDetect. All rights reserved. Advanced Agricultural Technology Solutions.</p>
        </div>
      </div>
    </footer>
  )
}
