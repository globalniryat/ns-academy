import { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import { Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | NS Academy — CA Nikesh Shah',
  description: 'Get in touch with NS Academy. Contact CA Nikesh Shah for course queries, enrollment help, or any questions about CA Final SFM.',
}

// ⚠️ REPLACE with CA Nikesh Shah's real WhatsApp number
// Format: country code + number, no + or spaces (e.g. 919876543210)
const WHATSAPP_NUMBER = "91XXXXXXXXXX"
const WHATSAPP_MESSAGE = "Hi CA Nikesh Shah, I have a question about the CA Final SFM course."
const EMAIL = "contact@nsacademy.in"

export default function ContactPage() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-br from-green-800 via-green-900 to-green-950 py-20 px-4 text-center">
        <p className="text-green-300 text-sm font-semibold uppercase tracking-wider mb-3">Get In Touch</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact NS Academy</h1>
        <p className="text-green-200 text-xl max-w-xl mx-auto">
          Have questions about the course? Want to enroll? We respond within a few hours.
        </p>
      </section>

      {/* Content */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left — Info */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Ways to Reach Us</h2>

            {/* WhatsApp — primary */}
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-2xl p-6 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 group">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg">WhatsApp — Fastest Response</p>
                <p className="text-white/80 text-sm mt-0.5">Click to open a pre-filled WhatsApp message. We reply within hours.</p>
              </div>
            </a>

            {/* Email */}
            <a href={`mailto:${EMAIL}`}
              className="flex items-center gap-5 bg-white hover:shadow-md border border-slate-200 rounded-2xl p-6 transition-all hover:-translate-y-0.5">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">Email Us</p>
                <p className="text-slate-500 text-sm mt-0.5">{EMAIL}</p>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-5 bg-white border border-slate-200 rounded-2xl p-6">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">Based In</p>
                <p className="text-slate-500 text-sm mt-0.5">Pune, Maharashtra, India</p>
              </div>
            </div>

            {/* Response time */}
            <div className="flex items-center gap-5 bg-white border border-slate-200 rounded-2xl p-6">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">Response Time</p>
                <p className="text-slate-500 text-sm mt-0.5">WhatsApp: within 2–4 hours. Email form: same day.</p>
              </div>
            </div>

            {/* FAQ strip */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-6 space-y-4">
              <p className="font-bold text-slate-800">Quick Answers</p>
              {[
                { q: "Is there a free demo?", a: "Yes — free lectures are available on every course page and our YouTube channel." },
                { q: "How do I pay?", a: "UPI, bank transfer, and all major cards via Razorpay. Instant access after payment." },
                { q: "What if I want a refund?", a: "100% money-back, no questions asked, within 30 days of purchase." },
              ].map((faq) => (
                <div key={faq.q} className="border-t border-green-100 pt-4 first:border-0 first:pt-0">
                  <p className="font-semibold text-slate-700 text-sm">{faq.q}</p>
                  <p className="text-slate-500 text-sm mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
