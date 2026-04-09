import React from 'react';
import Link from 'next/link';
import { HackerCard } from '@/components/ui/HackerCard';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_HACKATHONS } from '@/data/mock';

export default function HackathonsPage() {
  return (
    <main style={{ padding: 'var(--sp-8) var(--sp-6)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-6)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h1)', margin: 0, textTransform: 'uppercase' }}>
            &gt; Hackathon_Ops
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
            Find your next battleground.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          <Tag label="#All" className="status-verified" style={{ background: 'transparent' }} />
          <Tag label="#AI" />
          <Tag label="#Hardware" />
          <Tag label="#Web3" />
        </div>
      </div>
      
      <div className="divider-dashed" style={{ marginBottom: 'var(--sp-6)' }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        {MOCK_HACKATHONS.map(hack => (
          <HackerCard key={hack.id} className="responsive-flex-col desktop-row" style={{ gap: 'var(--sp-5)' }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-base)', 
              flexShrink: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--text-disabled)',
              fontFamily: 'var(--font-mono)'
            }}>
              [POSTER_IMAGE]
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Link href={`/hackathons/${hack.id}`}>
                  <h2 style={{ margin: '0 0 var(--sp-2) 0', fontFamily: 'var(--font-hero)', fontSize: 'var(--text-h2)', cursor: 'pointer' }}>
                    {hack.title}
                  </h2>
                </Link>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--brand-coral)' }}>{hack.level_score}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>Class: {hack.level_code}</div>
                </div>
              </div>
              
              <p style={{ color: 'var(--text-main)', fontSize: 'var(--text-body)', margin: '0 0 var(--sp-4) 0', maxWidth: '80%' }}>
                {hack.short_desc}
              </p>
              
              <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                {hack.tags_json.map(t => <Tag key={t} label={t} />)}
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>&gt; LOC: {hack.city}, {hack.country}</span><br/>
                  <span>&gt; TIME: {new Date(hack.start_time).toLocaleDateString()}</span>
                </div>
                <div>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '13px',
                    marginRight: 'var(--sp-4)',
                    color: hack.registration_status === '报名中' ? 'var(--brand-coral)' : 'var(--text-disabled)' 
                  }}>
                    [{hack.registration_status}]
                  </span>
                  <Link href={`/hackathons/${hack.id}`}>
                    <Button variant="ghost">&gt; ENTER</Button>
                  </Link>
                </div>
              </div>
            </div>
          </HackerCard>
        ))}
      </div>
    </main>
  );
}
