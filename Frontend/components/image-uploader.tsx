'use client'

import { useRef, useState } from 'react'
import { Upload, Camera, X } from 'lucide-react'

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void
  isLoading?: boolean
}

export function ImageUploader({ onImageSelect, isLoading = false }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [useCamera, setUseCamera] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        onImageSelect(file, result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
            const preview = canvasRef.current!.toDataURL('image/jpeg')
            setPreview(preview)
            onImageSelect(file, preview)
            stopCamera()
          }
        }, 'image/jpeg')
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setCameraActive(false)
      setUseCamera(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (cameraActive && useCamera) {
    return (
      <div className="space-y-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg max-h-96 bg-black"
        />
        <div className="flex gap-2">
          <button
            onClick={capturePhoto}
            className="flex-1 bg-accent text-accent-foreground py-3 rounded-lg hover:opacity-90 transition font-medium"
          >
            Capture Photo
          </button>
          <button
            onClick={stopCamera}
            className="flex-1 bg-muted text-muted-foreground py-3 rounded-lg hover:opacity-90 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full rounded-lg max-h-96 object-cover" />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full hover:opacity-90 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground text-center">Image ready for analysis</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-primary rounded-lg p-8 text-center hover:bg-secondary/20 transition cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />
        <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="font-semibold text-lg mb-1">Upload Rice Leaf Image</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Drag and drop your image here or click to browse
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
        >
          Choose File
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setUseCamera(true)
            startCamera()
          }}
          disabled={isLoading}
          className="flex-1 bg-accent text-accent-foreground py-3 rounded-lg hover:opacity-90 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
          Use Camera
        </button>
      </div>
    </div>
  )
}

// Hidden canvas for camera capture
export function CaptureCanvas() {
  return <canvas ref={() => {}} className="hidden" />
}
