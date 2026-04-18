import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ⚠️ REPLACE with CA Nikesh Shah's real email address
const MENTOR_EMAIL = 'nikesh@nsacademy.in'

// ⚠️ REPLACE with your verified Resend sender domain
const FROM_EMAIL = 'NS Academy <leads@nsacademy.in>'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: MENTOR_EMAIL,
      replyTo: email,
      subject: `💬 Contact Form: ${subject} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
          <div style="background: linear-gradient(135deg, #166534, #15803d); padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Message</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 14px;">NS Academy Contact Form</p>
          </div>
          <div style="padding: 20px 24px; background: white; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; width: 100px;">Name</td>
                <td style="padding: 10px 0; font-weight: 600;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Email</td>
                <td style="padding: 10px 0; font-weight: 600;"><a href="mailto:${email}" style="color: #166534;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Phone</td>
                <td style="padding: 10px 0; font-weight: 600;">${phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Subject</td>
                <td style="padding: 10px 0; font-weight: 600;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; vertical-align: top;">Message</td>
                <td style="padding: 10px 0;">${message}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 12px 24px; background: #f9fafb; border-radius: 0 0 8px 8px; font-size: 12px; color: #9ca3af;">
            Reply directly to this email to respond to ${name}.
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
