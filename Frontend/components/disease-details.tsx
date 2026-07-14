'use client'

import { useEffect, useState } from 'react'
import { X, AlertTriangle, Zap, Droplets, Thermometer } from 'lucide-react'
import { ChatBot } from './chatbot'
import { formatInline } from '@/lib/utils'

interface DiseaseDetailsProps {
  disease: string
  onClose: () => void
}

interface DiseaseInfo {
  symptoms: string[]
  causes: string[]
  treatment: string[]
  prevention: string[]
  description: string
}

const diseaseDatabase: Record<string, DiseaseInfo> = {
  'Bacterial Leaf Blight': {
    description: 'Bacterial leaf blight is a serious disease of rice caused by **Xanthomonas oryzae pv. oryzae**.',
    symptoms: [
      'Water-soaked lesions with **yellow halos** on leaf margins',
      'Lesions spread along leaf veins',
      'Leaves turn yellow and dry up',
      'Can affect all plant parts'
    ],
    causes: [
      'Bacterium: **Xanthomonas oryzae pv. oryzae**',
      'Spread by contaminated water and tools',
      'Insect vectors',
      'Infected seeds and plant debris'
    ],
    treatment: [
      'Remove infected plants immediately',
      'Apply **copper-based bactericides**',
      'Use antibiotic sprays (streptomycin sulfate)',
      'Drain and dry fields periodically',
      'Improve field **sanitation**'
    ],
    prevention: [
      'Use **disease-resistant varieties**',
      'Practice crop rotation',
      'Use clean seeds from certified sources',
      'Manage water properly',
      'Remove weeds that harbor bacteria',
      'Clean and disinfect tools'
    ]
  },
  'Brown Spot': {
    description: 'Brown spot is a fungal disease of rice caused by **Cochliobolus miyabeanus**.',
    symptoms: [
      'Brown spots with **concentric rings** appear on leaves',
      'Spots may have a yellow halo',
      'Spots coalesce and damage large leaf areas',
      'Seeds and grain may be affected'
    ],
    causes: [
      'Fungus: **Cochliobolus miyabeanus**',
      'High humidity and warm temperatures',
      'Poor soil nutrition (**low potassium**)',
      'Infected seeds'
    ],
    treatment: [
      'Apply fungicides (**mancozeb, carbendazim**)',
      'Increase potassium fertilization',
      'Improve drainage to reduce humidity',
      'Remove infected plant material',
      'Apply sulfur-based fungicides'
    ],
    prevention: [
      'Select resistant rice varieties',
      'Treat seeds with fungicides',
      'Maintain proper **nitrogen:potassium ratio**',
      'Ensure good field drainage',
      'Practice crop rotation',
      'Remove infected debris'
    ]
  },
  'Leaf Blast': {
    description: 'Leaf blast is a fungal disease caused by **Magnaporthe oryzae** that can cause significant yield losses.',
    symptoms: [
      '**Diamond-shaped lesions** with brown edges and gray center',
      'Lesions appear on leaves and stems',
      'Sporulation gives lesions a gray appearance',
      'Can progress rapidly in favorable conditions'
    ],
    causes: [
      'Fungus: **Magnaporthe oryzae**',
      'Cool, wet weather (20-25°C)',
      'High humidity',
      'Heavy nitrogen fertilization',
      'Infected seeds'
    ],
    treatment: [
      'Apply appropriate fungicides early',
      'Use azole fungicides (**tebuconazole, propiconazole**)',
      'Reduce nitrogen application',
      'Improve air circulation',
      'Apply sulfur dust'
    ],
    prevention: [
      'Use resistant varieties',
      'Balance nitrogen fertilization',
      'Ensure proper plant spacing',
      'Manage water to avoid excess moisture',
      'Treat seeds with fungicides',
      'Monitor fields regularly'
    ]
  }
}

export function DiseaseDetails({ disease, onClose }: DiseaseDetailsProps) {
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const info = diseaseDatabase[disease] || diseaseDatabase['Bacterial Leaf Blight']
      setDiseaseInfo(info)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [disease])

  if (!diseaseInfo && loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg p-8 max-w-2xl w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-card rounded-lg max-w-4xl w-full shadow-xl my-8">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-t-lg flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">{disease}</h2>
            <div className="text-primary-foreground/90">{formatInline(diseaseInfo?.description || '')}</div>
          </div>
          <button
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10 p-2 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Symptoms */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              Symptoms
            </h3>
            <ul className="space-y-2 grid md:grid-cols-2 gap-3">
              {diseaseInfo?.symptoms.map((symptom, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent font-bold shrink-0">•</span>
                  <span className="text-muted-foreground">{formatInline(symptom)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Causes */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-accent" />
              Causes
            </h3>
            <ul className="space-y-2 grid md:grid-cols-2 gap-3">
              {diseaseInfo?.causes.map((cause, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent font-bold shrink-0">•</span>
                  <span className="text-muted-foreground">{formatInline(cause)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatment */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Treatment Methods
            </h3>
            <ul className="space-y-2 grid md:grid-cols-2 gap-3">
              {diseaseInfo?.treatment.map((method, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent font-bold shrink-0">•</span>
                  <span className="text-muted-foreground">{formatInline(method)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prevention */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-accent" />
              Prevention Strategies
            </h3>
            <ul className="space-y-2 grid md:grid-cols-2 gap-3">
              {diseaseInfo?.prevention.map((strategy, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent font-bold shrink-0">•</span>
                  <span className="text-muted-foreground">{formatInline(strategy)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Section */}
          {showChat && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Ask Questions About This Disease</h3>
              <ChatBot disease={disease} />
            </div>
          )}

          {!showChat && (
            <button
              onClick={() => setShowChat(true)}
              className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium"
            >
              Ask AI Assistant Questions
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
