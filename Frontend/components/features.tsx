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
    <section id="features" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for professional rice leaf disease management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Image showcase */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">Professional Disease Analysis</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>High-resolution image analysis with AI technology</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Detailed disease information and symptoms</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Evidence-based treatment recommendations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>24/7 AI assistant for your questions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Field-ready mobile application</span>
              </li>
            </ul>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
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
