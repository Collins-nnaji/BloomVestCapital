import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import { api } from '../api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  background: #f5f5f0;
  min-height: 100vh;
  padding-top: 64px;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
  @media (max-width: 768px) { padding: 0 1.25rem; }
`;

const Hero = styled.section`
  padding: 4.5rem 0 3rem;
  animation: ${fadeIn} 0.6s ease both;
`;

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.4);
  margin-bottom: 1.5rem;
`;

const EyebrowLine = styled.div`
  width: 2rem;
  height: 1.5px;
  background: rgba(15, 23, 42, 0.2);
`;

const HeroHeadline = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  color: #0a0f1e;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
`;

const HeroSub = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(15, 23, 42, 0.58);
  max-width: 520px;
  margin: 0;
`;

const TabRow = styled.div`
  display: flex;
  gap: 0;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background: white;
  width: fit-content;
  margin: 2.5rem 0;
`;

const TabBtn = styled.button`
  padding: 0.7rem 1.6rem;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background: ${p => p.$active ? '#0a0f1e' : 'white'};
  color: ${p => p.$active ? 'white' : 'rgba(15,23,42,0.55)'};
  transition: all 0.2s;
  &:hover:not([data-active]) { background: rgba(15,23,42,0.04); }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  padding-bottom: 5rem;
  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const FormCard = styled.div`
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 12px;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease both;
`;

const FormTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0a0f1e;
  margin: 0 0 0.4rem;
`;

const FormDesc = styled.p`
  font-size: 0.83rem;
  color: rgba(15, 23, 42, 0.5);
  margin: 0 0 1.75rem;
  line-height: 1.55;
`;

const Field = styled.div`
  margin-bottom: 1.1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.6);
  margin-bottom: 0.35rem;
  letter-spacing: 0.02em;
`;

const inputStyles = `
  width: 100%;
  padding: 0.65rem 0.9rem;
  font-size: 0.88rem;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 8px;
  background: #f8f9fb;
  color: #0a0f1e;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
  &:focus { border-color: rgba(34,197,94,0.5); background: white; }
  &::placeholder { color: rgba(15,23,42,0.3); }
`;

const Input = styled.input`${inputStyles}`;
const Select = styled.select`${inputStyles} cursor: pointer;`;
const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 90px;
  line-height: 1.55;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: ${p => p.$loading ? 'rgba(15,23,42,0.4)' : '#0a0f1e'};
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  border-radius: 8px;
  cursor: ${p => p.$loading ? 'not-allowed' : 'pointer'};
  transition: background 0.2s;
  margin-top: 0.5rem;
  &:hover:not(:disabled) { background: #15803d; }
`;

const SuccessBanner = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 10px;
  padding: 1.25rem;
  text-align: center;
  color: #15803d;
  font-weight: 700;
  font-size: 0.92rem;
  animation: ${fadeIn} 0.4s ease both;
  line-height: 1.55;
`;

const ErrorBanner = styled.div`
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 0.85rem 1rem;
  color: #b91c1c;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: ${p => p.$dark ? '#0a0f1e' : 'white'};
  border: 1px solid ${p => p.$dark ? 'transparent' : 'rgba(15,23,42,0.1)'};
  border-radius: 12px;
  padding: 1.75rem;
`;

const InfoCardLabel = styled.div`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$light ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.35)'};
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid ${p => p.$dark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.06)'};
  &:last-child { border-bottom: none; }
`;

const InfoKey = styled.div`
  font-size: 0.78rem;
  font-family: 'JetBrains Mono', monospace;
  color: ${p => p.$light ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.4)'};
  min-width: 80px;
  flex-shrink: 0;
`;

const InfoVal = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${p => p.$light ? 'rgba(255,255,255,0.85)' : '#0a0f1e'};
  line-height: 1.45;
`;

const SERVICES = [
  'Investment Advisory',
  'Market Research & Intelligence',
  'Growth & Strategy',
  'Multiple services',
  'Not sure yet',
];

const TIMES = [
  'Morning (9am–12pm)',
  'Afternoon (12pm–5pm)',
  'Evening (5pm–8pm)',
  'Flexible',
];

function BookCallForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', preferred_time: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus('loading');
    setError('');
    try {
      await api.submitLead({ type: 'book_call', ...form });
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <FormCard>
        <SuccessBanner>
          ✓ Request received!<br />
          <span style={{ fontWeight: 400, fontSize: '0.85rem' }}>
            We'll reach out to <strong>{form.email}</strong> within one business day to confirm your call.
          </span>
        </SuccessBanner>
      </FormCard>
    );
  }

  return (
    <FormCard>
      <FormTitle>Book a discovery call</FormTitle>
      <FormDesc>
        A 30-minute session to understand your goals and see if we're the right fit. No pitch, no pressure.
      </FormDesc>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <form onSubmit={submit}>
        <Field>
          <Label>Full name *</Label>
          <Input required value={form.name} onChange={set('name')} placeholder="Jane Smith" />
        </Field>
        <Field>
          <Label>Work email *</Label>
          <Input required type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" />
        </Field>
        <Field>
          <Label>Company / Organisation</Label>
          <Input value={form.company} onChange={set('company')} placeholder="Acme Corp" />
        </Field>
        <Field>
          <Label>Preferred call time</Label>
          <Select value={form.preferred_time} onChange={set('preferred_time')}>
            <option value="">Select a preference…</option>
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
        <Field>
          <Label>What are you working on? (optional)</Label>
          <Textarea value={form.message} onChange={set('message')}
            placeholder="e.g. We're raising a Series A and need help with positioning and investor outreach…" />
        </Field>
        <SubmitBtn type="submit" $loading={status === 'loading'} disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting…' : 'Request a call →'}
        </SubmitBtn>
      </form>
    </FormCard>
  );
}

function DiscussServiceForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus('loading');
    setError('');
    try {
      await api.submitLead({ type: 'discuss_service', ...form });
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <FormCard>
        <SuccessBanner>
          ✓ Message sent!<br />
          <span style={{ fontWeight: 400, fontSize: '0.85rem' }}>
            A partner will review your request and follow up with <strong>{form.email}</strong> shortly.
          </span>
        </SuccessBanner>
      </FormCard>
    );
  }

  return (
    <FormCard>
      <FormTitle>Discuss a service</FormTitle>
      <FormDesc>
        Tell us which service interests you and what you're trying to solve. We'll come back with a tailored outline.
      </FormDesc>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <form onSubmit={submit}>
        <Field>
          <Label>Full name *</Label>
          <Input required value={form.name} onChange={set('name')} placeholder="Jane Smith" />
        </Field>
        <Field>
          <Label>Work email *</Label>
          <Input required type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" />
        </Field>
        <Field>
          <Label>Company / Organisation</Label>
          <Input value={form.company} onChange={set('company')} placeholder="Acme Corp" />
        </Field>
        <Field>
          <Label>Service of interest</Label>
          <Select value={form.service} onChange={set('service')}>
            <option value="">Select a service…</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field>
          <Label>What are you trying to solve? *</Label>
          <Textarea required value={form.message} onChange={set('message')}
            placeholder="e.g. We need a market entry report for Southeast Asia ahead of our Q3 board meeting…" />
        </Field>
        <SubmitBtn type="submit" $loading={status === 'loading'} disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send request →'}
        </SubmitBtn>
      </form>
    </FormCard>
  );
}

const ContactPage = () => {
  const location = useLocation();
  const initialTab = new URLSearchParams(location.search).get('tab') === 'service' ? 'service' : 'call';
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const t = new URLSearchParams(location.search).get('tab');
    if (t === 'service') setTab('service');
  }, [location.search]);

  return (
    <Page>
      <Container>
        <Hero>
          <Eyebrow>
            <span>CONTACT</span>
            <EyebrowLine />
            <span>BLOOMVEST CAPITAL</span>
          </Eyebrow>
          <HeroHeadline>Let's talk about what you're building.</HeroHeadline>
          <HeroSub>
            Most engagements start with a single conversation. Tell us where you are and what you need — we'll take it from there.
          </HeroSub>

          <TabRow>
            <TabBtn $active={tab === 'call'} onClick={() => setTab('call')}>
              Book a discovery call
            </TabBtn>
            <TabBtn $active={tab === 'service'} onClick={() => setTab('service')}>
              Discuss a service
            </TabBtn>
          </TabRow>
        </Hero>

        <FormGrid>
          {tab === 'call' ? <BookCallForm key="call" /> : <DiscussServiceForm key="service" />}

          <InfoColumn>
            <InfoCard $dark>
              <InfoCardLabel $light>TYPICAL ENGAGEMENT DETAILS</InfoCardLabel>
              {[
                { k: 'Response', v: 'Within 1 business day' },
                { k: 'First call', v: '30 min, no-obligation' },
                { k: 'Format', v: 'Video or phone' },
                { k: 'Location', v: 'Remote-first, global' },
              ].map(r => (
                <InfoRow key={r.k} $dark>
                  <InfoKey $light>{r.k}</InfoKey>
                  <InfoVal $light>{r.v}</InfoVal>
                </InfoRow>
              ))}
            </InfoCard>

            <InfoCard>
              <InfoCardLabel>WHAT HAPPENS NEXT</InfoCardLabel>
              {[
                { k: '01', v: 'We review your request and send a calendar link' },
                { k: '02', v: 'A 30-min scoping call — no deck, just a conversation' },
                { k: '03', v: 'We send a short proposal within 5 business days' },
                { k: '04', v: 'You decide — no pressure, no follow-up spam' },
              ].map(r => (
                <InfoRow key={r.k}>
                  <InfoKey>{r.k}</InfoKey>
                  <InfoVal>{r.v}</InfoVal>
                </InfoRow>
              ))}
            </InfoCard>
          </InfoColumn>
        </FormGrid>
      </Container>
    </Page>
  );
};

export default ContactPage;
