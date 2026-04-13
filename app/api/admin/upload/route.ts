import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

// Strict allowlists — never trust user-provided values for these
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
  'video/mp4', 'video/webm',
])

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4', 'video/webm': 'webm',
}

const ALLOWED_BUCKETS = new Set(['media', 'documents', 'thumbnails'])
const ALLOWED_FOLDERS = new Set(['uploads', 'thumbnails', 'notes', 'videos', 'course-notes'])

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucketRaw = (formData.get('bucket') as string) || 'media'
    const folderRaw = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Validate bucket and folder against allowlist (prevents path traversal)
    if (!ALLOWED_BUCKETS.has(bucketRaw)) {
      return NextResponse.json({ success: false, error: 'Invalid bucket' }, { status: 400 })
    }
    if (!ALLOWED_FOLDERS.has(folderRaw)) {
      return NextResponse.json({ success: false, error: 'Invalid folder' }, { status: 400 })
    }

    // Validate MIME type against allowlist (browser file.type can be spoofed but Supabase
    // enforces its own MIME check; this is a defence-in-depth guard at the API layer)
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ success: false, error: 'File type not allowed' }, { status: 400 })
    }

    // Enforce size limit before reading into memory
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ success: false, error: 'File too large (max 100 MB)' }, { status: 400 })
    }

    const bucket = bucketRaw
    const folder = folderRaw

    // Derive extension from validated MIME type — never from the user-supplied filename
    const ext = MIME_TO_EXT[file.type] ?? 'bin'
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
