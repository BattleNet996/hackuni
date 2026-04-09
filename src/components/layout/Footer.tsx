import React from 'react';

export function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px dashed var(--border-base)',
      padding: 'var(--sp-6) var(--sp-6)',
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-caption)'
    }}>
      <div style={{ color: 'var(--text-muted)' }}>
        © 2026 HACKATHON UNIVERSITY . ALL RIGHTS RESERVED_
      </div>
      <div style={{ display: 'flex', gap: 'var(--sp-4)', color: 'var(--text-muted)' }}>
        <span style={{ cursor: 'pointer' }}>GITHUB</span>
        <span style={{ cursor: 'pointer' }}>X.COM</span>
        <span style={{ cursor: 'pointer' }}>ABOUT</span>
      </div>
    </footer>
  );
}
