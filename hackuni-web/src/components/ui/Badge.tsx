import React from 'react';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
}

export function Tag({ label, className = '', ...props }: TagProps) {
  return (
    <span className={`tag ${className}`.trim()} {...props}>
      {label}
    </span>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  type?: 'award' | 'verified' | 'pending';
}

export function Badge({ label, type = 'award', className = '', ...props }: BadgeProps) {
  let badgeClass = '';
  switch (type) {
    case 'award':
      badgeClass = 'badge-award';
      break;
    case 'verified':
      badgeClass = 'status-verified';
      break;
    case 'pending':
      badgeClass = 'status-pending';
      break;
  }

  return (
    <span className={`${badgeClass} ${className}`.trim()} {...props}>
      {label}
    </span>
  );
}
