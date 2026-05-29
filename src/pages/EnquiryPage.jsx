import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaShieldAlt, FaChartLine, FaBolt } from 'react-icons/fa';
import { getApiBase } from '../api';

/* ── animations ── */
const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

/* ── layout ── */
const Page = styled.div`
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  background: #070b14;
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
      radial-gradient(ellipse 40% 35% at 80% 80%, rgba(56,189,248,.06), transparent 50%);
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

/* ── slider ── */
const SliderWrap = styled.div`
  margin-bottom: 1.75rem;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.6rem;
`;

const SliderLabel = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  color: #f8fafc;
`;

const SliderValue = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: ${p => p.$color || '#4ade80'};
`;

const SliderDesc = styled.p`
  font-size: 0.76rem;
  color: rgba(248,250,252,.4);
  margin: 0 0 0.75rem;
  font-family: 'DM Sans', sans-serif;
`;

const StyledRange = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 100px;
  background: linear-gradient(
    to right,
    ${p => p.$trackColor || '#22c55e'} 0%,
    ${p => p.$trackColor || '#22c55e'} ${p => p.$pct}%,
    rgba(255,255,255,.1) ${p => p.$pct}%,
    rgba(255,255,255,.1) 100%
  );
  outline: none;
  cursor: pointer;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${p => p.$trackColor || '#22c55e'};
    box-shadow: 0 0 0 4px rgba(34,197,94,.2);
    cursor: grab;
    transition: box-shadow .18s;
  }
  &::-webkit-slider-thumb:active { cursor: grabbing; box-shadow: 0 0 0 7px rgba(34,197,94,.25); }
`;

const SliderTicks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
`;

const Tick = styled.span`
  font-size: 0.65rem;
  color: rgba(248,250,252,.25);
  font-family: 'DM Sans', sans-serif;
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
  border: 1.5px solid ${p => p.$selected ? p.$color || '#22c55e' : 'rgba(255,255,255,.1)'};
  background: ${p => p.$selected ? (p.$bg || 'rgba(34,197,94,.1)') : 'transparent'};
  color: ${p => p.$selected ? (p.$color || '#4ade80') : 'rgba(248,250,252,.55)'};
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all .18s;
  &:hover {
    border-color: ${p => p.$color || '#22c55e'};
    color: ${p => p.$color || '#4ade80'};
  }
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

const StrategyBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  border-radius: 100px;
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$border};
  color: ${p => p.$color};
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  margin-bottom: 1.25rem;
`;

const ReturnRange = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4ade80, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
`;

/* ─────────────────────────────────────────────────
   helpers
───────────────────────────────────────────────── */
function riskLabel(v) {
  if (v <= 2) return { text: 'Very Low', color: '#38bdf8' };
  if (v <= 4) return { text: 'Low', color: '#4ade80' };
  if (v <= 6) return { text: 'Moderate', color: '#fbbf24' };
  if (v <= 8) return { text: 'High', color: '#fb923c' };
  return { text: 'Very High', color: '#f87171' };
}

function awarenessLabel(v) {
  const labels = ['', 'Complete Beginner', 'Beginner', 'Some Knowledge', 'Intermediate', 'Advanced Beginner', 'Intermediate+', 'Advanced', 'Expert', 'Professional', 'Institutional'];
  return labels[v] || 'Intermediate';
}

function capitalLabel(v) {
  const bands = ['Under £1k', '£1k–5k', '£5k–15k', '£15k–50k', '£50k–150k', '£150k–500k', '£500k+'];
  const idx = Math.min(Math.floor((v / 10) * (bands.length - 1)), bands.length - 1);
  return bands[idx];
}

function deriveStrategy(risk, awareness, horizon) {
  if (risk <= 3) return { name: 'Steady Growth', tag: 'Conservative', color: '#38bdf8', bg: 'rgba(14,165,233,.12)', border: 'rgba(14,165,233,.25)', icon: FaShieldAlt, ret: '6–10%' };
  if (risk <= 7) return { name: 'Core Portfolio', tag: 'Balanced', color: '#4ade80', bg: 'rgba(34,197,94,.12)', border: 'rgba(34,197,94,.25)', icon: FaChartLine, ret: '12–22%' };
  return { name: 'Alpha Seeker', tag: 'Aggressive', color: '#fbbf24', bg: 'rgba(245,158,11,.12)', border: 'rgba(245,158,11,.25)', icon: FaBolt, ret: '25–40%' };
}

const HORIZONS = ['Under 3 months', '3–6 months', '6–12 months', '1–3 years', '3–5 years', '5+ years'];
const GOALS = ['Capital Growth', 'Passive Income', 'Wealth Preservation', 'Retirement Planning', 'Short-term Trading', 'Portfolio Diversification'];

const TOTAL_STEPS = 5;

export default function EnquiryPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState(1);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    riskTolerance: 5,
    awarenessLevel: 5,
    capitalLevel: 5,
    horizon: '',
    goals: [],
    notes: '',
  });

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleGoal = (g) => setForm(f => ({
    ...f,
    goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g],
  }));

  const riskInfo = riskLabel(form.riskTolerance);
  const strategy = deriveStrategy(form.riskTolerance, form.awarenessLevel, form.horizon);

  const canAdvance = () => {
    if (step === 0) return form.name.trim() && form.email.trim();
    if (step === 3) return !!form.horizon;
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

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const base = await getApiBase();
      await fetch(`${base}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          riskLabel: riskInfo.text,
          awarenessLabel: awarenessLabel(form.awarenessLevel),
          capitalLabel: capitalLabel(form.capitalLevel),
          recommendedStrategy: strategy.name,
          expectedReturn: strategy.ret,
          submittedAt: new Date().toISOString(),
        }),
      });
      setSubmitted(true);
    } catch (e) {
      setError('Could not submit — please try again or email us directly.');
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

                {/* STEP 0 — CONTACT */}
                {step === 0 && (
                  <>
                    <StepLabel>Step 1 of {TOTAL_STEPS}</StepLabel>
                    <StepTitle>Let's get to know you</StepTitle>
                    <StepSub>We'll use this to match you with a dedicated account manager.</StepSub>
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
                  </>
                )}

                {/* STEP 1 — RISK */}
                {step === 1 && (
                  <>
                    <StepLabel>Step 2 of {TOTAL_STEPS}</StepLabel>
                    <StepTitle>What's your risk tolerance?</StepTitle>
                    <StepSub>Be honest — this shapes every decision we make for you. There's no wrong answer.</StepSub>

                    <SliderWrap>
                      <SliderHeader>
                        <SliderLabel>Risk Level</SliderLabel>
                        <SliderValue $color={riskInfo.color}>{form.riskTolerance}/10 — {riskInfo.text}</SliderValue>
                      </SliderHeader>
                      <SliderDesc>How much potential loss are you comfortable with in exchange for higher returns?</SliderDesc>
                      <StyledRange
                        min={1} max={10} step={1}
                        value={form.riskTolerance}
                        $pct={(form.riskTolerance - 1) / 9 * 100}
                        $trackColor={riskInfo.color}
                        onChange={e => update('riskTolerance', Number(e.target.value))}
                      />
                      <SliderTicks>
                        <Tick>Very Low</Tick>
                        <Tick>Moderate</Tick>
                        <Tick>Very High</Tick>
                      </SliderTicks>
                    </SliderWrap>

                    <SliderWrap>
                      <SliderHeader>
                        <SliderLabel>Market Awareness</SliderLabel>
                        <SliderValue $color="#a78bfa">{form.awarenessLevel}/10 — {awarenessLabel(form.awarenessLevel)}</SliderValue>
                      </SliderHeader>
                      <SliderDesc>How would you rate your current knowledge of investing and financial markets?</SliderDesc>
                      <StyledRange
                        min={1} max={10} step={1}
                        value={form.awarenessLevel}
                        $pct={(form.awarenessLevel - 1) / 9 * 100}
                        $trackColor="#7c3aed"
                        onChange={e => update('awarenessLevel', Number(e.target.value))}
                      />
                      <SliderTicks>
                        <Tick>Beginner</Tick>
                        <Tick>Intermediate</Tick>
                        <Tick>Expert</Tick>
                      </SliderTicks>
                    </SliderWrap>

                    <SliderWrap>
                      <SliderHeader>
                        <SliderLabel>Capital Available</SliderLabel>
                        <SliderValue $color="#38bdf8">{capitalLabel(form.capitalLevel)}</SliderValue>
                      </SliderHeader>
                      <SliderDesc>Approximate investment capital you're looking to deploy.</SliderDesc>
                      <StyledRange
                        min={0} max={10} step={1}
                        value={form.capitalLevel}
                        $pct={form.capitalLevel / 10 * 100}
                        $trackColor="#0ea5e9"
                        onChange={e => update('capitalLevel', Number(e.target.value))}
                      />
                      <SliderTicks>
                        <Tick>Under £1k</Tick>
                        <Tick>£50k</Tick>
                        <Tick>£500k+</Tick>
                      </SliderTicks>
                    </SliderWrap>
                  </>
                )}

                {/* STEP 2 — GOALS */}
                {step === 2 && (
                  <>
                    <StepLabel>Step 3 of {TOTAL_STEPS}</StepLabel>
                    <StepTitle>What are your goals?</StepTitle>
                    <StepSub>Select all that apply — we'll weight your strategy accordingly.</StepSub>
                    <PillRow>
                      {GOALS.map(g => (
                        <Pill key={g} $selected={form.goals.includes(g)} onClick={() => toggleGoal(g)}>
                          {g}
                        </Pill>
                      ))}
                    </PillRow>
                  </>
                )}

                {/* STEP 3 — HORIZON */}
                {step === 3 && (
                  <>
                    <StepLabel>Step 4 of {TOTAL_STEPS}</StepLabel>
                    <StepTitle>What's your time horizon?</StepTitle>
                    <StepSub>How long do you plan to keep your money invested?</StepSub>
                    <PillRow>
                      {HORIZONS.map(h => (
                        <Pill key={h} $selected={form.horizon === h} onClick={() => update('horizon', h)}
                          $color="#38bdf8" $bg="rgba(14,165,233,.1)">
                          {h}
                        </Pill>
                      ))}
                    </PillRow>
                  </>
                )}

                {/* STEP 4 — REVIEW + NOTES */}
                {step === 4 && (
                  <>
                    <StepLabel>Step 5 of {TOTAL_STEPS}</StepLabel>
                    <StepTitle>Your recommended strategy</StepTitle>
                    <StepSub>Based on your profile, here's what we'd propose — your manager will confirm this within 24 hours.</StepSub>

                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                      <StrategyBadge $color={strategy.color} $bg={strategy.bg} $border={strategy.border}>
                        <strategy.icon /> {strategy.tag} — {strategy.name}
                      </StrategyBadge>
                      <ReturnRange>{strategy.ret}</ReturnRange>
                      <p style={{ color: 'rgba(248,250,252,.45)', fontSize: '0.78rem', margin: '0 0 .25rem', fontFamily: "'DM Sans', sans-serif" }}>
                        Target annual return range
                      </p>
                      <p style={{ color: 'rgba(248,250,252,.3)', fontSize: '0.7rem', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                        Based on risk {form.riskTolerance}/10 · {awarenessLabel(form.awarenessLevel)} · {capitalLabel(form.capitalLevel)} · {form.horizon || 'Flexible'}
                      </p>
                    </div>

                    <Field>
                      <Label>Anything else you'd like us to know? (optional)</Label>
                      <Textarea placeholder="e.g. I have existing investments in tech stocks, I'd like to avoid crypto, etc."
                        value={form.notes} onChange={e => update('notes', e.target.value)} />
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
            <StepTitle style={{ textAlign: 'center' }}>Enquiry Received!</StepTitle>
            <StepSub style={{ textAlign: 'center', maxWidth: 380, margin: '0 auto 1.5rem' }}>
              Thank you {form.name.split(' ')[0]}. A dedicated account manager will review your profile and reach out to <strong style={{ color: '#f8fafc' }}>{form.email}</strong> within 24 hours with your personalised strategy proposal.
            </StepSub>
            <StrategyBadge $color={strategy.color} $bg={strategy.bg} $border={strategy.border} style={{ margin: '0 auto', display: 'inline-flex' }}>
              <strategy.icon /> Your Match: {strategy.name}
            </StrategyBadge>
            <p style={{ color: 'rgba(248,250,252,.3)', fontSize: '0.72rem', margin: '1.5rem 0 0', fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
              Capital at risk. Past performance is not indicative of future results.
            </p>
          </ResultCard>
        )}

      </Card>
    </Page>
  );
}
