'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useId, type ChangeEvent } from 'react';

import { cn } from '@/utils/cn';

interface BaseFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'tel';
  multiline?: false;
  autoComplete?: string;
}

interface TextAreaProps extends BaseFieldProps {
  multiline: true;
  rows?: number;
  maxLength?: number;
}

export type FieldProps = TextFieldProps | TextAreaProps;

/**
 * Underline-only field. The rule is the whole interface: it glows gold on focus
 * and turns to a hairline of error colour when invalid.
 */
export function TextField(props: FieldProps) {
  const { label, name, value, onChange, error, required, placeholder, hint, className } = props;
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange(event.target.value);

  const controlClasses = cn(
    'peer w-full border-0 border-b border-line bg-transparent pb-3 pt-1',
    'font-serif text-[length:var(--text-lead)] font-light text-ink',
    'placeholder:text-muted/45 placeholder:font-sans placeholder:text-sm',
    'outline-none transition-colors duration-500',
    'focus:border-gold',
    error && 'border-[#b4553f]',
  );

  return (
    <div className={cn('relative flex flex-col', className)}>
      <label
        htmlFor={id}
        className="mb-2 font-sans text-[0.5625rem] uppercase tracking-[0.32em] text-muted"
      >
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>

      {props.multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          rows={props.rows ?? 4}
          maxLength={props.maxLength}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(controlClasses, 'resize-none leading-relaxed')}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={props.type ?? 'text'}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          autoComplete={props.autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={controlClasses}
        />
      )}

      {/* Focus rule that draws in from the left */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold-deep to-gold-soft transition-transform duration-700 ease-[var(--ease-luxe)] peer-focus:scale-x-100"
        style={{ bottom: hint || error ? '1.75rem' : 0 }}
      />

      <div className="min-h-[1.5rem] pt-2">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              id={errorId}
              role="alert"
              className="font-sans text-[0.6875rem] text-[#b4553f]"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              id={hintId}
              className="font-sans text-[0.6875rem] text-muted/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
