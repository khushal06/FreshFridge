"use client"

import { useState, useRef, useCallback } from 'react'
import { Camera, X, Check, AlertCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface FoodRecognitionResult {
  name: string
  category: string
  emoji: string
  confidence: number
  estimatedExpiryDays: number
  suggestedQuantity?: number
  suggestedUnit?: string
}

interface CameraScannerProps {
  onItemsRecognized: (items: FoodRecognitionResult[]) => void
  onClose: () => void
}

export default function CameraScanner({ onItemsRecognized, onClose }: CameraScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [recognizedItems, setRecognizedItems] = useState<FoodRecognitionResult[]>([])
  const [editableItems, setEditableItems] = useState<FoodRecognitionResult[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setIsScanning(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
      setIsScanning(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }, [])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    stopCamera()
  }, [stopCamera])

  const processImage = useCallback(async () => {
    if (!capturedImage) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()

      // Create FormData for API call
      const formData = new FormData()
      formData.append('image', blob, 'captured-image.jpg')

      // Call the API route for food recognition
      const apiResponse = await fetch('/api/food-recognition', {
        method: 'POST',
        body: formData,
      })

      if (!apiResponse.ok) {
        throw new Error('Failed to process image')
      }

      const result = await apiResponse.json()
      
      if (result.recognizedItems && result.recognizedItems.length > 0) {
        setRecognizedItems(result.recognizedItems)
        setEditableItems(result.recognizedItems)
        setShowConfirmation(true)
        setIsProcessing(false)
      } else {
        setError('No food items were recognized in the image. Please try again with better lighting.')
        setIsProcessing(false)
      }
    } catch (err) {
      console.error('Error processing image:', err)
      setError('Failed to recognize food items. Please try again.')
      setIsProcessing(false)
    }
  }, [capturedImage, onItemsRecognized])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setRecognizedItems([])
    setEditableItems([])
    setShowConfirmation(false)
    setError(null)
    startCamera()
  }, [startCamera])

  const updateEditableItem = useCallback((index: number, field: keyof FoodRecognitionResult, value: any) => {
    setEditableItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }, [])

  const removeEditableItem = useCallback((index: number) => {
    setEditableItems(prev => prev.filter((_, i) => i !== index))
  }, [])

  const confirmItems = useCallback(() => {
    if (editableItems.length > 0) {
      onItemsRecognized(editableItems)
      onClose()
    }
  }, [editableItems, onItemsRecognized, onClose])

  const cancelConfirmation = useCallback(() => {
    setShowConfirmation(false)
    setEditableItems([])
    setCapturedImage(null)
    setRecognizedItems([])
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Scan Food Item</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!capturedImage && !isScanning && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to scan a food item?</h3>
              <p className="text-gray-600 mb-8">
                Position your camera to capture a food item clearly. 
                Make sure there&apos;s good lighting and the item is clearly visible.
              </p>
              <button
                onClick={startCamera}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Start Camera
              </button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-white border-dashed rounded-xl m-4 pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg"></div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Position your camera to capture food items clearly
                </p>
                <button
                  onClick={captureImage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Capture Photo
                </button>
              </div>
            </div>
          )}

          {capturedImage && !isProcessing && recognizedItems.length === 0 && (
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video">
                <Image
                  src={capturedImage}
                  alt="Captured fridge contents"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Review your photo and process it to identify food items
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={retakePhoto}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Retake
                  </button>
                  <button
                    onClick={processImage}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Process Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing your fridge...</h3>
              <p className="text-gray-600">
                Our AI is identifying food items and estimating expiration dates
              </p>
            </div>
          )}

          {showConfirmation && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Recognized {recognizedItems.length} items!</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Items</h3>
                <p className="text-gray-600">
                  Review and edit the recognized items before adding to your inventory
                </p>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {editableItems.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{item.emoji}</div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateEditableItem(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                              value={item.category}
                              onChange={(e) => updateEditableItem(index, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Produce">Produce</option>
                              <option value="Dairy">Dairy</option>
                              <option value="Protein">Protein</option>
                              <option value="Drinks">Drinks</option>
                              <option value="Grains">Grains</option>
                              <option value="Condiments">Condiments</option>
                              <option value="Snacks">Snacks</option>
                              <option value="Frozen">Frozen</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={item.suggestedQuantity || 1}
                              onChange={(e) => updateEditableItem(index, 'suggestedQuantity', parseFloat(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <select
                              value={item.suggestedUnit || 'piece'}
                              onChange={(e) => updateEditableItem(index, 'suggestedUnit', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="piece">piece</option>
                              <option value="cup">cup</option>
                              <option value="lb">lb</option>
                              <option value="kg">kg</option>
                              <option value="carton">carton</option>
                              <option value="bottle">bottle</option>
                              <option value="bag">bag</option>
                              <option value="can">can</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expires (days)</label>
                            <input
                              type="number"
                              min="1"
                              value={item.estimatedExpiryDays}
                              onChange={(e) => updateEditableItem(index, 'estimatedExpiryDays', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeEditableItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 justify-center pt-6">
                <button
                  onClick={cancelConfirmation}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmItems}
                  disabled={editableItems.length === 0}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add to Inventory ({editableItems.length})
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
