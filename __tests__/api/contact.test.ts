import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// vi.mock is hoisted above imports — use vi.hoisted so mockSend is available inside the factory
const mockSend = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null })
)

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend }
  },
}))

import { POST } from '@/app/api/contact/route'

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const VALID_BODY = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '9876543210',
  subject: 'Question about the SFM series',
  message: 'I wanted to ask about the options pricing module.',
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with valid payload', async () => {
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('calls Resend with valid payload', async () => {
    await POST(makeRequest(VALID_BODY))
    expect(mockSend).toHaveBeenCalledOnce()
  })

  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, name: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, email: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when phone is missing', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, phone: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when subject is missing', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, subject: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when message is missing', async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, message: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 500 when Resend throws', async () => {
    mockSend.mockRejectedValueOnce(new Error('Resend error'))
    const res = await POST(makeRequest(VALID_BODY))
    expect(res.status).toBe(500)
  })

  it('does not leak error details in 500 response', async () => {
    mockSend.mockRejectedValueOnce(new Error('Resend API key invalid'))
    const res = await POST(makeRequest(VALID_BODY))
    const body = await res.json()
    expect(JSON.stringify(body)).not.toContain('Resend API key invalid')
  })
})
