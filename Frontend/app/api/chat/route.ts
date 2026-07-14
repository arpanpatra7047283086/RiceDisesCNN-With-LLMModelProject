import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question, disease } = await request.json()

    if (!question) {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 })
    }

    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

    const response = await fetch(`${backendUrl}/api/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, disease }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend Chat Error:', errorText)
      return NextResponse.json(
        { error: `Backend responded with ${response.status}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Chat API proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to backend server' },
      { status: 500 }
    )
  }
}
