'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      setError(data.error || 'שגיאה בהרשמה')
    } else {
      router.push('/login')
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

        {/* כותרת */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFD700', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            KeyClick
          </div>
          <div style={{ color: '#bbb', fontSize: '13px', marginTop: '5px', fontWeight: 'bold' }}>ניהול תקציב בית</div>
          <div style={{ color: '#999', fontSize: '13px', marginTop: '2px', fontWeight: 'bold' }}>M Finance</div>
        </div>

        {/* טופס */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text" placeholder="שם / שם משפחה" value={name}
            onChange={e => setName(e.target.value)} required
            style={inputStyle}
          />
          <input
            type="email" placeholder="Email / כתובת מייל" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={inputStyle}
          />
          {/* סיסמא — קריאה בלבד, אפור קל */}
          <input
            type="password" placeholder="סיסמא"
            readOnly
            style={{ ...inputStyle, background: '#2e2e2e', color: '#999', cursor: 'not-allowed', border: '1px solid #3a3a3a' }}
          />

          {error && <div style={{ color: '#ff6b6b', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

        </form>

        {/* שימוש חינם */}
        <div style={{ marginTop: '18px', textAlign: 'center', fontFamily: '"Guttman Yad Brush", "Guttman Yad", "Levenim MT", serif', color: '#ffffff', fontWeight: 'bold' }}>
          <div style={{ fontSize: '22px' }}>בתקופת ההרצה</div>
          <div style={{ fontSize: '32px' }}>חינם</div>
        </div>

        {/* כפתורי הרשמה + כניסה — ימין, אותם צבעים */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
          <button type="submit" form="" disabled={loading} onClick={handleSubmit as any} style={btnStyle}>
            {loading ? '...' : 'הרשמה'}
          </button>
          <Link href="/login" style={{ ...btnStyle, textDecoration: 'none', display: 'inline-block' }}>
            כניסה
          </Link>
        </div>

      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#333', border: '1px solid #444', borderRadius: '8px',
  padding: '12px 16px', color: '#fff', fontSize: '14px', fontWeight: 'bold',
  outline: 'none', direction: 'rtl', width: '100%', boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  background: '#003399', borderRadius: '6px', padding: '8px 20px',
  color: '#FFD700', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
  border: 'none',
}
