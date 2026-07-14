import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

    // Create new FormData for the backend call
    const backendFormData = new FormData()
    backendFormData.append('image', image)

    // Note: Django typically expects a trailing slash (detect/)
    const response = await fetch(`${backendUrl}/api/detect/`, {
      method: 'POST',
      body: backendFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend Error:', errorText)
      return NextResponse.json(
        { error: `Backend responded with ${response.status}: ${errorText}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to backend server' },
      { status: 500 }
    )
  }
}
