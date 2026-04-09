import React from 'react';

interface HackerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function HackerCard({ 
  children, 
  className = '',
  ...props 
}: HackerCardProps) {
  return (
    <div 
      className={`hacker-card ${className}`.trim()} 
      {...props}
    >
      {children}
    </div>
  );
}
