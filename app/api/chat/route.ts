import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { messages, systemPrompt } = await request.json()

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://ai-girlfriend-app-rho.vercel.app',
      'X-Title': 'DreamCompanion'
    },
    body: JSON.stringify({
      model: 'neversleep/noromaid-20b',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 500,
    })
  })

  const data = await response.json()
  const reply = data.choices[0].message.content

  return NextResponse.json({ reply })
}