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
  const severityColor = confidence > 0.8 ? 'text-red-600' : confidence > 0.6 ? 'text-orange-600' : 'text-amber-600'

  return (
    <div className="bg-white border border-emerald-100 rounded-xl p-8 space-y-6 animate-fadeInUp shadow-lg">
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-lg border border-orange-200">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 text-slate-900">Disease Detected</h3>
          <p className={`text-lg font-bold ${severityColor}`}>{disease}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-700">Confidence Level</span>
            <span className="text-sm font-bold text-emerald-600">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden border border-slate-300">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-700">
          <div className="bg-slate-100 p-2 rounded-lg">
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <span>Severity: <span className={`font-bold ${severityColor}`}>{severityLevel}</span></span>
        </div>
      </div>

      {expertAdvice && (
        <div className="mt-6 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold">
            <div className="bg-emerald-200 p-1.5 rounded-lg">
              <Info className="w-4 h-4" />
            </div>
            <span>AI Expert Advice (RAG)</span>
          </div>
          <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto pr-2 font-medium">
            {formatMarkdown(expertAdvice)}
          </div>
        </div>
      )}

      <button
        onClick={onReadMore}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition font-semibold duration-300"
      >
        Read More About This Disease
      </button>
    </div>
  )
}
