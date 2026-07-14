'use client'

import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 text-white py-16 mt-20 border-t border-emerald-700/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/leaf-logo.png"
                  alt="RiceDetect Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">RiceDetect</h3>
            </div>
            <p className="text-sm text-emerald-100/70">
              Advanced AI-powered rice leaf disease detection system empowering farmers with cutting-edge technology for modern agriculture.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-300">Quick Links</h4>
            <ul className="space-y-2 text-sm text-emerald-100/70">
              <li><a href="#" className="hover:text-emerald-300 transition font-medium">Home</a></li>
              <li><a href="#" className="hover:text-emerald-300 transition font-medium">Detection</a></li>
              <li><a href="#" className="hover:text-emerald-300 transition font-medium">About</a></li>
              <li><a href="#" className="hover:text-emerald-300 transition font-medium">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-emerald-300">Resources</h4>
            <ul className="space-y-2 text-sm text-emerald-100/70">
              <li><a href="#" className="hover:text-emerald-300 transition font-medium">Documentation</a></li>
              <li><a href="#" className="hover:text-emerald-300 transition font-medium">Blog</a></li>
              <li><a href="#" className="hover:text-emerald-300 transition font-medium">Support</a></li>
              <li><a href="#" className="hover:text-emerald-300 transition font-medium">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-700/30 pt-8 text-center text-sm text-emerald-200/50">
          <p>&copy; 2024 RiceDetect. All rights reserved. Advanced Agricultural Technology Solutions.</p>
        </div>
      </div>
    </footer>
  )
}
