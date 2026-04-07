'use client';
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      padding: 'var(--sp-6)'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-hero)',
        fontSize: '120px',
        color: 'var(--brand-coral)',
        margin: 0,
        lineHeight: 1,
        textShadow: '0 0 20px rgba(245, 107, 82, 0.4)'
      }}>
        404
      </h1>
      <h2 style={{ fontSize: '24px', margin: 'var(--sp-2) 0 var(--sp-6) 0' }}>// DATA_CORRUPTED</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--sp-6)', textAlign: 'center', maxWidth: '400px' }}>
        The memory sector you are trying to access has been wiped or never existed. Return to base layer immediately.
      </p>

      <Link href="/" style={{
        padding: '12px 24px',
        border: '1px solid var(--brand-green)',
        color: 'var(--brand-green)',
        background: 'rgba(0, 255, 65, 0.1)',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }} onMouseOver={(e) => {
        e.currentTarget.style.background = 'var(--brand-green)';
        e.currentTarget.style.color = '#000';
      }} onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(0, 255, 65, 0.1)';
        e.currentTarget.style.color = 'var(--brand-green)';
      }}>
        [ REBOOT_CONNECTION ]
      </Link>
    </main>
  );
}
