// SK +17/08/2026 - Contact modal component handling the research enquiry form, including GSAP open/close animations, field validation, keyboard focus management, accessible error states, and a simulated submission flow for this frontend prototype.
import { useRef, useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, Send } from 'lucide-react';
import gsap from 'gsap';
import { Button } from './ui/Button';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = {
  name: '',
  email: '',
  organization: '',
  subject: '',
  message: '',
};

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim())          errors.name    = 'Full name is required.';
  if (!values.email.trim())         errors.email   = 'Work email is required.';
  else if (!validateEmail(values.email)) errors.email = 'Please enter a valid email address.';
  if (!values.subject.trim())       errors.subject = 'Subject is required.';
  if (!values.message.trim())       errors.message = 'Message is required.';
  return errors;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const overlayRef   = useRef<HTMLDivElement>(null);
  const dialogRef    = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [values, setValues]     = useState<FormValues>(EMPTY);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [touched, setTouched]   = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  const animateIn = useCallback(() => {
    if (!overlayRef.current || !dialogRef.current) return;
    gsap.set(overlayRef.current, { opacity: 0, display: 'flex' });
    gsap.set(dialogRef.current, { opacity: 0, y: 24, scale: 0.97 });

    gsap.to(overlayRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.to(dialogRef.current, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.35, ease: 'power2.out',
      onComplete: () => firstInputRef.current?.focus(),
    });
  }, []);

  const animateOut = useCallback((cb: () => void) => {
    if (!overlayRef.current || !dialogRef.current) { cb(); return; }
    gsap.to(dialogRef.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.2, ease: 'power2.in' });
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        gsap.set(overlayRef.current!, { display: 'none' });
        cb();
      },
    });
  }, []);


  useEffect(() => {
    if (isOpen) {
      animateIn();
      document.body.style.overflow = 'hidden';
    } else {
      animateOut(() => {});
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, animateIn, animateOut]);

  const handleClose = useCallback(() => {
    animateOut(onClose);
  }, [animateOut, onClose]);


  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { handleClose(); return; }

  
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);


  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };


  const handleChange = (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (touched[field]) {
        const errs = validate({ ...values, [field]: e.target.value });
        setErrors((prev) => ({ ...prev, [field]: errs[field] }));
      }
    };

  const handleBlur = (field: keyof FormValues) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(values);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(values).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as typeof touched
    );
    setTouched(allTouched);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setSubmitted(false);
    firstInputRef.current?.focus();
  };


  const inputBase =
    'w-full bg-depth border text-ink-primary text-sm placeholder:text-ink-tertiary/50 px-4 py-3 rounded-sm outline-none transition-colors duration-200 focus:border-signal/60 focus:ring-1 focus:ring-signal/30';

  const inputCls = (field: keyof FormErrors) =>
    `${inputBase} ${touched[field] && errors[field] ? 'border-red-500/50' : 'border-white/8 hover:border-white/14'}`;



  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] items-center justify-center p-4 sm:p-6"
      style={{
        display: 'none',
        background: 'rgba(5, 10, 20, 0.80)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg bg-abyss border border-white/8 rounded-sm shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0C1525 0%, #080E1A 100%)',
          boxShadow: '0 0 0 1px rgba(43,168,152,0.08), 0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Corner accents */}
        {[
          'top-0 left-0 border-t border-l',
          'top-0 right-0 border-t border-r',
          'bottom-0 left-0 border-b border-l',
          'bottom-0 right-0 border-b border-r',
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute ${cls} w-5 h-5 border-signal/20 pointer-events-none`}
            aria-hidden="true"
          />
        ))}

        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-ink-tertiary hover:text-ink-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-light focus-visible:outline-offset-2 rounded"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="px-7 pt-7 pb-8 sm:px-8 sm:pt-8 sm:pb-9">
          {/* Header */}
          <div className="mb-7">
            <span className="label-mono text-signal/60 inline-block mb-3">Research access</span>
            <h2
              id="modal-title"
              className="text-xl font-light text-ink-primary leading-snug"
            >
              Contact the
              <br />
              <span className="text-gradient-teal">NEXUS research team</span>
            </h2>
          </div>

          {/*SUCCESS STATE */}
          {submitted ? (
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <CheckCircle size={40} className="text-signal-light" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-ink-primary mb-1">Inquiry received</p>
                <p className="text-xs text-ink-tertiary leading-relaxed max-w-[280px] mx-auto">
                  This is a frontend prototype — no data has been sent. In a production environment
                  your message would be received by our research team.
                </p>
              </div>
              <div className="flex gap-3 mt-1">
                <Button variant="ghost" onClick={handleReset}>
                  Send another
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : (

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-4">
                {/* Row: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="label-mono text-ink-tertiary/70 mb-1.5 block">
                      Full name <span className="text-signal/60" aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={handleChange('name')}
                      onBlur={handleBlur('name')}
                      className={inputCls('name')}
                      placeholder="Jane Smith"
                      aria-required="true"
                      aria-describedby={touched.name && errors.name ? 'err-name' : undefined}
                    />
                    {touched.name && errors.name && (
                      <p id="err-name" className="mt-1 text-2xs text-red-400" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="label-mono text-ink-tertiary/70 mb-1.5 block">
                      Work email <span className="text-signal/60" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange('email')}
                      onBlur={handleBlur('email')}
                      className={inputCls('email')}
                      placeholder="jane@lab.io"
                      aria-required="true"
                      aria-describedby={touched.email && errors.email ? 'err-email' : undefined}
                    />
                    {touched.email && errors.email && (
                      <p id="err-email" className="mt-1 text-2xs text-red-400" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="contact-org" className="label-mono text-ink-tertiary/70 mb-1.5 block">
                    Organization
                  </label>
                  <input
                    id="contact-org"
                    type="text"
                    autoComplete="organization"
                    value={values.organization}
                    onChange={handleChange('organization')}
                    className={`${inputBase} border-white/8 hover:border-white/14`}
                    placeholder="Research Institute / Company"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="label-mono text-ink-tertiary/70 mb-1.5 block">
                    Subject <span className="text-signal/60" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={values.subject}
                    onChange={handleChange('subject')}
                    onBlur={handleBlur('subject')}
                    className={inputCls('subject')}
                    placeholder="Research collaboration enquiry"
                    aria-required="true"
                    aria-describedby={touched.subject && errors.subject ? 'err-subject' : undefined}
                  />
                  {touched.subject && errors.subject && (
                    <p id="err-subject" className="mt-1 text-2xs text-red-400" role="alert">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="label-mono text-ink-tertiary/70 mb-1.5 block">
                    Message <span className="text-signal/60" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={values.message}
                    onChange={handleChange('message')}
                    onBlur={handleBlur('message')}
                    className={`${inputCls('message')} resize-none`}
                    placeholder="Describe your research interest or inquiry…"
                    aria-required="true"
                    aria-describedby={touched.message && errors.message ? 'err-message' : undefined}
                  />
                  {touched.message && errors.message && (
                    <p id="err-message" className="mt-1 text-2xs text-red-400" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Prototype notice */}
                <p className="text-2xs text-ink-tertiary/50 leading-relaxed">
                  Frontend prototype — form submission is simulated. No data is transmitted.
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="primary"
                    onClick={() => {}}
                    className={`flex-1 justify-center ${submitting ? 'opacity-60 pointer-events-none' : ''}`}
                    aria-label="Send inquiry"
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={14} aria-hidden="true" />
                        Send inquiry
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
