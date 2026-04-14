'use client';
import React from 'react';

interface HeatmapProps {
  activities: Array<{ date: string; type: string }>;
}

const WEEKS = 16;
const DAYS_PER_WEEK = 7;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseActivityDate(value: string): Date | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return startOfDay(parsed);
}

function getIntensityColor(count: number) {
  if (count === 0) return 'var(--bg-secondary)';
  if (count === 1) return 'rgba(0, 255, 65, 0.25)';
  if (count === 2) return 'rgba(0, 255, 65, 0.4)';
  if (count === 3) return 'rgba(0, 255, 65, 0.6)';
  if (count === 4) return 'rgba(0, 255, 65, 0.8)';
  return 'var(--brand-green)';
}

function getIntensityBorder(count: number) {
  if (count === 0) return '1px solid var(--border-base)';
  if (count <= 2) return '1px solid rgba(0, 255, 65, 0.3)';
  return '1px solid var(--brand-green)';
}

export function Heatmap({ activities }: HeatmapProps) {
  const dateFormatter = React.useMemo(() => (
    new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  ), []);

  const {
    weekColumns,
    visibleCells,
    monthLabels,
    totalActivities,
    activeDays,
    currentStreak,
    maxStreak,
  } = React.useMemo(() => {
    const activityMap = new Map<string, number>();

    activities.forEach((activity) => {
      const date = parseActivityDate(activity.date);
      if (!date) return;

      const key = formatDateKey(date);
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    });

    const today = startOfDay(new Date());
    const currentWeekStart = startOfWeek(today);
    const firstWeekStart = addDays(currentWeekStart, -(WEEKS - 1) * DAYS_PER_WEEK);

    const columns = Array.from({ length: WEEKS }, (_, weekIndex) => {
      const weekStart = addDays(firstWeekStart, weekIndex * DAYS_PER_WEEK);
      const days = Array.from({ length: DAYS_PER_WEEK }, (_, dayIndex) => {
        const date = addDays(weekStart, dayIndex);
        const key = formatDateKey(date);
        const isFuture = date.getTime() > today.getTime();

        return {
          date,
          key,
          count: isFuture ? 0 : (activityMap.get(key) || 0),
          isFuture,
          weekIndex,
          dayIndex,
        };
      });

      return {
        weekStart,
        days,
      };
    });

    const cells = columns
      .flatMap((column) => column.days)
      .filter((cell) => !cell.isFuture);

    const labels = columns.map((column, index) => {
      const month = column.weekStart.toLocaleString(undefined, { month: 'short' });
      if (index === 0) {
        return month;
      }

      const prevMonth = columns[index - 1].weekStart.getMonth();
      return prevMonth !== column.weekStart.getMonth() ? month : '';
    });

    const streakCounts = cells.map((cell) => cell.count > 0);
    let bestStreak = 0;
    let runningStreak = 0;
    streakCounts.forEach((isActive) => {
      if (isActive) {
        runningStreak += 1;
        bestStreak = Math.max(bestStreak, runningStreak);
      } else {
        runningStreak = 0;
      }
    });

    let liveStreak = 0;
    for (let index = cells.length - 1; index >= 0; index -= 1) {
      if (cells[index].count > 0) {
        liveStreak += 1;
      } else {
        break;
      }
    }

    return {
      weekColumns: columns,
      visibleCells: cells,
      monthLabels: labels,
      totalActivities: cells.reduce((sum, cell) => sum + cell.count, 0),
      activeDays: cells.filter((cell) => cell.count > 0).length,
      currentStreak: liveStreak,
      maxStreak: bestStreak,
    };
  }, [activities]);

  const contributionRate = visibleCells.length > 0
    ? Math.round((activeDays / visibleCells.length) * 100)
    : 0;

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
        <div style={{ display: 'flex', gap: '3px', marginBottom: 'var(--sp-2)' }}>
          <div style={{ width: '24px', marginRight: 'var(--sp-3)' }} />
          <div style={{ display: 'flex', gap: '3px' }}>
            {monthLabels.map((label, index) => (
              <div
                key={`${label}-${index}`}
                style={{
                  width: '14px',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  textAlign: 'left',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '3px' }}>
          {/* Day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: 'var(--sp-3)' }}>
            {DAY_LABELS.map((label, i) => (
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
          <div style={{ display: 'flex', gap: '3px' }}>
            {weekColumns.map((column, weekIndex) => (
              <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {column.days.map((cell) => {
                  const tooltipCount = `${cell.count} activit${cell.count === 1 ? 'y' : 'ies'}`;
                  return (
                    <div
                      key={cell.key}
                      style={{
                        width: '14px',
                        height: '14px',
                        background: cell.isFuture ? 'transparent' : getIntensityColor(cell.count),
                        border: cell.isFuture ? '1px dashed rgba(255,255,255,0.08)' : getIntensityBorder(cell.count),
                        borderRadius: '3px',
                        cursor: cell.isFuture ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        opacity: cell.isFuture ? 0.35 : 1,
                      }}
                      title={cell.isFuture ? 'Future day' : `${dateFormatter.format(cell.date)}: ${tooltipCount}`}
                      onMouseEnter={(e) => {
                        if (cell.isFuture) return;
                        e.currentTarget.style.transform = 'scale(1.3)';
                        e.currentTarget.style.zIndex = '10';
                      }}
                      onMouseLeave={(e) => {
                        if (cell.isFuture) return;
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
            {maxStreak}
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
            {contributionRate}%
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
            width: `${contributionRate}%`,
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
