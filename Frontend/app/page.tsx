'use client'

import { useRef, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { ImageUploader } from '@/components/image-uploader'
import { DiseaseResult } from '@/components/disease-result'
import { DiseaseDetails } from '@/components/disease-details'
import { Features } from '@/components/features'
import { Loader } from 'lucide-react'

interface DetectionResult {
  disease: string
  confidence: number
  expertAdvice?: string
}

export default function Page() {
  const detectorRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [selectedDiseaseForDetails, setSelectedDiseaseForDetails] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (file: File, previewUrl: string) => {
    setSelectedFile(file)
    setPreview(previewUrl)
    setError(null)
    setResult(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch('/api/detect/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setResult({
        disease: data.disease,
        confidence: data.confidence,
        expertAdvice: data.expert_advice, // Now receiving RAG data
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleScrollToDetector = () => {
    detectorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero onScrollToDetector={handleScrollToDetector} />

      <section ref={detectorRef} id="detector" className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3">Rice Leaf Disease Detection</h2>
            <p className="text-muted-foreground text-lg">
              Upload or capture an image of your rice leaf to get instant diagnosis powered by AI
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border mb-6">
            <ImageUploader onImageSelect={handleImageSelect} isLoading={loading} />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {preview && !result && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg hover:opacity-90 transition font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
            >
              {loading ? (
                <><Loader className="w-5 h-5 animate-spin" /> Analyzing Image...</>
              ) : (
                'Analyze Leaf Image'
              )}
            </button>
          )}

          {result && (
            <div className="space-y-4">
              <DiseaseResult
                disease={result.disease}
                confidence={result.confidence}
                expertAdvice={result.expertAdvice}
                onReadMore={() => setSelectedDiseaseForDetails(result.disease)}
              />
              
              <button
                onClick={() => {
                  setResult(null)
                  setPreview(null)
                  setSelectedFile(null)
                }}
                className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium"
              >
                Analyze Another Leaf
              </button>
            </div>
          )}
        </div>
      </section>

      <Features />
      <Footer />

      {selectedDiseaseForDetails && (
        <DiseaseDetails
          disease={selectedDiseaseForDetails}
          onClose={() => setSelectedDiseaseForDetails(null)}
        />
      )}
    </main>
  )
}
