import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGraduationCap, FaBrain, FaRobot, FaArrowRight, FaChartLine,
  FaBriefcase, FaUser, FaBell, FaCheck, FaTimes, FaShieldAlt,
  FaChevronDown, FaRegEnvelope, FaCoins, FaCalendarAlt,
} from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import { api } from '../api';

/* ═══════════════════════════════════════════════════
   TOKENS
═══════════════════════════════════════════════════ */
const T = {
  navy:    '#0b1622',
  navyMid: '#0f2035',
  gold:    '#c9a84c',
  green:   '#15803d',
  paper:   '#f7f8fa',
  white:   '#ffffff',
  border:  '#e2e8f0',
  ink:     '#0d1b2a',
  inkMid:  '#334155',
  inkMute: '#64748b',
  inkFaint:'#94a3b8',
};

/* ═══════════════════════════════════════════════════
   TOOLS DATA
═══════════════════════════════════════════════════ */
const TOOLS = [
  { to:'/academy', icon:FaGraduationCap, color:'#15803d', bg:'#f0fdf4', border:'#bbf7d0', label:'Academy',   desc:'AI-guided lessons, quizzes, and real-money simulations.' },
  { to:'/iq',      icon:FaBrain,         color:'#7c3aed', bg:'#faf5ff', border:'#ddd6fe', label:'Market IQ', desc:'Decode headlines, study cases, and analyse documents.' },
  { to:'/mentor',  icon:FaRobot,         color:'#0284c7', bg:'#f0f9ff', border:'#bae6fd', label:'AI Mentor', desc:'Ask anything about investing — your always-on tutor.' },
  { to:'/charts',  icon:FaChartLine,     color:'#d97706', bg:'#fffbeb', border:'#fde68a', label:'Charts',    desc:'Practise reading price action with live chart analysis.' },
];

const INVESTMENT_RANGES = ['Under £5,000', '£5,000 – £25,000', '£25,000 – £100,000', '£100,000 – £500,000', '£500,000+'];
const TIMELINES = ['Short-term (< 1 yr)', 'Medium-term (1–5 yrs)', 'Long-term (5+ yrs)', 'No specific timeline'];
const TOPICS = [
  { id:'equities',    label:'Equities',      emoji:'📈' },
  { id:'macro',       label:'Macro Trends',  emoji:'🌍' },
  { id:'crypto',      label:'Crypto',        emoji:'₿'  },
  { id:'bonds',       label:'Fixed Income',  emoji:'🏦' },
  { id:'commodities', label:'Commodities',   emoji:'🛢️' },
  { id:'property',    label:'Property',      emoji:'🏠' },
];

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const initials = (name, email) => {
  if (name) return name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  if (email) return email.slice(0,2).toUpperCase();
  return 'BV';
};

/* ═══════════════════════════════════════════════════
   STYLED
═══════════════════════════════════════════════════ */
const fade = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;

const Page = styled.div`
  min-height: 100vh;
  background: ${T.paper};
  padding-top: 64px;
  font-family: 'Inter', system-ui, sans-serif;
  animation: ${fade} 0.35s ease both;
`;

const Wrap = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
`;

/* ── Profile stripe ── */
const ProfileStripe = styled(motion.div)`
  background: linear-gradient(135deg, ${T.navy} 0%, #0f2035 60%, #0e1f14 100%);
  border-radius: 18px;
  padding: 1.5rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(201,168,76,0.12);
  &::before {
    content:'';
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
    background-size:40px 40px;
  }
`;

const PAvatarCircle = styled.div`
  width: 52px; height: 52px; border-radius: 50%;
  background: ${p => p.$color || T.green};
  border: 2.5px solid rgba(201,168,76,0.3);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Grotesk',sans-serif; font-size: 1.1rem; font-weight: 800; color: #fff;
  flex-shrink: 0; position: relative; z-index: 1;
`;

const PInfo = styled.div`flex:1; position:relative; z-index:1; min-width:0;`;

const PGreeting = styled.div`
  font-family: 'Space Grotesk',sans-serif;
  font-size: 1.15rem; font-weight: 800; color: #fff;
  margin-bottom: 0.15rem;
`;

const PSub = styled.div`font-size: 0.8rem; color: rgba(255,255,255,0.5);`;

const ProfileBtn = styled(motion.a)`
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0.6rem 1.2rem; background: rgba(201,168,76,0.12);
  border: 1px solid rgba(201,168,76,0.25); border-radius: 9px;
  color: ${T.gold}; font-size: 0.8rem; font-weight: 700;
  text-decoration: none; white-space: nowrap; position: relative; z-index: 1;
  transition: background 0.15s, border-color 0.15s;
  &:hover { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.4); }
`;

const CompletionBar = styled.div`
  flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; max-width: 120px;
`;
const CompletionFill = styled(motion.div)`height: 100%; background: ${T.gold}; border-radius: 99px;`;

/* ── Section headers ── */
const SectionHead = styled.div`
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;
`;
const SectionTitle = styled.h2`
  font-family: 'Space Grotesk',sans-serif;
  font-size: 1.05rem; font-weight: 800; color: ${T.ink}; margin: 0;
  letter-spacing: -0.01em;
`;
const SectionSub = styled.div`font-size: 0.78rem; color: ${T.inkMute}; margin-top: 2px;`;

const Divider = styled.div`
  height: 1px; background: ${T.border}; margin: 2rem 0;
`;

/* ── Tools grid ── */
const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  @media (max-width: 760px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 440px) { grid-template-columns: 1fr; }
`;

const ToolCard = styled(motion.button)`
  display: flex; flex-direction: column; align-items: flex-start; gap: 0.65rem;
  padding: 1.25rem 1.1rem; border-radius: 14px;
  border: 1.5px solid ${p => p.$border}; background: ${p => p.$bg};
  cursor: pointer; text-align: left; font-family: inherit;
  transition: box-shadow 0.18s, transform 0.14s;
  &:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.09); transform: translateY(-2px); }
`;

const ToolIco = styled.div`
  width: 40px; height: 40px; border-radius: 10px;
  background: ${p => p.$color}1a;
  display: flex; align-items: center; justify-content: center;
  color: ${p => p.$color}; font-size: 1.1rem;
`;
const ToolLabel = styled.div`
  font-family: 'Space Grotesk',sans-serif; font-size: 0.95rem; font-weight: 800; color: ${T.ink};
  display: flex; align-items: center; gap: 0.3rem; width: 100%;
  svg { margin-left: auto; color: ${T.inkFaint}; font-size: 0.7rem; }
`;
const ToolDesc = styled.p`font-size: 0.75rem; color: ${T.inkMute}; line-height: 1.5; margin: 0;`;

/* ── Services grid ── */
const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

const ServiceCard = styled(motion.div)`
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const SCHead = styled.div`
  padding: 1.4rem 1.5rem 1.1rem;
  background: ${p => p.$dark ? `linear-gradient(135deg,${T.navy},#0f2035)` : T.white};
  border-bottom: 1px solid ${p => p.$dark ? 'rgba(201,168,76,0.12)' : T.border};
  position: relative; overflow: hidden;
  &::before {
    content:'';
    position:absolute; inset:0;
    background-image: ${p => p.$dark ? `linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)` : 'none'};
    background-size: 32px 32px;
  }
`;

const SCIco = styled.div`
  width: 46px; height: 46px; border-radius: 12px;
  background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem; color: ${p => p.$color};
  margin-bottom: 0.85rem; position: relative; z-index: 1;
  border: 1px solid ${p => p.$color}20;
`;
const SCTitle = styled.div`
  font-family: 'Space Grotesk',sans-serif;
  font-size: 1.05rem; font-weight: 800;
  color: ${p => p.$light ? '#fff' : T.ink};
  margin-bottom: 0.3rem; position: relative; z-index: 1;
`;
const SCDesc = styled.p`
  font-size: 0.8rem; line-height: 1.6;
  color: ${p => p.$light ? 'rgba(255,255,255,0.55)' : T.inkMute};
  margin: 0; position: relative; z-index: 1;
`;

const SCBody = styled.div`padding: 1.25rem 1.5rem 1.5rem;`;

/* ── Form ── */
const FG = styled.div`display:flex; flex-direction:column; gap:0.25rem; margin-bottom:0.7rem;`;
const FL = styled.label`font-size:0.63rem; font-weight:700; color:${T.inkFaint}; text-transform:uppercase; letter-spacing:0.07em;`;
const FI = styled.input`
  padding:0.58rem 0.8rem; border:1.5px solid ${T.border}; border-radius:9px;
  font-size:0.85rem; color:${T.ink}; background:${T.white}; font-family:inherit; width:100%; box-sizing:border-box;
  transition:border-color 0.15s;
  &:focus{outline:none; border-color:${T.gold}; box-shadow:0 0 0 3px rgba(201,168,76,0.08);}
`;
const FSel = styled.select`
  padding:0.58rem 0.8rem; border:1.5px solid ${T.border}; border-radius:9px;
  font-size:0.85rem; color:${T.ink}; background:${T.white}; font-family:inherit; width:100%; box-sizing:border-box;
  &:focus{outline:none; border-color:${T.gold};}
`;
const FTA = styled.textarea`
  padding:0.58rem 0.8rem; border:1.5px solid ${T.border}; border-radius:9px;
  font-size:0.85rem; color:${T.ink}; background:${T.white}; font-family:inherit; width:100%; box-sizing:border-box;
  resize:vertical; min-height:72px;
  &:focus{outline:none; border-color:${T.gold};}
`;

const PrimaryBtn = styled(motion.button)`
  display:flex; align-items:center; justify-content:center; gap:0.4rem;
  padding:0.72rem 1.4rem; border:none; border-radius:10px;
  font-family:inherit; font-size:0.86rem; font-weight:700; cursor:pointer; width:100%;
  background: linear-gradient(135deg,${T.navy},#0f2035);
  color:#fff; box-shadow:0 3px 10px rgba(11,22,34,0.18);
  border:1px solid rgba(201,168,76,0.18);
  &:disabled{opacity:0.6;cursor:default;}
`;
const GoldBtn = styled(motion.button)`
  display:flex; align-items:center; justify-content:center; gap:0.4rem;
  padding:0.72rem 1.4rem; border:none; border-radius:10px;
  font-family:inherit; font-size:0.86rem; font-weight:700; cursor:pointer; width:100%;
  background: linear-gradient(135deg,#b8892e,${T.gold});
  color:${T.navy}; box-shadow:0 3px 10px rgba(201,168,76,0.25);
  &:disabled{opacity:0.6;cursor:default;}
`;

/* Topic pills */
const TopicGrid = styled.div`display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.25rem;`;
const TopicPill = styled.button`
  padding:0.28rem 0.65rem; border-radius:99px; cursor:pointer; font-family:inherit;
  font-size:0.73rem; font-weight:700; transition:all 0.12s;
  border:1.5px solid ${p => p.$active ? T.gold : T.border};
  background:${p => p.$active ? 'rgba(201,168,76,0.1)' : T.white};
  color:${p => p.$active ? T.gold : T.inkMute};
`;

/* Success state */
const SuccessBox = styled(motion.div)`
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:2rem 1.5rem; text-align:center; min-height:180px;
`;

/* Frequency tabs */
const FreqRow = styled.div`display:flex; gap:0.35rem; margin-top:0.25rem;`;
const FreqBtn = styled.button`
  flex:1; padding:0.45rem; border-radius:8px; font-family:inherit;
  font-size:0.75rem; font-weight:700; cursor:pointer; transition:all 0.12s;
  border:1.5px solid ${p => p.$active ? T.navy : T.border};
  background:${p => p.$active ? T.navy : T.white};
  color:${p => p.$active ? '#fff' : T.inkMute};
`;

/* ═══════════════════════════════════════════════════
   FUND MANAGEMENT FORM
═══════════════════════════════════════════════════ */
function FundManagementForm({ user }) {
  const [form, setForm] = useState({
    name:  user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    investment_range: '',
    investment_goals: '',
    investment_timeline: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.investment_range) {
      setError('Please fill in name, email, and investment amount.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.submitLead({
        type: 'fund_management',
        name: form.name,
        email: form.email,
        service: 'Fund Management',
        investment_range: form.investment_range,
        investment_goals: form.investment_goals,
        investment_timeline: form.investment_timeline,
        message: form.message,
      });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (done) return (
    <SuccessBox initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
      <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(21,128,61,0.1)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
        <FaCheck style={{ color:T.green, fontSize:'1.3rem' }} />
      </div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1rem', color:T.ink, marginBottom:6 }}>Request Received</div>
      <p style={{ fontSize:'0.82rem', color:T.inkMute, lineHeight:1.6, margin:0 }}>
        Thank you. Our investment team will review your request and reach out to {form.email} within 2 business days.
      </p>
    </SuccessBox>
  );

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:8, padding:'0.6rem 0.85rem', fontSize:'0.8rem', color:'#dc2626', marginBottom:'0.75rem' }}>
          {error}
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
        <FG><FL>Full Name</FL><FI value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your name" required /></FG>
        <FG><FL>Email</FL><FI type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" required /></FG>
      </div>
      <FG>
        <FL>Investment Amount</FL>
        <FSel value={form.investment_range} onChange={e=>set('investment_range',e.target.value)} required>
          <option value="">Select range…</option>
          {INVESTMENT_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
        </FSel>
      </FG>
      <FG>
        <FL>Investment Timeline</FL>
        <FSel value={form.investment_timeline} onChange={e=>set('investment_timeline',e.target.value)}>
          <option value="">Select timeline…</option>
          {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
        </FSel>
      </FG>
      <FG>
        <FL>Goals & Objectives (optional)</FL>
        <FTA rows={3} value={form.investment_goals} onChange={e=>set('investment_goals',e.target.value)} placeholder="e.g. Grow wealth for retirement, generate passive income, diversify existing portfolio…" />
      </FG>
      <PrimaryBtn type="submit" disabled={submitting} whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}>
        {submitting ? 'Submitting…' : <><FaBriefcase /> Request Fund Management</>}
      </PrimaryBtn>
      <p style={{ fontSize:'0.7rem', color:T.inkFaint, textAlign:'center', marginTop:'0.65rem', lineHeight:1.5 }}>
        No obligation — our team will contact you to discuss how we can help.
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════
   DAILY INSIGHTS FORM
═══════════════════════════════════════════════════ */
function DailyInsightsForm({ user }) {
  const [form, setForm] = useState({
    name:      user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email:     user?.email || '',
    frequency: 'daily',
    topics:    [],
  });
  const [submitting, setSubmitting]   = useState(false);
  const [done, setDone]               = useState(false);
  const [alreadySubbed, setAlreadySubbed] = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (!user?.email) return;
    api.checkInsights(user.email).then(r => { if (r.subscribed) setAlreadySubbed(true); }).catch(()=>{});
  }, [user]);

  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const toggleTopic = (id) => setForm(f => ({
    ...f,
    topics: f.topics.includes(id) ? f.topics.filter(t=>t!==id) : [...f.topics, id],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) { setError('Email is required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await api.subscribeInsights({ name: form.name, email: form.email, frequency: form.frequency, topics: form.topics });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (alreadySubbed && !done) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.5rem', textAlign:'center', minHeight:160 }}>
      <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.85rem' }}>
        <FaBell style={{ color:T.gold, fontSize:'1.1rem' }} />
      </div>
      <div style={{ fontWeight:800, fontSize:'0.92rem', color:T.ink, marginBottom:5 }}>You're already subscribed</div>
      <p style={{ fontSize:'0.78rem', color:T.inkMute, margin:0, lineHeight:1.5 }}>Daily investment insights are being sent to <strong>{user?.email}</strong>.</p>
    </div>
  );

  if (done) return (
    <SuccessBox initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
      <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
        <FaBell style={{ color:T.gold, fontSize:'1.3rem' }} />
      </div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1rem', color:T.ink, marginBottom:6 }}>Subscribed!</div>
      <p style={{ fontSize:'0.82rem', color:T.inkMute, lineHeight:1.6, margin:0 }}>
        Your first insights digest will arrive at <strong>{form.email}</strong>. You can update your preferences at any time.
      </p>
    </SuccessBox>
  );

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:8, padding:'0.6rem 0.85rem', fontSize:'0.8rem', color:'#dc2626', marginBottom:'0.75rem' }}>
          {error}
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
        <FG><FL>Name</FL><FI value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your name" /></FG>
        <FG><FL>Email</FL><FI type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" required /></FG>
      </div>
      <FG>
        <FL>Frequency</FL>
        <FreqRow>
          {['daily','weekly'].map(f => (
            <FreqBtn key={f} type="button" $active={form.frequency===f} onClick={() => set('frequency',f)}>
              {f === 'daily' ? '📅 Daily' : '📆 Weekly'}
            </FreqBtn>
          ))}
        </FreqRow>
      </FG>
      <FG>
        <FL>Topics of interest</FL>
        <TopicGrid>
          {TOPICS.map(t => (
            <TopicPill key={t.id} type="button" $active={form.topics.includes(t.id)} onClick={() => toggleTopic(t.id)}>
              {t.emoji} {t.label}
            </TopicPill>
          ))}
        </TopicGrid>
      </FG>
      <GoldBtn type="submit" disabled={submitting} whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} style={{ marginTop:'0.25rem' }}>
        {submitting ? 'Subscribing…' : <><FaBell /> Subscribe to Insights</>}
      </GoldBtn>
      <p style={{ fontSize:'0.7rem', color:T.inkFaint, textAlign:'center', marginTop:'0.65rem', lineHeight:1.5 }}>
        Free · Unsubscribe any time · No spam
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const firstName = profile?.display_name
    || user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || null;

  const avatarColor = profile?.avatar_color || T.navy;

  /* load profile for personalisation */
  useEffect(() => {
    if (!user) return;
    api.getProfile().then(d => setProfile(d.profile || {})).catch(()=>{});
  }, [user]);

  /* profile completeness score (0-5 fields) */
  const completionFields = [profile?.display_name, profile?.bio, profile?.location, profile?.risk_tolerance, profile?.monthly_income];
  const completionPct = profile ? Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100) : 0;

  return (
    <Page>
      <Wrap>

        {/* ── Personalised profile stripe ── */}
        {user && (
          <ProfileStripe initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
            <PAvatarCircle $color={avatarColor}>
              {initials(profile?.display_name, user.email)}
            </PAvatarCircle>

            <PInfo>
              <PGreeting>
                {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
              </PGreeting>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap', position:'relative', zIndex:1 }}>
                <PSub>Investment Profile</PSub>
                {profile && completionPct < 100 && (
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <CompletionBar>
                      <CompletionFill initial={{ width:0 }} animate={{ width:`${completionPct}%` }} transition={{ duration:1, delay:0.3 }} />
                    </CompletionBar>
                    <span style={{ fontSize:'0.7rem', color:'rgba(201,168,76,0.65)', fontWeight:700 }}>{completionPct}% complete</span>
                  </div>
                )}
              </div>
            </PInfo>

            <ProfileBtn href="/profile" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
              <FaUser style={{ fontSize:'0.7rem' }} />
              {completionPct === 100 ? 'View Profile' : 'Complete Profile'}
              <FaArrowRight style={{ fontSize:'0.6rem' }} />
            </ProfileBtn>
          </ProfileStripe>
        )}

        {/* If not signed in — soft CTA at top */}
        {!user && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:14, padding:'1.1rem 1.4rem', marginBottom:'1.75rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'0.95rem', color:T.ink, marginBottom:2 }}>Create your Investment Profile</div>
              <div style={{ fontSize:'0.78rem', color:T.inkMute }}>Track goals, net worth, and get personalised financial plans — sign in to get started.</div>
            </div>
            <a href="/auth" style={{ padding:'0.6rem 1.25rem', background:T.navy, color:'#fff', fontWeight:700, borderRadius:9, textDecoration:'none', fontSize:'0.82rem', whiteSpace:'nowrap', border:'1px solid rgba(201,168,76,0.18)', flexShrink:0 }}>
              Sign In →
            </a>
          </motion.div>
        )}

        {/* ── Tools ── */}
        <SectionHead>
          <div>
            <SectionTitle>Platform Tools</SectionTitle>
            <SectionSub>Everything you need to learn, analyse, and grow as an investor.</SectionSub>
          </div>
        </SectionHead>
        <ToolsGrid>
          {TOOLS.map(({ to, icon:Icon, color, bg, border, label, desc }, i) => (
            <ToolCard key={to} $bg={bg} $border={border}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07+0.1 }}
              onClick={() => navigate(to)}>
              <ToolIco $color={color}><Icon /></ToolIco>
              <ToolLabel>{label}<FaArrowRight /></ToolLabel>
              <ToolDesc>{desc}</ToolDesc>
            </ToolCard>
          ))}
        </ToolsGrid>

        <Divider />

        {/* ── Professional Services ── */}
        <SectionHead>
          <div>
            <SectionTitle>Professional Services</SectionTitle>
            <SectionSub>Work directly with our investment team or stay informed with curated daily insights.</SectionSub>
          </div>
        </SectionHead>

        <ServicesGrid>

          {/* Fund Management */}
          <ServiceCard initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
            <SCHead $dark>
              <SCIco $bg="rgba(201,168,76,0.12)" $color={T.gold}>
                <FaBriefcase />
              </SCIco>
              <SCTitle $light>Fund Management</SCTitle>
              <SCDesc $light>
                Let our experienced investment team manage your portfolio — tailored to your risk profile, goals, and timeline.
              </SCDesc>
              <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.85rem', flexWrap:'wrap', position:'relative', zIndex:1 }}>
                {['Personalised Strategy','Risk Management','Regular Reporting'].map(f => (
                  <span key={f} style={{ fontSize:'0.65rem', fontWeight:700, padding:'0.18rem 0.55rem', borderRadius:99, background:'rgba(201,168,76,0.1)', color:T.gold, border:'1px solid rgba(201,168,76,0.2)' }}>
                    <FaCheck style={{ fontSize:'0.5rem', marginRight:3, verticalAlign:'middle' }} />{f}
                  </span>
                ))}
              </div>
            </SCHead>
            <SCBody>
              <FundManagementForm user={user} />
            </SCBody>
          </ServiceCard>

          {/* Daily Insights */}
          <ServiceCard initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.26 }}>
            <SCHead>
              <SCIco $bg="rgba(201,168,76,0.08)" $color={T.gold}>
                <FaBell />
              </SCIco>
              <SCTitle>Daily Market Insights</SCTitle>
              <SCDesc>
                Get curated investment briefings delivered to your inbox — market moves, macro trends, and actionable ideas.
              </SCDesc>
              <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.85rem', flexWrap:'wrap' }}>
                {['Market Summaries','Macro Trends','Curated Ideas'].map(f => (
                  <span key={f} style={{ fontSize:'0.65rem', fontWeight:700, padding:'0.18rem 0.55rem', borderRadius:99, background:`rgba(21,128,61,0.07)`, color:T.green, border:`1px solid rgba(21,128,61,0.15)` }}>
                    <FaCheck style={{ fontSize:'0.5rem', marginRight:3, verticalAlign:'middle' }} />{f}
                  </span>
                ))}
              </div>
            </SCHead>
            <SCBody>
              <DailyInsightsForm user={user} />
            </SCBody>
          </ServiceCard>

        </ServicesGrid>

      </Wrap>
    </Page>
  );
}
