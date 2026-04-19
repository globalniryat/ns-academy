import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { draftClient } from '@/lib/sanity/client'

export async function GET(req: NextRequest) {
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(draftClient, req.url)

  if (!isValid) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  ;(await draftMode()).enable()
  redirect(redirectTo)
}
