import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'media'
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() ?? 'bin'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabaseAdmin = createAdminClient()
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('[POST /api/admin/upload] Supabase Storage error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path)

    return NextResponse.json({ success: true, data: { url: publicUrl, path: data.path } })
  } catch (error) {
    console.error('[POST /api/admin/upload]', error)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
