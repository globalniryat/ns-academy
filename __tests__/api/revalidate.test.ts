import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Must mock next/cache before importing the route
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { POST } from '@/app/api/revalidate/route'
import { revalidatePath } from 'next/cache'

const SECRET = 'test-revalidate-secret' // matches vitest.setup.ts

function makeRequest(secret?: string) {
  const url = secret
    ? `http://localhost:3000/api/revalidate?secret=${secret}`
    : 'http://localhost:3000/api/revalidate'
  return new NextRequest(url, { method: 'POST' })
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when secret is missing', async () => {
    const res = await POST(makeRequest())
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.message).toBe('Invalid secret')
  })

  it('returns 401 when secret is wrong', async () => {
    const res = await POST(makeRequest('wrong-secret'))
    expect(res.status).toBe(401)
  })

  it('returns 200 and revalidates when secret is correct', async () => {
    const res = await POST(makeRequest(SECRET))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.revalidated).toBe(true)
    expect(body.now).toBeTypeOf('number')
  })

  it('calls revalidatePath for / and /contact on success', async () => {
    await POST(makeRequest(SECRET))
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(revalidatePath).toHaveBeenCalledWith('/contact')
    expect(revalidatePath).toHaveBeenCalledTimes(2)
  })

  it('does not call revalidatePath when secret is wrong', async () => {
    await POST(makeRequest('bad'))
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
