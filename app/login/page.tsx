'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

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
      setError('אימייל או סיסמה שגויים')
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1a1a1a', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        background: '#2a2a2a', borderRadius: '12px', padding: '40px',
        width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            KeyClick
          </div>
          <div style={{ color: '#aaa', fontSize: '14px', marginTop: '6px' }}>כניסה לחשבון</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email" placeholder="אימייל" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={inputStyle}
          />
          <input
            type="password" placeholder="סיסמה" value={password}
            onChange={e => setPassword(e.target.value)} required
            style={inputStyle}
          />

          {error && <div style={{ color: '#ff6b6b', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '13px' }}>
          אין לך חשבון?{' '}
          <Link href="/register" style={{ color: '#cc00cc', textDecoration: 'none' }}>הירשם כאן</Link>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#333', border: '1px solid #444', borderRadius: '8px',
  padding: '12px 16px', color: '#fff', fontSize: '14px',
  outline: 'none', direction: 'rtl', width: '100%', boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  background: '#9b30c8', border: 'none', borderRadius: '8px',
  padding: '13px', color: '#fff', fontSize: '15px', fontWeight: 'bold',
  cursor: 'pointer', marginTop: '4px',
}
