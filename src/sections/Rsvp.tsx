'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';

import { ChoiceGroup, type Choice } from '@/components/form/ChoiceGroup';
import { GuestCounter } from '@/components/form/GuestCounter';
import { SuccessBloom } from '@/components/form/SuccessBloom';
import { TextField } from '@/components/form/TextField';
import { EmbossedPanel } from '@/components/decor/islamic/EmbossedPanel';
import { GoldParticles } from '@/components/royal/GoldParticles';
import { FloralAccent, OrnamentalLine, RoyalCorner } from '@/components/royal/RoyalOrnaments';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EVENTS, RSVP_DEADLINE } from '@/constants/wedding';
import { EASE } from '@/constants/motion';
import { hasErrors, validateRsvp } from '@/utils/validation';
import type { FieldErrors, RsvpAttendance, RsvpFormValues, RsvpStatus } from '@/types';

const INITIAL_VALUES: RsvpFormValues = {
  name: '',
  email: '',
  phone: '',
  guests: 2,
  attendance: 'joyfully-accepts',
  events: EVENTS.map((event) => event.id),
  message: '',
};

const ATTENDANCE_CHOICES: readonly Choice<RsvpAttendance>[] = [
  { value: 'joyfully-accepts', label: 'Joyfully accepts', hint: 'We will be there' },
  { value: 'regretfully-declines', label: 'Regretfully declines', hint: 'With love from afar' },
];

/**
 * Section 10 — the RSVP.
 * Submits to `/api/rsvp`, which logs the response server-side; swap that route
 * for your own store, email or sheet without touching this component.
 */
export function Rsvp() {
  const [values, setValues] = useState<RsvpFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors<RsvpFormValues>>({});
  const [status, setStatus] = useState<RsvpStatus>('idle');

  const isAttending = values.attendance === 'joyfully-accepts';

  const eventChoices = useMemo<readonly Choice[]>(
    () => EVENTS.map((event) => ({ value: event.id, label: event.name, hint: event.date })),
    [],
  );

  const setField = useCallback(
    <K extends keyof RsvpFormValues>(key: K) =>
      (value: RsvpFormValues[K]) => {
        setValues((current) => ({ ...current, [key]: value }));
        setErrors((current) => {
          if (!current[key]) return current;
          const next = { ...current };
          delete next[key];
          return next;
        });
      },
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateRsvp(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
      setErrors({ message: 'Something went wrong sending your reply. Please try again.' });
    }
  };

  const reset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setStatus('idle');
  };

  return (
    <Section id="rsvp" label="RSVP">
      <GoldParticles count={22} intensity={0.5} opacity={0.5} />

      <SectionHeading
        eyebrow={`Kindly reply by ${RSVP_DEADLINE}`}
        script="Kindly reply &"
        title="Leave Your Wishes"
        description="Let us know you are coming so we can keep a seat — and a slice of cake — with your name on it."
      />

      <motion.div
        className="relative mx-auto mt-14 w-full max-w-3xl overflow-hidden rounded-[var(--radius-tile)] p-7 shadow-[0_30px_70px_-30px_rgba(47,37,33,0.45)] sm:mt-18 sm:p-12 lg:p-16"
        initial={{ opacity: 0, y: 60, filter: 'blur(16px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.6, ease: EASE.luxe }}
      >
        {/* The sheet: embossed cream stationery rather than a glass panel, so the
            form reads as writing on the invitation itself. */}
        <EmbossedPanel
          patternSize={56}
          depth={0.18}
          tooth={0.38}
          inkColor="#C7A469"
          background="linear-gradient(160deg, #FDF8F0 0%, #F6ECDC 54%, #EFE2CE 100%)"
        />
        <div aria-hidden className="pointer-events-none absolute inset-[clamp(0.6rem,2vw,1.1rem)] border border-gold/45" />
        <div aria-hidden className="pointer-events-none absolute inset-[clamp(0.95rem,2.6vw,1.5rem)] border border-gold/20" />
        <RoyalCorner corner="top-left" size={96} opacity={0.7} className="left-1 top-1" />
        <RoyalCorner corner="top-right" size={96} opacity={0.7} className="right-1 top-1" />
        <RoyalCorner corner="bottom-left" size={96} opacity={0.7} className="bottom-1 left-1" />
        <RoyalCorner corner="bottom-right" size={96} opacity={0.7} className="bottom-1 right-1" />

        {/* Ruled header, like a guestbook page */}
        <div className="relative mb-9 flex flex-col items-center">
          <FloralAccent variant="swag" size={48} className="opacity-80" />
          <OrnamentalLine width={200} className="mt-3 opacity-75" />
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              className="flex flex-col items-center py-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.9, ease: EASE.luxe }}
              role="status"
              aria-live="polite"
            >
              <GoldParticles count={30} intensity={1.25} opacity={0.9} />
              <SuccessBloom size={136} />

              <motion.h3
                className="mt-9 font-display text-[length:var(--text-h3)] font-light text-ink"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 2, ease: EASE.luxe }}
              >
                {isAttending ? 'Thank you — we cannot wait' : 'Thank you for letting us know'}
              </motion.h3>

              <motion.p
                className="mt-5 max-w-md text-pretty font-serif text-[length:var(--text-lead)] font-light leading-relaxed text-muted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 2.25, ease: EASE.luxe }}
              >
                {isAttending
                  ? `Your reply is safely with us, ${values.name.split(' ')[0]}. We have reserved ${values.guests} ${values.guests === 1 ? 'seat' : 'seats'} — see you on the day.`
                  : `We will miss you, ${values.name.split(' ')[0]}. Thank you for the years of love, and for telling us kindly.`}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.6 }}
                className="mt-10"
              >
                <OrnamentalLine width={200} />
              </motion.div>

              <motion.button
                type="button"
                onClick={reset}
                className="mt-8 font-sans text-[0.625rem] uppercase tracking-[0.32em] text-muted underline-offset-8 transition-colors duration-500 hover:text-gold-deep hover:underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.8 }}
              >
                Send another reply
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid gap-x-10 sm:grid-cols-2">
                <TextField
                  label="Full Name"
                  name="name"
                  value={values.name}
                  onChange={setField('name')}
                  error={errors.name}
                  placeholder="As you would like it on the place card"
                  autoComplete="name"
                  required
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={setField('phone')}
                  error={errors.phone}
                  placeholder="+880 1XXX XXXXXX"
                  autoComplete="tel"
                  required
                />
              </div>

              <TextField
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={setField('email')}
                error={errors.email}
                placeholder="you@example.com"
                autoComplete="email"
                hint="Optional — we will send directions and any updates here."
              />

              <ChoiceGroup
                label="Your Reply"
                mode="single"
                choices={ATTENDANCE_CHOICES}
                value={values.attendance}
                onChange={setField('attendance')}
                className="mt-4"
              />

              {/* Guest count and event picker only matter if they are coming. */}
              <AnimatePresence initial={false}>
                {isAttending && (
                  <motion.div
                    key="attending-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.7, ease: EASE.luxe }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <GuestCounter
                        value={values.guests}
                        onChange={setField('guests')}
                        error={errors.guests}
                      />

                      <ChoiceGroup
                        label="Which celebrations will you join?"
                        mode="multiple"
                        choices={eventChoices}
                        value={values.events}
                        onChange={setField('events')}
                        error={errors.events}
                        className="mt-6"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <TextField
                label="A Note for the Couple"
                name="message"
                multiline
                rows={4}
                maxLength={600}
                value={values.message}
                onChange={setField('message')}
                error={errors.message}
                placeholder="A blessing, a memory, or a song you want to hear…"
                hint={`${values.message.length} / 600`}
                className="mt-4"
              />

              <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
                <p className="order-2 font-sans text-[0.625rem] uppercase tracking-[0.24em] text-muted/70 sm:order-1">
                  Kindly reply by {RSVP_DEADLINE}
                </p>

                <div className="order-1 sm:order-2">
                  <Button
                    type="submit"
                    size="lg"
                    variant="wine"
                    disabled={status === 'submitting'}
                    icon={
                      status === 'submitting' ? (
                        <motion.span
                          className="block h-3.5 w-3.5 rounded-full border border-current border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                          aria-hidden
                        />
                      ) : (
                        <HiOutlineArrowLongRight aria-hidden />
                      )
                    }
                  >
                    {status === 'submitting' ? 'Sending' : 'Send Reply'}
                  </Button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
