import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ⚠️ REPLACE with CA Nikesh Shah's real email address
const MENTOR_EMAIL = 'nikesh@nsacademy.in'

// ⚠️ REPLACE with your verified Resend sender domain
// Until your domain is verified, use: onboarding@resend.dev (test only, sends to your Resend account email)
const FROM_EMAIL = 'NS Academy <leads@nsacademy.in>'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, caLevel, attempt, message } = body

    if (!name || !phone || !email || !caLevel || !attempt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Send lead notification to mentor
    await resend.emails.send({
      from: FROM_EMAIL,
      to: MENTOR_EMAIL,
      subject: `🎓 New Course Interest — ${name} (${caLevel})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
          <div style="background: linear-gradient(135deg, #166534, #15803d); padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Student Inquiry — NS Academy</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 14px;">Someone wants to connect about the CA Final SFM series</p>
          </div>

          <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px 20px; margin: 0;">
            <strong style="color: #166534; font-size: 16px;">Student Details</strong>
          </div>

          <div style="padding: 20px 24px; background: white; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; width: 140px;">Name</td>
                <td style="padding: 10px 0; font-weight: 600; color: #111827;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">WhatsApp / Phone</td>
                <td style="padding: 10px 0; font-weight: 600; color: #111827;">+91 ${phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Email</td>
                <td style="padding: 10px 0; font-weight: 600; color: #111827;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">CA Level</td>
                <td style="padding: 10px 0; font-weight: 600; color: #111827;">${caLevel}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Attempt</td>
                <td style="padding: 10px 0; font-weight: 600; color: #111827;">${attempt}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 10px 0; color: #6b7280; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #111827;">${message}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background: #fef9c3; border-left: 4px solid #ca8a04; padding: 14px 20px;">
            <strong style="color: #854d0e;">Quick Action:</strong>
            <p style="margin: 6px 0 0; font-size: 13px; color: #713f12;">
              WhatsApp this student: <a href="https://wa.me/91${phone}?text=Hi%20${encodeURIComponent(name)}%2C%20I%27m%20CA%20Nikesh%20Shah.%20Thank%20you%20for%20reaching%20out%20about%20the%20CA%20Final%20SFM%20series!"
              style="color: #166534; font-weight: 700;">Click to WhatsApp +91${phone}</a>
            </p>
          </div>

          <div style="padding: 16px 24px; background: #f9fafb; border-radius: 0 0 8px 8px; font-size: 12px; color: #9ca3af;">
            This lead was captured from the NS Academy website interest form.
          </div>
        </div>
      `,
    })

    // Send confirmation email to student
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `We received your interest — CA Final SFM by CA Nikesh Shah`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
          <div style="background: linear-gradient(135deg, #166534, #15803d); padding: 20px 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Thank You, ${name}!</h1>
            <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 14px;">Your interest has been registered.</p>
          </div>

          <div style="padding: 24px; background: white;">
            <p style="font-size: 15px; line-height: 1.6; color: #374151;">
              Hi ${name},
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #374151;">
              Thank you for reaching out about the <strong>CA Final Strategic Financial Management</strong> series by CA Nikesh Shah.
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #374151;">
              We have received your details and will reach out to you personally on <strong>+91 ${phone}</strong> within a few hours.
            </p>

            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <strong style="color: #166534; display: block; margin-bottom: 8px;">While you wait:</strong>
              <p style="margin: 0; font-size: 14px; color: #374151;">
                The full SFM lecture series is free on YouTube — watch any lecture now to experience the logic-first teaching approach.
              </p>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
              — CA Nikesh Shah<br>
              NS Academy
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Interest form error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
