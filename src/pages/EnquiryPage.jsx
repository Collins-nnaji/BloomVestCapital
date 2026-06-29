import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaSearchLocation, FaKey, FaHandshake } from 'react-icons/fa';
import { api } from '../api';

/* ── animations ── */
const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

/* ── layout ── */
const Page = styled.div`
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: #1c1917;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1.25rem 5rem;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 65% 55% at 50% 30%, rgba(34,197,94,.1), transparent 60%),
      radial-gradient(ellipse 40% 35% at 80% 80%, rgba(34,197,94,.06), transparent 50%);
    pointer-events: none;
  }
`;

const Card = styled(motion.div)`
  position: relative;
  z-index: 2;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 28px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 620px;
  backdrop-filter: blur(12px);
`;

/* ── progress bar ── */
const ProgressBar = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-bottom: 2rem;
`;

const ProgressSegment = styled.div`
  flex: 1;
  height: 4px;
  border-radius: 100px;
  background: ${p => p.$done ? '#22c55e' : p.$active ? '#4ade80' : 'rgba(255,255,255,.1)'};
  transition: background .3s;
`;

/* ── step labels ── */
const StepLabel = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4ade80;
  margin: 0 0 0.5rem;
`;

const StepTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 0.5rem;
  letter-spacing: -0.03em;
  line-height: 1.15;
`;

const StepSub = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: rgba(248,250,252,.5);
  line-height: 1.6;
  margin: 0 0 2rem;
`;

/* ── enquiry type cards ── */
const TypeRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
`;

const TypeCard = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: 16px;
  border: 1.5px solid ${p => p.$selected ? '#22c55e' : 'rgba(255,255,255,.1)'};
  background: ${p => p.$selected ? 'rgba(34,197,94,.1)' : 'rgba(255,255,255,.03)'};
  cursor: pointer;
  text-align: left;
  transition: border-color .18s, background .18s;
  &:hover { border-color: #4ade80; }
`;

const TypeIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 11px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34,197,94,.12);
  color: #4ade80;
  font-size: 1.05rem;
`;

const TypeText = styled.div`
  flex: 1;
`;

const TypeTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #f8fafc;
`;

const TypeDesc = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  color: rgba(248,250,252,.45);
  margin-top: 0.15rem;
`;

/* ── option pills ── */
const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.75rem;
`;

const Pill = styled.button`
  padding: 0.55rem 1.1rem;
  border-radius: 100px;
  border: 1.5px solid ${p => p.$selected ? '#22c55e' : 'rgba(255,255,255,.1)'};
  background: ${p => p.$selected ? 'rgba(34,197,94,.1)' : 'transparent'};
  color: ${p => p.$selected ? '#4ade80' : 'rgba(248,250,252,.55)'};
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all .18s;
  &:hover { border-color: #22c55e; color: #4ade80; }
`;

/* ── text input ── */
const Field = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  color: rgba(248,250,252,.7);
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1.5px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  color: #f8fafc;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color .18s;
  &::placeholder { color: rgba(248,250,252,.25); }
  &:focus { border-color: #22c55e; }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1.5px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  color: #f8fafc;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  transition: border-color .18s;
  &::placeholder { color: rgba(248,250,252,.25); }
  &:focus { border-color: #22c55e; }
`;

/* ── nav buttons ── */
const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.75rem;
  gap: 1rem;
`;

const BtnNext = styled.button`
  padding: 0.85rem 2rem;
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: auto;
  transition: transform .18s, box-shadow .18s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,197,94,.35); }
  &:disabled { opacity: .45; cursor: not-allowed; transform: none; box-shadow: none; }
`;

const BtnBack = styled.button`
  padding: 0.85rem 1.5rem;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,.12);
  background: transparent;
  color: rgba(248,250,252,.6);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  transition: border-color .18s;
  &:hover { border-color: #4ade80; color: #4ade80; }
`;

/* ── result card ── */
const ResultCard = styled(motion.div)`
  text-align: center;
  padding: 1rem 0;
`;

const ResultIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(34,197,94,.12);
  color: #4ade80;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

/* ── data ── */
const ENQUIRY_TYPES = [
  {
    id: 'investor_enquiry',
    icon: FaSearchLocation,
    title: 'I want to invest',
    desc: 'Sourcing deals, flips, buy-to-let, or development opportunities.',
  },
  {
    id: 'seller_enquiry',
    icon: FaKey,
    title: 'I have a property to sell',
    desc: 'Quick sale, inherited property, or a distressed property needing work.',
  },
  {
    id: 'jv_enquiry',
    icon: FaHandshake,
    title: 'I want a joint venture',
    desc: 'You bring capital, we bring the deal and expertise. We split the profit.',
  },
];

const INVESTMENT_FOCUS = ['Sourcing', 'Flips', 'Buy-to-Let', 'Joint Venture', 'Development'];
const CAPITAL_BANDS = ['£10k–25k', '£25k–75k', '£75k–250k', '£250k+'];
const TIMELINES = ['Ready now', 'Within 3 months', 'Within 6 months', 'Just exploring'];

const PROPERTY_SITUATIONS = ['Need to sell quickly', 'Inherited property', 'Distressed, needs repair', 'Landlord exit', 'Other'];
const JV_SPLITS = ['50/50', '60/40', 'Open to discuss'];

const TOTAL_STEPS = 3;

export default function EnquiryPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState(1);

  const [form, setForm] = useState({
    type: '',
    name: '', email: '', phone: '',
    // investor
    focus: [],
    capitalBand: '',
    timeline: '',
    // seller
    address: '',
    situation: '',
    guidePrice: '',
    // jv
    jvCapitalBand: '',
    jvSplit: '',
    notes: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleFocus = (g) => setForm(f => ({
    ...f,
    focus: f.focus.includes(g) ? f.focus.filter(x => x !== g) : [...f.focus, g],
  }));

  const canAdvance = () => {
    if (step === 0) return !!form.type;
    if (step === 1) return form.name.trim() && form.email.trim();
    return true;
  };

  const advance = () => {
    if (!canAdvance()) return;
    setDirection(1);
    setStep(s => s + 1);
  };

  const back = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const serviceLabel = () => {
    if (form.type === 'investor_enquiry') return form.focus.join(', ') || 'General investment';
    if (form.type === 'seller_enquiry') return form.situation || 'Property sale';
    if (form.type === 'jv_enquiry') return form.jvSplit ? `JV (${form.jvSplit})` : 'Joint venture';
    return 'General';
  };

  const messageBody = () => {
    if (form.type === 'investor_enquiry') {
      return `Capital available: ${form.capitalBand || 'Not specified'}. Timeline: ${form.timeline || 'Not specified'}. ${form.notes}`.trim();
    }
    if (form.type === 'seller_enquiry') {
      return `Address: ${form.address || 'Not provided'}. Guide price: ${form.guidePrice || 'Not specified'}. ${form.notes}`.trim();
    }
    if (form.type === 'jv_enquiry') {
      return `Capital to commit: ${form.jvCapitalBand || 'Not specified'}. Preferred split: ${form.jvSplit || 'Open to discuss'}. ${form.notes}`.trim();
    }
    return form.notes;
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.submitLead({
        type: form.type,
        name: form.name,
        email: form.email,
        service: serviceLabel(),
        message: messageBody(),
        preferred_time: form.phone || null,
      });
      setSubmitted(true);
    } catch (e) {
      setError('Could not submit. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <Page>
      <Card initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {!submitted ? (
          <>
            <ProgressBar>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <ProgressSegment key={i} $done={i < step} $active={i === step} />
              ))}
            </ProgressBar>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={step} custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}>

                {/* STEP 0 — ENQUIRY TYPE */}
                {step === 0 && (
                  <>
                    <StepLabel>Step 1 of {TOTAL_STEPS}</StepLabel>
                    <StepTitle>What brings you here?</StepTitle>
                    <StepSub>Tell us what you need, and we'll tailor the next few questions.</StepSub>
                    <TypeRow>
                      {ENQUIRY_TYPES.map(t => (
                        <TypeCard key={t.id} $selected={form.type === t.id} onClick={() => update('type', t.id)}>
                          <TypeIcon><t.icon /></TypeIcon>
                          <TypeText>
                            <TypeTitle>{t.title}</TypeTitle>
                            <TypeDesc>{t.desc}</TypeDesc>
                          </TypeText>
                        </TypeCard>
                      ))}
                    </TypeRow>
                  </>
                )}

                {/* STEP 1 — CONTACT + TYPE-SPECIFIC FIELDS */}
                {step === 1 && (
                  <>
                    <StepLabel>Step 2 of {TOTAL_STEPS}</StepLabel>
                    <StepTitle>Your details</StepTitle>
                    <StepSub>We'll use this to get back to you directly.</StepSub>
                    <Field>
                      <Label>Full Name *</Label>
                      <Input placeholder="Jane Smith" value={form.name} onChange={e => update('name', e.target.value)} />
                    </Field>
                    <Field>
                      <Label>Email Address *</Label>
                      <Input type="email" placeholder="jane@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                    </Field>
                    <Field>
                      <Label>Phone Number (optional)</Label>
                      <Input type="tel" placeholder="+44 7xxx xxxxxx" value={form.phone} onChange={e => update('phone', e.target.value)} />
                    </Field>

                    {form.type === 'investor_enquiry' && (
                      <>
                        <Label>Investment Focus</Label>
                        <PillRow>
                          {INVESTMENT_FOCUS.map(g => (
                            <Pill key={g} $selected={form.focus.includes(g)} onClick={() => toggleFocus(g)}>{g}</Pill>
                          ))}
                        </PillRow>
                        <Label>Capital Available</Label>
                        <PillRow>
                          {CAPITAL_BANDS.map(c => (
                            <Pill key={c} $selected={form.capitalBand === c} onClick={() => update('capitalBand', c)}>{c}</Pill>
                          ))}
                        </PillRow>
                        <Label>Timeline</Label>
                        <PillRow>
                          {TIMELINES.map(h => (
                            <Pill key={h} $selected={form.timeline === h} onClick={() => update('timeline', h)}>{h}</Pill>
                          ))}
                        </PillRow>
                      </>
                    )}

                    {form.type === 'seller_enquiry' && (
                      <>
                        <Field>
                          <Label>Property Address or Postcode</Label>
                          <Input placeholder="123 High Street, M1 1AA" value={form.address} onChange={e => update('address', e.target.value)} />
                        </Field>
                        <Label>Situation</Label>
                        <PillRow>
                          {PROPERTY_SITUATIONS.map(s => (
                            <Pill key={s} $selected={form.situation === s} onClick={() => update('situation', s)}>{s}</Pill>
                          ))}
                        </PillRow>
                        <Field>
                          <Label>Guide Price (optional)</Label>
                          <Input placeholder="£180,000" value={form.guidePrice} onChange={e => update('guidePrice', e.target.value)} />
                        </Field>
                      </>
                    )}

                    {form.type === 'jv_enquiry' && (
                      <>
                        <Label>Capital to Commit</Label>
                        <PillRow>
                          {CAPITAL_BANDS.map(c => (
                            <Pill key={c} $selected={form.jvCapitalBand === c} onClick={() => update('jvCapitalBand', c)}>{c}</Pill>
                          ))}
                        </PillRow>
                        <Label>Preferred Split</Label>
                        <PillRow>
                          {JV_SPLITS.map(s => (
                            <Pill key={s} $selected={form.jvSplit === s} onClick={() => update('jvSplit', s)}>{s}</Pill>
                          ))}
                        </PillRow>
                      </>
                    )}
                  </>
                )}

                {/* STEP 2 — NOTES + SUBMIT */}
                {step === 2 && (
                  <>
                    <StepLabel>Step 3 of {TOTAL_STEPS}</StepLabel>
                    <StepTitle>Anything else?</StepTitle>
                    <StepSub>Add any extra detail that will help us respond well.</StepSub>
                    <Field>
                      <Textarea
                        placeholder="e.g. I'm looking at properties in Manchester, prefer 2-3 bed houses..."
                        value={form.notes}
                        onChange={e => update('notes', e.target.value)}
                      />
                    </Field>
                    {error && <p style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
                  </>
                )}

              </motion.div>
            </AnimatePresence>

            <NavRow>
              {step > 0 ? (
                <BtnBack onClick={back}><FaArrowLeft /> Back</BtnBack>
              ) : <div />}

              {step < TOTAL_STEPS - 1 ? (
                <BtnNext onClick={advance} disabled={!canAdvance()}>
                  Continue <FaArrowRight />
                </BtnNext>
              ) : (
                <BtnNext onClick={submit} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Enquiry'} {!submitting && <FaArrowRight />}
                </BtnNext>
              )}
            </NavRow>
          </>
        ) : (
          <ResultCard initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
            <ResultIcon><FaCheckCircle /></ResultIcon>
            <StepTitle style={{ textAlign: 'center' }}>Enquiry received</StepTitle>
            <StepSub style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
              Thank you {form.name.split(' ')[0]}. Our team will review your enquiry and reach out to{' '}
              <strong style={{ color: '#f8fafc' }}>{form.email}</strong> shortly.
            </StepSub>
          </ResultCard>
        )}

      </Card>
    </Page>
  );
}
