'use client';

import { motion } from 'framer-motion';
import { HiOutlineCheck } from 'react-icons/hi2';

import { cn } from '@/utils/cn';

export interface Choice<T extends string = string> {
  readonly value: T;
  readonly label: string;
  readonly hint?: string;
}

interface CommonProps<T extends string> {
  label: string;
  choices: readonly Choice<T>[];
  error?: string;
  className?: string;
  columns?: 1 | 2;
}

/**
 * Discriminated on `mode` so a single-select group hands back one value and a
 * multi-select hands back an array — no casting at the call site.
 */
export type ChoiceGroupProps<T extends string> = CommonProps<T> &
  (
    | { mode: 'single'; value: T; onChange: (value: T) => void }
    | { mode: 'multiple'; value: readonly T[]; onChange: (value: T[]) => void }
  );

/** Pill-shaped selectable chips that keep native radio/checkbox semantics. */
export function ChoiceGroup<T extends string>(props: ChoiceGroupProps<T>) {
  const { label, choices, error, className, columns = 2 } = props;
  const selected: readonly T[] = props.mode === 'single' ? [props.value] : props.value;

  const toggle = (choiceValue: T) => {
    if (props.mode === 'single') {
      props.onChange(choiceValue);
      return;
    }

    props.onChange(
      props.value.includes(choiceValue)
        ? props.value.filter((item) => item !== choiceValue)
        : [...props.value, choiceValue],
    );
  };

  return (
    <fieldset className={cn('flex flex-col', className)}>
      <legend className="mb-3 font-sans text-[0.5625rem] uppercase tracking-[0.32em] text-muted">
        {label} <span className="ml-1 text-gold">*</span>
      </legend>

      <div className={cn('grid gap-2.5', columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1')}>
        {choices.map((choice) => {
          const isSelected = selected.includes(choice.value);

          return (
            <label
              key={choice.value}
              className={cn(
                'group relative flex cursor-pointer items-center gap-3 border px-4 py-3.5 transition-all duration-500 ease-[var(--ease-luxe)]',
                isSelected
                  ? 'border-gold bg-gold/10 shadow-[var(--shadow-lift)]'
                  : 'border-line bg-transparent hover:border-gold/45 hover:bg-ivory/50',
              )}
            >
              <input
                type={props.mode === 'single' ? 'radio' : 'checkbox'}
                name={label}
                value={choice.value}
                checked={isSelected}
                onChange={() => toggle(choice.value)}
                className="sr-only"
              />

              <span
                aria-hidden
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-500',
                  props.mode === 'single' ? 'rounded-full' : 'rounded-[1px]',
                  isSelected ? 'border-gold bg-gold text-ivory' : 'border-line text-transparent',
                )}
              >
                <motion.span
                  initial={false}
                  animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.26, 0.64, 1] }}
                >
                  <HiOutlineCheck className="text-xs" />
                </motion.span>
              </span>

              <span className="min-w-0">
                <span
                  className={cn(
                    'block font-serif text-[0.9375rem] font-light leading-snug transition-colors duration-500',
                    isSelected ? 'text-ink' : 'text-muted group-hover:text-ink',
                  )}
                >
                  {choice.label}
                </span>
                {choice.hint && (
                  <span className="mt-0.5 block font-sans text-[0.625rem] uppercase tracking-[0.2em] text-muted/70">
                    {choice.hint}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div className="min-h-[1.5rem] pt-2">
        {error && (
          <p role="alert" className="font-sans text-[0.6875rem] text-[#b4553f]">
            {error}
          </p>
        )}
      </div>
    </fieldset>
  );
}
