'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { languages } from '../page'

export default function LoginPage() {
  const router = useRouter()
  const [langIdx, setLangIdx]   = useState(0)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const lang = languages[langIdx]
  const c = lang.card

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError(c.invalidCredentials)
    } else {
      router.push('/')
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
        width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', direction: lang.code === 'he' || lang.code === 'ar' ? 'rtl' : 'ltr',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            KeyClick
          </div>
          <div style={{ color: '#aaa', fontSize: '14px', marginTop: '6px' }}>{c.loginSubtitle}</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email" placeholder={c.emailPhSimple} value={email}
            onChange={e => setEmail(e.target.value)} required
            style={inputStyle(lang.code)}
          />
          <input
            type="password" placeholder={c.passPhSimple} value={password}
            onChange={e => setPassword(e.target.value)} required
            style={inputStyle(lang.code)}
          />

          {error && <div style={{ color: '#ff6b6b', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? c.connectingEllipsis : c.login}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '13px' }}>
          {c.noAccountQuestion}{' '}
          <Link href="/register" style={{ color: '#cc00cc', textDecoration: 'none' }}>{c.registerHereLink}</Link>
        </div>
      </div>
    </div>
  )
}

const inputStyle = (langCode: string): React.CSSProperties => ({
  background: '#333', border: '1px solid #444', borderRadius: '8px',
  padding: '12px 16px', color: '#fff', fontSize: '14px',
  outline: 'none', direction: langCode === 'he' || langCode === 'ar' ? 'rtl' : 'ltr', width: '100%', boxSizing: 'border-box',
})

const btnStyle: React.CSSProperties = {
  background: '#9b30c8', border: 'none', borderRadius: '8px',
  padding: '13px', color: '#fff', fontSize: '15px', fontWeight: 'bold',
  cursor: 'pointer', marginTop: '4px',
}
