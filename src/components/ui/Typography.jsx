
import React from 'react';
import { cn } from '../../utils/cn';

const Typography = ({ 
  variant = 'body1', 
  component, 
  className = '', 
  children, 
  ...props 
}) => {
  const variants = {
    h1: 'text-4xl font-bold tracking-tight text-foreground',
    h2: 'text-3xl font-semibold tracking-tight text-foreground',
    h3: 'text-2xl font-semibold tracking-tight text-foreground',
    h4: 'text-xl font-semibold tracking-tight text-foreground',
    h5: 'text-lg font-semibold tracking-tight text-foreground',
    h6: 'text-base font-semibold tracking-tight text-foreground',
    subtitle1: 'text-base font-medium text-foreground',
    subtitle2: 'text-sm font-medium text-foreground',
    body1: 'text-base text-foreground',
    body2: 'text-sm text-foreground',
    caption: 'text-xs text-muted-foreground',
    overline: 'text-xs uppercase tracking-wide text-muted-foreground',
    button: 'text-sm font-medium text-foreground'
  };

  const defaultComponents = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
    overline: 'span',
    button: 'span'
  };

  const Component = component || defaultComponents[variant] || 'p';

  return (
    <Component 
      className={cn(variants[variant], className)} 
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;
