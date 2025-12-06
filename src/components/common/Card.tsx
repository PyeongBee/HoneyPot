import React from 'react';

import { getCardClasses, type CardPadding, type CardShadow, cn } from '@/styles/components';

// Card 관련 컴포넌트들
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: CardPadding;
  shadow?: CardShadow;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = 'md', 
  shadow = 'sm' 
}) => (
  <div className={getCardClasses(padding, shadow, className)}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={cn('text-xl font-semibold text-gray-900 dark:text-white mb-3', className)}>
    {children}
  </h3>
);

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => (
  <p className={cn('text-gray-600 dark:text-gray-400 mb-4', className)}>
    {children}
  </p>
);
