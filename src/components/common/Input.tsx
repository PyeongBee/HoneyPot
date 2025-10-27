import {
  cn,
  getInputClasses,
  type InputSize,
  type InputState,
} from "@/styles/components";
import React from "react";

// Input 관련 컴포넌트들
interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  children,
  className,
}) => (
  <div
    className={cn("flex items-center gap-4 flex-1 min-w-[300px]", className)}
  >
    {children}
  </div>
);

interface InputLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const InputLabel: React.FC<InputLabelProps> = ({
  children,
  htmlFor,
  className,
}) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      "text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap",
      className
    )}
  >
    {children}
  </label>
);

interface InputFieldProps {
  type?: "text" | "number" | "email" | "password";
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  size?: InputSize;
  state?: InputState;
  autoFocus?: boolean;
  readOnly?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className,
  id,
  min,
  max,
  step,
  size = "md",
  state = "default",
  autoFocus,
  readOnly,
}) => (
  <input
    id={id}
    type={type}
    className={getInputClasses(size, state, cn("flex-1", className))}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    min={min}
    max={max}
    step={step}
    autoFocus={autoFocus}
    readOnly={readOnly}
  />
);
