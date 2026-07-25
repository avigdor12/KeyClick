'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { languages, handFont } from '../page'

export default function RegisterPage() {
  const router = useRouter()
  const [langIdx, setLangIdx] = useState(0)
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const lang = languages[langIdx]
  const c = lang.card
  const dir = lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: '' }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || c.registerErrorGeneric)
    } else {
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1a1a1a', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', gap: '20px',
    }}>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {languages.map((l, i) => (
          <button key={l.code} onClick={() => setLangIdx(i)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <Image src={`/flags/${l.code}${langIdx === i ? '1' : ''}.png`} alt={l.flag} width={28} height={28}
              style={{ borderRadius: '50%', border: langIdx === i ? '2px solid #fff' : '2px solid transparent', display: 'block' }} />
          </button>
        ))}
      </div>
      <div style={{
        background: '#2a2a2a', borderRadius: '12px', padding: '40px',
        width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', direction: dir,
      }}>

        {/* כותרת */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            KeyClick
          </div>
          <div style={{ color: '#bbb', fontSize: '13px', marginTop: '5px', fontWeight: 'bold' }}>{c.title}</div>
          <div style={{ color: '#999', fontSize: '13px', marginTop: '2px', fontWeight: 'bold' }}>M Finance</div>
        </div>

        {/* טופס */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text" placeholder={c.namePh} value={name}
            onChange={e => setName(e.target.value)} required
            style={{ ...inputStyle, direction: dir }}
          />
          <input
            type="email" placeholder={c.emailPh} value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{ ...inputStyle, direction: dir }}
          />
          {/* סיסמא — קריאה בלבד, אפור קל */}
          <input
            type="password" placeholder={c.passPh}
            readOnly
            style={{ ...inputStyle, direction: dir, background: '#2e2e2e', color: '#999', cursor: 'not-allowed', border: '1px solid #3a3a3a' }}
          />

          {error && <div style={{ color: '#ff6b6b', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

        </form>

        {/* שימוש חינם */}
        <div style={{ marginTop: '18px', textAlign: 'center', fontFamily: handFont(lang.code), color: '#ffffff', fontWeight: 'bold' }}>
          <div style={{ fontSize: '22px' }}>{c.line1}</div>
          <div style={{ fontSize: '32px' }}>{c.line2}</div>
        </div>

        {/* כפתורי הרשמה + כניסה — ימין, אותם צבעים */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button type="submit" form="" disabled={loading} onClick={handleSubmit as any} style={btnStyle}>
            {loading ? '...' : c.register}
          </button>
          <Link href="/login" style={{ ...btnStyle, textDecoration: 'none', display: 'inline-block' }}>
            {c.login}
          </Link>
        </div>

      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#333', border: '1px solid #444', borderRadius: '8px',
  padding: '12px 16px', color: '#fff', fontSize: '14px', fontWeight: 'bold',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  background: '#003399', borderRadius: '6px', padding: '8px 20px',
  color: '#FFD700', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
  border: 'none',
}
