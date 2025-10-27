import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 ${className}`}
  >
    {children}
  </div>
);

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className = "",
}) => (
  <h1
    className={`text-4xl font-bold text-gray-900 dark:text-white mb-4 ${className}`}
  >
    {children}
  </h1>
);

interface SectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionDescription: React.FC<SectionDescriptionProps> = ({
  children,
  className = "",
}) => (
  <p className={`text-lg text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);
