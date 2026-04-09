import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'upvote' | 'upvote-active';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isActive?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  isActive = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClass = `btn-${variant}`;
  const activeClass = isActive ? 'active' : '';
  
  return (
    <button 
      className={`${baseClass} ${activeClass} ${className}`.trim()} 
      {...props}
    >
      {children}
    </button>
  );
}
