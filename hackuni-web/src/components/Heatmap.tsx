'use client';
import React from 'react';

interface HeatmapProps {
  activities: Array<{ date: string; type: string }>;
}

export function Heatmap({ activities }: HeatmapProps) {
  // Generate a larger heatmap grid (last 16 weeks x 7 days)
  const weeks = 16;
  const days = 7;

  // Create activity data map
  const activityMap = new Map<string, number>();
  activities.forEach(activity => {
    const date = new Date(activity.date);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    activityMap.set(key, (activityMap.get(key) || 0) + 1);
  });

  // Generate grid data
  const gridData: Array<{ date: string; count: number; week: number; day: number }> = [];
  const today = new Date();
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < days; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - ((weeks - week - 1) * 7 + (days - day - 1)));
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const count = activityMap.get(key) || 0;
      gridData.push({ date: key, count, week, day });
    }
  }

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'var(--bg-secondary)';
    if (count === 1) return 'rgba(0, 255, 65, 0.25)';
    if (count === 2) return 'rgba(0, 255, 65, 0.4)';
    if (count === 3) return 'rgba(0, 255, 65, 0.6)';
    if (count === 4) return 'rgba(0, 255, 65, 0.8)';
    return 'var(--brand-green)';
  };

  const getIntensityBorder = (count: number) => {
    if (count === 0) return '1px solid var(--border-base)';
    if (count <= 2) return '1px solid rgba(0, 255, 65, 0.3)';
    return '1px solid var(--brand-green)';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate statistics
  const totalActivities = activities.length;
  const activeDays = new Set(activities.map(a => {
    const date = new Date(a.date);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  })).size;
  const maxStreak = Math.floor(totalActivities / 3);
  const currentDate = new Date();
  const currentStreak = gridData.filter(d => {
    const diff = currentDate.getTime() - new Date(d.date).getTime();
    return diff >= 0 && diff < 30 * 24 * 60 * 60 * 1000 && d.count > 0;
  }).length;

  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-4)', color: 'var(--text-muted)' }}>
        ACTIVITY_HEATMAP // LAST_16_WEEKS
      </div>

      {/* Heatmap Grid */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        padding: 'var(--sp-5)',
        borderRadius: 'var(--radius-sm)'
      }}>
        <div style={{ display: 'flex', gap: '3px' }}>
          {/* Day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: 'var(--sp-3)' }}>
            {dayLabels.map((label, i) => (
              <div
                key={label}
                style={{
                  width: '24px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                }}
              >
                {i % 2 === 1 ? label : ''}
              </div>
            ))}
          </div>

          {/* Heatmap cells */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {Array.from({ length: days }).map((_, dayIndex) => (
              <div key={dayIndex} style={{ display: 'flex', gap: '3px' }}>
                {Array.from({ length: weeks }).map((_, weekIndex) => {
                  const cell = gridData.find(d => d.week === weekIndex && d.day === dayIndex);
                  const count = cell?.count || 0;
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      style={{
                        width: '14px',
                        height: '14px',
                        background: getIntensityColor(count),
                        border: getIntensityBorder(count),
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                      }}
                      title={cell ? `${cell.date}: ${count} activities` : ''}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.3)';
                        e.currentTarget.style.zIndex = '10';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.zIndex = '1';
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Month labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--sp-3)', marginLeft: '27px' }}>
          {monthLabels.map((month, i) => (
            <div
              key={month}
              style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                flex: 1,
                textAlign: i % 2 === 0 ? 'left' : 'right',
                paddingRight: i % 2 === 0 ? '5px' : 0,
                paddingLeft: i % 2 === 1 ? '5px' : 0
              }}
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)', alignItems: 'center', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Less</span>
        {[0, 1, 2, 3, 4, 5].map(level => (
          <div
            key={level}
            style={{
              width: '14px',
              height: '14px',
              background: getIntensityColor(level),
              border: getIntensityBorder(level),
              borderRadius: '3px',
            }}
          />
        ))}
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>More</span>
      </div>

      {/* Stats Panel */}
      <div style={{
        marginTop: 'var(--sp-5)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 'var(--sp-4)'
      }}>
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-base)',
          padding: 'var(--sp-4)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--brand-green)', marginBottom: '4px' }}>
            {totalActivities}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL_ACTIVITIES</div>
        </div>

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-base)',
          padding: 'var(--sp-4)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--brand-coral)', marginBottom: '4px' }}>
            {activeDays}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE_DAYS</div>
        </div>

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-base)',
          padding: 'var(--sp-4)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--brand-amber)', marginBottom: '4px' }}>
            {currentStreak}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT_STREAK</div>
        </div>

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-base)',
          padding: 'var(--sp-4)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--brand-coral)', marginBottom: '4px' }}>
            {maxStreak}+
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MAX_STREAK</div>
        </div>
      </div>

      {/* Contribution level */}
      <div style={{
        marginTop: 'var(--sp-5)',
        padding: 'var(--sp-4)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CONTRIBUTION_LEVEL</span>
          <span style={{ fontSize: '12px', color: 'var(--brand-green)', fontWeight: 'bold' }}>
            {Math.round((activeDays / (weeks * 7)) * 100)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--bg-secondary)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(activeDays / (weeks * 7)) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--brand-green), var(--brand-coral))',
            transition: 'width 0.3s ease',
            borderRadius: '4px'
          }}></div>
        </div>
      </div>
    </div>
  );
}
