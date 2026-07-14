'use client'

import { AlertCircle, TrendingUp, Info } from 'lucide-react'
import { formatMarkdown } from '@/lib/utils'

interface DiseaseResultProps {
  disease: string
  confidence: number
  expertAdvice?: string
  onReadMore: () => void
}

export function DiseaseResult({ disease, confidence, expertAdvice, onReadMore }: DiseaseResultProps) {
  const severityLevel = confidence > 0.8 ? 'High' : confidence > 0.6 ? 'Medium' : 'Low'
  const severityColor = confidence > 0.8 ? 'text-destructive' : confidence > 0.6 ? 'text-accent' : 'text-secondary'

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4 animate-fadeInUp">
      <div className="flex items-start gap-4">
        <div className="bg-accent/10 p-3 rounded-lg">
          <AlertCircle className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">Disease Detected</h3>
          <p className={`text-lg font-semibold ${severityColor}`}>{disease}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Confidence Level</span>
            <span className="text-sm font-bold">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-500"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>Severity: <span className={`font-semibold ${severityColor}`}>{severityLevel}</span></span>
        </div>
      </div>

      {expertAdvice && (
        <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-primary font-bold">
            <Info className="w-4 h-4" />
            <span>AI Expert Advice (RAG)</span>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto pr-2">
            {formatMarkdown(expertAdvice)}
          </div>
        </div>
      )}

      <button
        onClick={onReadMore}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-medium"
      >
        Read More About This Disease
      </button>
    </div>
  )
}
