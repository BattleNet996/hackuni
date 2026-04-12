'use client';
import { useState } from 'react';

export default function DebugLogin() {
  const [result, setResult] = useState('');
  const [username, setUsername] = useState('wjj');
  const [password, setPassword] = useState('cwj123');

  const testLogin = async () => {
    setResult('Testing...');
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));

      // Check cookies
      const cookies = document.cookie;
      setResult(prev => prev + '\n\nCookies: ' + cookies);
    } catch (error: any) {
      setResult('Error: ' + error.message);
    }
  };

  const checkAuth = async () => {
    setResult('Checking auth...');
    try {
      const response = await fetch('/api/admin/auth/verify');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Admin Login Debug</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button onClick={testLogin} style={{ padding: '5px 15px' }}>
          Test Login
        </button>
        <button onClick={checkAuth} style={{ padding: '5px 15px', marginLeft: '10px' }}>
          Check Auth
        </button>
      </div>

      <pre style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }}>
        {result}
      </pre>
    </div>
  );
}
