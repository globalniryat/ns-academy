import { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import { Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { client } from '@/lib/sanity/client'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact | NS Academy — CA Nikesh Shah',
  description: 'Get in touch with CA Nikesh Shah. Questions about the free CA Final SFM lecture series on YouTube? We respond within a few hours.',
}

const DEFAULTS = {
  whatsappNumber:  '919999999999',
  whatsappMessage: 'Hi CA Nikesh Shah, I watched your YouTube series and had a question.',
  email:           'contact@nsacademy.in',
  location:        'Pune, Maharashtra',
  youtubeUrl:      'https://www.youtube.com/@CANikeshShah',
}

export default async function ContactPage() {
  let contact = DEFAULTS

  try {
    const data = await client.fetch<{
      contact?: { whatsappNumber?: string; whatsappMessage?: string; email?: string; location?: string }
      footer?:  { youtubeUrl?: string }
    }>(`*[_type == "siteContent"][0]{ contact, footer }`)

    if (data) {
      contact = {
        whatsappNumber:  data.contact?.whatsappNumber  ?? DEFAULTS.whatsappNumber,
        whatsappMessage: data.contact?.whatsappMessage ?? DEFAULTS.whatsappMessage,
        email:           data.contact?.email           ?? DEFAULTS.email,
        location:        data.contact?.location        ?? DEFAULTS.location,
        youtubeUrl:      data.footer?.youtubeUrl       ?? DEFAULTS.youtubeUrl,
      }
    }
  } catch {
    // Sanity unavailable — use defaults above
  }

  const waUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue/90 py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <p className="text-teal font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">Contact NS Academy</h1>
          <p className="text-white/70 text-lg max-w-lg mx-auto">
            Questions about the free SFM series? Want to share feedback? CA Nikesh Shah reads every message personally.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20 px-4 bg-offwhite">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left — Contact info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy mb-6">Ways to Reach Us</h2>

            {/* WhatsApp */}
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-2xl p-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg">WhatsApp — Fastest Response</p>
                <p className="text-white/80 text-sm mt-0.5">Pre-filled message ready. We reply within 2–4 hours.</p>
              </div>
            </a>

            {/* Email */}
            <a href={`mailto:${contact.email}`}
              className="flex items-center gap-5 bg-white hover:shadow-md border border-gray-100 rounded-2xl p-6 transition-all hover:-translate-y-0.5">
              <div className="w-14 h-14 bg-blue/8 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-7 h-7 text-blue" />
              </div>
              <div>
                <p className="font-bold text-navy text-lg">Email Us</p>
                <p className="text-muted text-sm mt-0.5">{contact.email}</p>
              </div>
            </a>

            {/* YouTube comments */}
            <a href={contact.youtubeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 bg-white hover:shadow-md border border-gray-100 rounded-2xl p-6 transition-all hover:-translate-y-0.5 group">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-navy text-lg">Comment on YouTube</p>
                <p className="text-muted text-sm mt-0.5">Drop a comment on any lecture — sir replies personally.</p>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-5 bg-white border border-gray-100 rounded-2xl p-6">
              <div className="w-14 h-14 bg-teal/8 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-teal" />
              </div>
              <div>
                <p className="font-bold text-navy text-lg">Based In</p>
                <p className="text-muted text-sm mt-0.5">{contact.location}</p>
              </div>
            </div>

            {/* Response time */}
            <div className="flex items-center gap-5 bg-white border border-gray-100 rounded-2xl p-6">
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-7 h-7 text-gold" />
              </div>
              <div>
                <p className="font-bold text-navy text-lg">Response Time</p>
                <p className="text-muted text-sm mt-0.5">WhatsApp: 2–4 hrs · Email form: same day</p>
              </div>
            </div>

            {/* YouTube feedback callout */}
            <div className="bg-navy rounded-2xl p-6 border border-white/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-red-400">
                    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Share Your Feedback on YouTube</p>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    Watched the free lectures and found them helpful? The best way to support the channel is to leave a comment or like on the video — it helps other CA students find the series.
                  </p>
                  <a
                    href={contact.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Go to YouTube Channel →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
