'use client'

import { Zap, Shield, Brain, Smartphone, TrendingUp, Clock } from 'lucide-react'
import Image from 'next/image'

export function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms trained on thousands of rice leaf samples for accurate disease detection.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get disease diagnosis in seconds with confidence scores and severity assessment.'
    },
    {
      icon: Shield,
      title: 'Comprehensive Treatment',
      description: 'Detailed treatment recommendations and prevention strategies tailored to each disease.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-Friendly',
      description: 'Use your smartphone camera to capture and analyze rice leaves directly from your field.'
    },
    {
      icon: TrendingUp,
      title: 'Expert Guidance',
      description: 'AI chatbot assistant to answer your questions about diseases and management practices.'
    },
    {
      icon: Clock,
      title: 'Early Detection',
      description: 'Identify diseases at early stages before significant crop damage occurs.'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Powerful Features</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light">
            Everything you need for professional rice leaf disease management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="bg-white border border-emerald-100/50 rounded-xl p-8 hover:shadow-xl hover:border-emerald-300 transition duration-300 hover:translate-y-[-4px]">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 w-14 h-14 rounded-lg flex items-center justify-center mb-5 border border-emerald-200">
                  <Icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Image showcase */}
        <div className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-2xl p-8 md:p-12 border border-emerald-100">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Professional Disease Analysis</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold text-lg flex-shrink-0 mt-1">✓</span>
                <span className="text-slate-700">High-resolution image analysis with AI technology</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold text-lg flex-shrink-0 mt-1">✓</span>
                <span className="text-slate-700">Detailed disease information and symptoms</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold text-lg flex-shrink-0 mt-1">✓</span>
                <span className="text-slate-700">Evidence-based treatment recommendations</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold text-lg flex-shrink-0 mt-1">✓</span>
                <span className="text-slate-700">24/7 AI assistant for your questions</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold text-lg flex-shrink-0 mt-1">✓</span>
                <span className="text-slate-700">Field-ready mobile application</span>
              </li>
            </ul>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg border border-emerald-100">
            <Image
              src="/ai-technology.png"
              alt="AI Technology"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
