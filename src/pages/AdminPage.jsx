import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers, FaUserShield, FaSearch, FaChartBar, FaChevronDown, FaChevronUp,
  FaTrash, FaPlus, FaCheck, FaTimes, FaLock, FaSignInAlt, FaAngleRight,
  FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaCoins, FaCheckCircle,
  FaClock, FaBolt, FaGraduationCap, FaExchangeAlt, FaChartLine, FaBriefcase, FaBell,
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
  danger:  '#dc2626',
  blue:    '#0284c7',
};

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const fmt  = n => (!n && n !== 0) ? '—' : Number(n).toLocaleString('en-GB', { minimumFractionDigits:0, maximumFractionDigits:0 });
const fmtDate = iso => iso ? new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—';
const timeAgo = iso => {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};
const initials = (name, email) => {
  if (name) return name.trim().split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  if (email) return email.slice(0,2).toUpperCase();
  return '??';
};

const shimmer = keyframes`0%{background-position:-600% 0}100%{background-position:600% 0}`;
const Skel = styled.div`
  border-radius:6px; height:${p=>p.$h||14}px; width:${p=>p.$w||'100%'};
  background:linear-gradient(90deg,#e9ecf0 25%,#f4f5f7 50%,#e9ecf0 75%);
  background-size:600% 100%; animation:${shimmer} 1.8s ease-in-out infinite;
  margin-bottom:${p=>p.$mb||0}px;
`;

/* ═══════════════════════════════════════════════════
   LAYOUT STYLED COMPONENTS
═══════════════════════════════════════════════════ */
const Page = styled.div`
  min-height: 100vh;
  background: ${T.paper};
  padding-top: 64px;
`;

const TopBar = styled.div`
  background: linear-gradient(160deg, #071120 0%, #0b1c30 60%, #091a10 100%);
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid rgba(201,168,76,0.12);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
`;

const Wrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 11px;
  padding: 0.25rem;
  width: fit-content;
  margin: 1.5rem 0 1.25rem;
`;

const Tab = styled.button`
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  display: flex; align-items: center; gap: 0.4rem;
  transition: all 0.15s;
  background: ${p => p.$active ? T.navy : 'transparent'};
  color: ${p => p.$active ? '#fff' : T.inkMute};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.5rem;
  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled(motion.div)`
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
`;

const StatVal = styled.div`font-family:'Space Grotesk',sans-serif; font-size:1.5rem; font-weight:800; color:${T.ink};`;
const StatLabel = styled.div`font-size:0.68rem; font-weight:700; color:${T.inkFaint}; text-transform:uppercase; letter-spacing:0.06em; margin-top:3px;`;
const StatSub = styled.div`font-size:0.72rem; color:${T.inkMute}; margin-top:4px;`;

const Card = styled.div`
  background: ${T.white};
  border: 1px solid ${T.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  margin-bottom: 1.25rem;
`;

const CardHead = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const CardTitle = styled.div`
  font-weight: 800;
  font-size: 0.84rem;
  color: ${T.ink};
  display: flex; align-items: center; gap: 0.45rem;
  text-transform: uppercase; letter-spacing: 0.05em;
`;

/* ── Search ── */
const SearchWrap = styled.div`
  display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 0.6rem 0.9rem 0.6rem 2.5rem;
  border: 1.5px solid ${T.border};
  border-radius: 10px;
  font-size: 0.85rem;
  color: ${T.ink};
  font-family: inherit;
  width: 280px;
  background: ${T.paper};
  transition: border-color 0.15s;
  &:focus { outline: none; border-color: ${T.gold}; background: ${T.white}; }
`;

const SearchWrapInner = styled.div`position: relative; display: flex; align-items: center;`;

/* ── User table ── */
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
`;
const TH = styled.th`
  text-align: left;
  padding: 0.6rem 1.25rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: ${T.inkFaint};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  background: #fafbfc;
  border-bottom: 1px solid ${T.border};
  white-space: nowrap;
`;
const TR = styled.tr`
  transition: background 0.1s;
  cursor: pointer;
  &:hover { background: #fafbfd; }
  &:not(:last-child) { border-bottom: 1px solid #f8fafc; }
`;
const TD = styled.td`
  padding: 0.75rem 1.25rem;
  vertical-align: middle;
  color: ${T.inkMid};
`;

const Avatar = styled.div`
  width: 34px; height: 34px; border-radius: 50%;
  background: ${p => p.$color || T.navy};
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 800; color: #fff;
  flex-shrink: 0;
  font-family: 'Space Grotesk',sans-serif;
`;

/* ── User drawer ── */
const Overlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px); z-index: 200;
  display: flex; align-items: stretch; justify-content: flex-end;
`;

const Drawer = styled(motion.div)`
  background: ${T.white};
  width: 100%;
  max-width: 540px;
  height: 100vh;
  overflow-y: auto;
  box-shadow: -8px 0 40px rgba(0,0,0,0.15);
  border-left: 1px solid ${T.border};
`;

const DrawerHead = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: ${T.white}; z-index: 10;
`;

const DrawerBody = styled.div`padding: 1.5rem;`;

const DrawerSection = styled.div`
  margin-bottom: 1.5rem;
`;

const DSTitle = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  color: ${T.inkFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
  display: flex; align-items: center; gap: 0.4rem;
`;

const MetaPair = styled.div`
  display: flex; align-items: flex-start; gap: 0.6rem;
  padding: 0.5rem 0; border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }
`;
const MK = styled.div`font-size: 0.68rem; font-weight: 700; color: ${T.inkFaint}; text-transform: uppercase; letter-spacing: 0.05em; width: 100px; flex-shrink: 0; padding-top: 1px;`;
const MV = styled.div`font-size: 0.85rem; color: ${T.ink}; font-weight: 600; flex: 1;`;

const TradeRow = styled.div`
  display: flex; align-items: center; gap: 0.65rem;
  padding: 0.45rem 0; border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }
  font-size: 0.8rem;
`;

const TypeBadge = styled.span`
  font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;
  background: ${p => p.$buy ? 'rgba(21,128,61,0.1)' : 'rgba(220,38,38,0.1)'};
  color: ${p => p.$buy ? T.green : T.danger};
`;

const GoalMini = styled.div`
  padding: 0.6rem 0.75rem;
  border: 1px solid ${T.border};
  border-radius: 10px;
  margin-bottom: 0.5rem;
  background: #fafbfc;
`;

const ProgressTrack = styled.div`height: 4px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-top: 5px;`;
const ProgressFill  = styled(motion.div)`height: 100%; border-radius: 99px; background: ${p => p.$c || T.green};`;

/* ── Form ── */
const FG = styled.div`display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.7rem;`;
const FL = styled.label`font-size: 0.65rem; font-weight: 700; color: ${T.inkFaint}; text-transform: uppercase; letter-spacing: 0.07em;`;
const FI = styled.input`
  padding: 0.6rem 0.8rem; border: 1.5px solid ${T.border}; border-radius: 9px;
  font-size: 0.85rem; color: ${T.ink}; background: ${T.white}; font-family: inherit;
  width: 100%; box-sizing: border-box;
  &:focus { outline: none; border-color: ${T.gold}; }
`;

const Btn = styled(motion.button)`
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.62rem 1.2rem; border-radius: 9px; font-family: inherit;
  font-size: 0.84rem; font-weight: 700; cursor: pointer;
  background: ${p => p.$danger ? T.danger : T.navy};
  color: #fff; border: none;
  box-shadow: 0 2px 8px rgba(11,22,34,0.15);
`;

const GhostBtn = styled.button`
  padding: 0.6rem 1.1rem; border: 1.5px solid ${T.border}; border-radius: 9px;
  background: ${T.white}; font-size: 0.84rem; font-weight: 600; color: ${T.inkMute};
  cursor: pointer; font-family: inherit;
  &:hover { color: ${T.danger}; border-color: ${T.danger}; }
`;

const AdminRow = styled.div`
  display: flex; align-items: center; gap: 1rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }
`;

const Pagination = styled.div`
  display: flex; align-items: center; gap: 0.5rem; justify-content: center; padding: 1rem;
`;
const PageBtn = styled.button`
  padding: 0.4rem 0.75rem; border-radius: 7px;
  border: 1.5px solid ${p => p.$active ? T.navy : T.border};
  background: ${p => p.$active ? T.navy : T.white};
  color: ${p => p.$active ? '#fff' : T.inkMid};
  font-size: 0.8rem; font-weight: 700; cursor: pointer; font-family: inherit;
  &:disabled { opacity: 0.4; cursor: default; }
`;

/* ── Auth gate ── */
const AuthGate = styled.div`
  min-height: 100vh;
  background: linear-gradient(160deg, #071120 0%, #0b1c30 50%, #0e1f14 100%);
  display: flex; align-items: center; justify-content: center; padding: 2rem;
`;

/* ═══════════════════════════════════════════════════
   USER DETAIL DRAWER
═══════════════════════════════════════════════════ */
function UserDrawer({ userId, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    api.getAdminUser(userId).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [userId]);

  const pct = (cur, tgt) => tgt ? Math.min(100, Math.round((cur/tgt)*100)) : 0;

  return (
    <Overlay initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
      <Drawer initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', stiffness:300, damping:30 }} onClick={e => e.stopPropagation()}>
        <DrawerHead>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1rem', color:T.ink }}>User Profile</div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:T.inkMute, fontSize:'1rem' }}><FaTimes /></button>
        </DrawerHead>

        {loading ? (
          <DrawerBody>
            {[80,14,14,60,14,14,14,80,14,14,14].map((h,i) => <Skel key={i} $h={h} $mb={10} />)}
          </DrawerBody>
        ) : !data ? (
          <DrawerBody><p style={{ color:T.inkMute }}>Failed to load user.</p></DrawerBody>
        ) : (
          <DrawerBody>
            {/* User identity */}
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
              <Avatar $color={data.user.avatar_color || T.navy} style={{ width:54, height:54, fontSize:'1.1rem' }}>
                {initials(data.user.display_name, data.user.email)}
              </Avatar>
              <div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1.1rem', color:T.ink }}>{data.user.display_name || data.user.email?.split('@')[0] || 'User'}</div>
                <div style={{ fontSize:'0.8rem', color:T.inkMute }}>{data.user.email || 'No email'}</div>
                <div style={{ fontSize:'0.72rem', color:T.inkFaint, marginTop:2 }}>Joined {fmtDate(data.user.created_at)}</div>
              </div>
            </div>

            {/* Profile */}
            <DrawerSection>
              <DSTitle><FaUsers style={{ color:T.gold }} /> Investor Profile</DSTitle>
              {[
                ['Risk', data.user.risk_tolerance || '—'],
                ['Level', data.user.investor_type || '—'],
                ['Style', data.user.investment_style || '—'],
                ['Focus', data.user.primary_focus || '—'],
                ['Location', data.user.location || '—'],
                ['Experience', data.user.experience_years ? `${data.user.experience_years} years` : '—'],
              ].map(([k,v]) => (
                <MetaPair key={k}><MK>{k}</MK><MV>{v}</MV></MetaPair>
              ))}
            </DrawerSection>

            {/* Financial snapshot */}
            <DrawerSection>
              <DSTitle><FaChartLine style={{ color:T.blue }} /> Financials</DSTitle>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
                {[
                  { label:'Net Worth',     val:`£${fmt(data.user.net_worth)}`,     color:T.ink   },
                  { label:'Monthly Income',val:`£${fmt(data.user.monthly_income)}`,color:T.green },
                  { label:'Monthly Savings',val:`£${fmt(data.user.monthly_savings)}`,color:T.green },
                  { label:'Portfolio Balance',val:`£${fmt(data.user.balance)}`,    color:T.blue  },
                ].map(s => (
                  <div key={s.label} style={{ background:'#fafbfc', borderRadius:10, padding:'0.65rem 0.75rem', border:`1px solid ${T.border}` }}>
                    <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1rem', color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:'0.65rem', fontWeight:700, color:T.inkFaint, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </DrawerSection>

            {/* Goals */}
            {data.goals.length > 0 && (
              <DrawerSection>
                <DSTitle><FaBolt style={{ color:T.gold }} /> Goals ({data.goals.length})</DSTitle>
                {data.goals.map(g => (
                  <GoalMini key={g.id}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ fontSize:'0.82rem', fontWeight:700, color:T.ink }}>{g.emoji} {g.title}</span>
                      <span style={{ fontSize:'0.72rem', fontWeight:800, color:g.completed ? T.green : T.inkMute }}>{pct(g.current_amount, g.target_amount)}%</span>
                    </div>
                    <div style={{ fontSize:'0.72rem', color:T.inkFaint }}>£{fmt(g.current_amount)} of £{fmt(g.target_amount)}</div>
                    <ProgressTrack><ProgressFill $c={g.color||T.green} initial={{ width:0 }} animate={{ width:`${pct(g.current_amount,g.target_amount)}%` }} transition={{ duration:0.8 }} /></ProgressTrack>
                  </GoalMini>
                ))}
              </DrawerSection>
            )}

            {/* Learning */}
            <DrawerSection>
              <DSTitle><FaGraduationCap style={{ color:T.green }} /> Learning</DSTitle>
              <div style={{ display:'flex', gap:'1.5rem', marginBottom:'0.75rem' }}>
                {[
                  { label:'Terms Learned', val:data.learnedCount },
                  { label:'AI Sessions',   val:data.sessions.length },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.3rem', fontWeight:800, color:T.ink }}>{s.val}</div>
                    <div style={{ fontSize:'0.67rem', fontWeight:700, color:T.inkFaint, textTransform:'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </DrawerSection>

            {/* Recent trades */}
            {data.trades.length > 0 && (
              <DrawerSection>
                <DSTitle><FaExchangeAlt style={{ color:T.blue }} /> Recent Trades ({data.trades.length})</DSTitle>
                {data.trades.slice(0, 8).map(t => (
                  <TradeRow key={t.id}>
                    <TypeBadge $buy={t.type==='BUY'}>{t.type}</TypeBadge>
                    <span style={{ fontWeight:700, color:T.ink }}>{t.symbol}</span>
                    <span style={{ color:T.inkMute }}>{t.shares} shares</span>
                    <span style={{ color:T.inkMute }}>@ £{fmt(t.price)}</span>
                    <span style={{ marginLeft:'auto', fontSize:'0.7rem', color:T.inkFaint }}>{timeAgo(t.created_at)}</span>
                  </TradeRow>
                ))}
              </DrawerSection>
            )}
          </DrawerBody>
        )}
      </Drawer>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════ */
export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin,      setIsAdmin]      = useState(null);
  const [activeTab,    setActiveTab]    = useState('users');

  /* users */
  const [users,        setUsers]        = useState([]);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState('');
  const [searchInput,  setSearchInput]  = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /* stats */
  const [stats,        setStats]        = useState(null);

  /* admins */
  const [admins,       setAdmins]       = useState([]);
  const [adminsLoading,setAdminsLoading]= useState(false);
  const [newAdminEmail,setNewAdminEmail]= useState('');
  const [addingAdmin,  setAddingAdmin]  = useState(false);

  /* service requests / leads */
  const [leads,        setLeads]        = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsFilter,  setLeadsFilter]  = useState('');
  const [subscribers,  setSubscribers]  = useState([]);
  const [subsLoading,  setSubsLoading]  = useState(false);

  const LIMIT = 25;
  const totalPages = Math.ceil(total / LIMIT);

  /* check admin access */
  useEffect(() => {
    if (!user) return;
    api.checkAdmin().then(r => setIsAdmin(r.isAdmin)).catch(() => setIsAdmin(false));
  }, [user]);

  /* load stats */
  useEffect(() => {
    if (!isAdmin) return;
    api.getAdminStats().then(setStats).catch(()=>{});
  }, [isAdmin]);

  /* load users */
  useEffect(() => {
    if (!isAdmin) return;
    setUsersLoading(true);
    api.getAdminUsers(page, LIMIT, search).then(d => {
      setUsers(d.users || []);
      setTotal(d.total || 0);
    }).catch(()=>{}).finally(() => setUsersLoading(false));
  }, [isAdmin, page, search]);

  /* load admins */
  useEffect(() => {
    if (!isAdmin || activeTab !== 'admins') return;
    setAdminsLoading(true);
    api.getAdminAdmins().then(d => setAdmins(d.admins || [])).catch(()=>{}).finally(() => setAdminsLoading(false));
  }, [isAdmin, activeTab]);

  /* load leads / subscribers */
  useEffect(() => {
    if (!isAdmin || activeTab !== 'services') return;
    setLeadsLoading(true);
    setSubsLoading(true);
    api.getAdminLeads(leadsFilter).then(d => setLeads(d.leads || [])).catch(()=>{}).finally(() => setLeadsLoading(false));
    api.getAdminSubscribers().then(d => setSubscribers(d.subscribers || [])).catch(()=>{}).finally(() => setSubsLoading(false));
  }, [isAdmin, activeTab, leadsFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleAddAdmin = useCallback(async () => {
    if (!newAdminEmail.trim()) return;
    setAddingAdmin(true);
    try {
      const res = await api.addAdmin(newAdminEmail.trim());
      if (res?.admin) setAdmins(a => [...a, res.admin]);
      setNewAdminEmail('');
    } catch {/* silent */}
    setAddingAdmin(false);
  }, [newAdminEmail]);

  const handleRemoveAdmin = useCallback(async (email) => {
    if (!window.confirm(`Remove admin access for ${email}?`)) return;
    try {
      await api.removeAdmin(email);
      setAdmins(a => a.filter(x => x.email !== email));
    } catch {/* silent */}
  }, []);

  /* ── Loading ── */
  if (authLoading) return (
    <Page>
      <div style={{ padding:'4rem 1.5rem', maxWidth:900, margin:'0 auto' }}>
        {[0,1,2,3].map(i=><Skel key={i} $h={48} $mb={12} />)}
      </div>
    </Page>
  );

  /* ── Not logged in ── */
  if (!user) return (
    <AuthGate>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        style={{ background:'rgba(15,32,53,0.92)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:24, padding:'3rem 2.5rem', textAlign:'center', maxWidth:400, width:'100%', backdropFilter:'blur(12px)' }}>
        <FaLock style={{ color:T.gold, fontSize:'2rem', marginBottom:'1rem' }} />
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.4rem', fontWeight:800, color:'#fff', margin:'0 0 0.5rem' }}>Admin Access Required</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.88rem', margin:'0 0 1.75rem' }}>Sign in with your admin account to access the platform dashboard.</p>
        <a href="/auth" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.85rem 2rem', background:`linear-gradient(135deg,${T.navy},${T.navyMid})`, color:'#fff', fontWeight:700, borderRadius:11, textDecoration:'none', fontSize:'0.9rem', border:'1px solid rgba(201,168,76,0.25)' }}>
          <FaSignInAlt /> Sign In
        </a>
      </motion.div>
    </AuthGate>
  );

  /* ── Not admin ── */
  if (isAdmin === false) return (
    <AuthGate>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        style={{ background:'rgba(15,32,53,0.92)', border:'1px solid rgba(220,38,38,0.2)', borderRadius:24, padding:'3rem 2.5rem', textAlign:'center', maxWidth:400, width:'100%', backdropFilter:'blur(12px)' }}>
        <FaUserShield style={{ color:T.danger, fontSize:'2rem', marginBottom:'1rem' }} />
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.4rem', fontWeight:800, color:'#fff', margin:'0 0 0.5rem' }}>Access Denied</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.88rem', margin:0 }}>You don't have admin access. Contact the platform owner to request access.</p>
      </motion.div>
    </AuthGate>
  );

  /* ── Admin check pending ── */
  if (isAdmin === null) return (
    <Page>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100vh - 64px)' }}>
        <div style={{ color:T.inkMute, fontSize:'0.9rem' }}>Verifying access…</div>
      </div>
    </Page>
  );

  return (
    <Page>
      <TopBar>
        <Wrap>
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontSize:'0.65rem', fontWeight:700, color:'rgba(201,168,76,0.7)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.4rem' }}>
              BloomVest Capital
            </div>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.65rem', fontWeight:800, color:'#fff', margin:'0 0 0.3rem', letterSpacing:'-0.02em' }}>
              Platform Admin
            </h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.85rem', margin:0 }}>
              Manage users, admins, and platform overview
            </p>
          </div>
        </Wrap>
      </TopBar>

      <Wrap style={{ paddingTop:'1.5rem' }}>

        {/* ── Platform stats ── */}
        {stats && (
          <StatsGrid>
            {[
              { label:'Total Users',    val:fmt(stats.users?.total || 0),     sub:`+${stats.users?.new_7d||0} this week`,     color:T.navy   },
              { label:'Goals Set',      val:fmt(stats.goals?.total || 0),     sub:`${stats.goals?.completed||0} completed`,   color:T.green  },
              { label:'Trades',         val:fmt(stats.trades?.total || 0),    sub:`£${fmt(stats.trades?.volume||0)} volume`,  color:T.blue   },
              { label:'AI Sessions',    val:fmt(stats.sessions?.total || 0),  sub:'Total glossary lookups',                   color:'#7c3aed'},
            ].map((s,i) => (
              <StatCard key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}>
                <StatVal style={{ color:s.color }}>{s.val}</StatVal>
                <StatLabel>{s.label}</StatLabel>
                <StatSub>{s.sub}</StatSub>
              </StatCard>
            ))}
          </StatsGrid>
        )}

        {/* ── Tabs ── */}
        <TabBar>
          <Tab $active={activeTab==='users'}    onClick={() => setActiveTab('users')}><FaUsers /> Users</Tab>
          <Tab $active={activeTab==='services'} onClick={() => setActiveTab('services')}><FaBriefcase /> Services</Tab>
          <Tab $active={activeTab==='admins'}   onClick={() => setActiveTab('admins')}><FaUserShield /> Admins</Tab>
        </TabBar>

        {/* ══════════════════ USERS TAB ══════════════════ */}
        {activeTab === 'users' && (
          <>
            <Card>
              <CardHead>
                <CardTitle><FaUsers style={{ color:T.navy }} /> All Users</CardTitle>
                <SearchWrap>
                  <form onSubmit={handleSearch}>
                    <SearchWrapInner>
                      <FaSearch style={{ position:'absolute', left:10, color:T.inkFaint, fontSize:'0.75rem' }} />
                      <SearchInput
                        placeholder="Search name, email, location…"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                      />
                    </SearchWrapInner>
                  </form>
                  <span style={{ fontSize:'0.78rem', color:T.inkFaint, whiteSpace:'nowrap' }}>{total} users</span>
                </SearchWrap>
              </CardHead>

              {usersLoading ? (
                <div style={{ padding:'1.5rem 1.25rem' }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} style={{ display:'flex', gap:'1rem', alignItems:'center', marginBottom:'0.85rem' }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'#e2e8f0', flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <Skel $h={13} $w="40%" $mb={5} />
                        <Skel $h={11} $w="60%" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div style={{ padding:'3rem', textAlign:'center', color:T.inkMute }}>
                  {search ? `No users matching "${search}"` : 'No users found'}
                </div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <Table>
                    <thead>
                      <tr>
                        <TH>User</TH>
                        <TH>Email</TH>
                        <TH>Risk</TH>
                        <TH>Goals</TH>
                        <TH>Trades</TH>
                        <TH>Learned</TH>
                        <TH>Joined</TH>
                        <TH />
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <TR key={u.id} onClick={() => setSelectedUser(u.id)}>
                          <TD>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                              <Avatar $color={u.avatar_color || T.navy}>{initials(u.display_name, u.email)}</Avatar>
                              <div>
                                <div style={{ fontWeight:700, color:T.ink, fontSize:'0.84rem' }}>{u.display_name || u.email?.split('@')[0] || 'User'}</div>
                                {u.location && <div style={{ fontSize:'0.7rem', color:T.inkFaint }}>{u.location}</div>}
                              </div>
                            </div>
                          </TD>
                          <TD style={{ fontSize:'0.78rem' }}>{u.email || '—'}</TD>
                          <TD>
                            <span style={{ fontSize:'0.72rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:5, background: u.risk_tolerance==='aggressive'?'rgba(220,38,38,0.09)':u.risk_tolerance==='conservative'?'rgba(2,132,199,0.09)':'rgba(217,119,6,0.09)', color: u.risk_tolerance==='aggressive'?T.danger:u.risk_tolerance==='conservative'?T.blue:'#d97706' }}>
                              {u.risk_tolerance||'—'}
                            </span>
                          </TD>
                          <TD style={{ fontWeight:700, color:T.ink }}>{u.goal_count||0}</TD>
                          <TD style={{ fontWeight:700, color:T.ink }}>{u.trade_count||0}</TD>
                          <TD style={{ fontWeight:700, color:T.green }}>{u.learned_count||0}</TD>
                          <TD style={{ fontSize:'0.72rem', color:T.inkFaint, whiteSpace:'nowrap' }}>{fmtDate(u.created_at)}</TD>
                          <TD><FaAngleRight style={{ color:T.border }} /></TD>
                        </TR>
                      ))}
                    </tbody>
                  </Table>

                  {totalPages > 1 && (
                    <Pagination>
                      <PageBtn onClick={() => setPage(p=>p-1)} disabled={page===1}>← Prev</PageBtn>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const p = Math.max(1, Math.min(totalPages-4, page-2)) + i;
                        return <PageBtn key={p} $active={p===page} onClick={() => setPage(p)}>{p}</PageBtn>;
                      })}
                      <PageBtn onClick={() => setPage(p=>p+1)} disabled={page===totalPages}>Next →</PageBtn>
                    </Pagination>
                  )}
                </div>
              )}
            </Card>
          </>
        )}

        {/* ══════════════════ SERVICES TAB ══════════════════ */}
        {activeTab === 'services' && (
          <>
            {/* Fund Management Requests */}
            <Card>
              <CardHead>
                <CardTitle><FaBriefcase style={{ color:T.gold }} /> Fund Management Requests</CardTitle>
                <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                  {[['','All'],['fund_management','Fund Mgmt'],['book_call','Book Call'],['discuss_service','Discuss'],['general','General']].map(([val,lbl]) => (
                    <button key={val} onClick={() => setLeadsFilter(val)}
                      style={{ padding:'0.28rem 0.65rem', borderRadius:99, border:`1.5px solid ${leadsFilter===val ? T.navy : T.border}`, background:leadsFilter===val ? T.navy : 'transparent', color:leadsFilter===val ? '#fff' : T.inkMute, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </CardHead>
              {leadsLoading ? (
                <div style={{ padding:'1.25rem' }}>{[0,1,2,3].map(i=><Skel key={i} $h={44} $mb={8} />)}</div>
              ) : leads.length === 0 ? (
                <div style={{ padding:'2rem', textAlign:'center', color:T.inkFaint, fontSize:'0.85rem' }}>No service requests yet.</div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8rem' }}>
                    <thead>
                      <tr>
                        {['Name','Email','Type','Amount','Timeline','Submitted'].map(h => (
                          <th key={h} style={{ textAlign:'left', padding:'0.6rem 1.25rem', fontSize:'0.62rem', fontWeight:700, color:T.inkFaint, textTransform:'uppercase', letterSpacing:'0.07em', background:'#fafbfc', borderBottom:`1px solid ${T.border}`, whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(l => (
                        <tr key={l.id} style={{ borderBottom:`1px solid #f8fafc` }}>
                          <td style={{ padding:'0.7rem 1.25rem', fontWeight:700, color:T.ink }}>{l.name}</td>
                          <td style={{ padding:'0.7rem 1.25rem', color:T.inkMute }}>{l.email}</td>
                          <td style={{ padding:'0.7rem 1.25rem' }}>
                            <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:5, background: l.type==='fund_management'?'rgba(201,168,76,0.1)':'rgba(2,132,199,0.08)', color: l.type==='fund_management'?T.gold:T.blue }}>
                              {l.type.replace('_',' ')}
                            </span>
                          </td>
                          <td style={{ padding:'0.7rem 1.25rem', color:T.inkMid, fontSize:'0.78rem' }}>{l.investment_range || '—'}</td>
                          <td style={{ padding:'0.7rem 1.25rem', color:T.inkMid, fontSize:'0.78rem' }}>{l.investment_timeline || '—'}</td>
                          <td style={{ padding:'0.7rem 1.25rem', color:T.inkFaint, fontSize:'0.72rem', whiteSpace:'nowrap' }}>{fmtDate(l.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Insights Subscribers */}
            <Card>
              <CardHead>
                <CardTitle><FaBell style={{ color:T.green }} /> Insights Subscribers</CardTitle>
                <span style={{ fontSize:'0.78rem', color:T.inkFaint }}>{subscribers.length} total</span>
              </CardHead>
              {subsLoading ? (
                <div style={{ padding:'1.25rem' }}>{[0,1,2,3].map(i=><Skel key={i} $h={44} $mb={8} />)}</div>
              ) : subscribers.length === 0 ? (
                <div style={{ padding:'2rem', textAlign:'center', color:T.inkFaint, fontSize:'0.85rem' }}>No subscribers yet.</div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8rem' }}>
                    <thead>
                      <tr>
                        {['Email','Name','Frequency','Topics','Subscribed'].map(h => (
                          <th key={h} style={{ textAlign:'left', padding:'0.6rem 1.25rem', fontSize:'0.62rem', fontWeight:700, color:T.inkFaint, textTransform:'uppercase', letterSpacing:'0.07em', background:'#fafbfc', borderBottom:`1px solid ${T.border}`, whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map(s => (
                        <tr key={s.id} style={{ borderBottom:`1px solid #f8fafc` }}>
                          <td style={{ padding:'0.7rem 1.25rem', fontWeight:700, color:T.ink }}>{s.email}</td>
                          <td style={{ padding:'0.7rem 1.25rem', color:T.inkMute }}>{s.name || '—'}</td>
                          <td style={{ padding:'0.7rem 1.25rem' }}>
                            <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:5, background:s.frequency==='daily'?'rgba(21,128,61,0.08)':'rgba(2,132,199,0.08)', color:s.frequency==='daily'?T.green:T.blue }}>
                              {s.frequency}
                            </span>
                          </td>
                          <td style={{ padding:'0.7rem 1.25rem', color:T.inkMid, fontSize:'0.75rem' }}>{(s.topics||[]).join(', ') || '—'}</td>
                          <td style={{ padding:'0.7rem 1.25rem', color:T.inkFaint, fontSize:'0.72rem', whiteSpace:'nowrap' }}>{fmtDate(s.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}

        {/* ══════════════════ ADMINS TAB ══════════════════ */}
        {activeTab === 'admins' && (
          <Card>
            <CardHead>
              <CardTitle><FaUserShield style={{ color:T.gold }} /> Admin Members</CardTitle>
            </CardHead>

            {/* Add admin form */}
            <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid #f1f5f9`, background:'#fafbfc' }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:T.inkMute, marginBottom:'0.65rem', textTransform:'uppercase', letterSpacing:'0.07em' }}>Add New Admin</div>
              <div style={{ display:'flex', gap:'0.65rem', alignItems:'center', flexWrap:'wrap' }}>
                <div style={{ position:'relative', flex:1, minWidth:220 }}>
                  <FaEnvelope style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:T.inkFaint, fontSize:'0.75rem' }} />
                  <FI
                    type="email"
                    value={newAdminEmail}
                    onChange={e => setNewAdminEmail(e.target.value)}
                    placeholder="email@example.com"
                    onKeyDown={e => e.key==='Enter' && handleAddAdmin()}
                    style={{ paddingLeft:'2.25rem', marginBottom:0 }}
                  />
                </div>
                <Btn onClick={handleAddAdmin} disabled={addingAdmin} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                  {addingAdmin ? 'Adding…' : <><FaPlus /> Add Admin</>}
                </Btn>
              </div>
              <p style={{ fontSize:'0.72rem', color:T.inkFaint, margin:'0.5rem 0 0', lineHeight:1.5 }}>
                Admin members can view all user profiles and platform analytics. The account must sign in first before being granted admin access.
              </p>
            </div>

            {adminsLoading ? (
              <div style={{ padding:'1.25rem' }}>
                {[0,1,2].map(i => <Skel key={i} $h={44} $mb={8} />)}
              </div>
            ) : (
              <div>
                {admins.map(a => (
                  <AdminRow key={a.id}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:T.navy, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <FaUserShield style={{ color:T.gold, fontSize:'0.85rem' }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.88rem', fontWeight:700, color:T.ink }}>{a.email}</div>
                      <div style={{ fontSize:'0.7rem', color:T.inkFaint }}>
                        Added {fmtDate(a.created_at)} {a.added_by && a.added_by !== 'system' ? `by ${a.added_by}` : '(system)'}
                      </div>
                    </div>
                    {a.email === user?.email ? (
                      <span style={{ fontSize:'0.72rem', fontWeight:700, color:T.gold, border:`1px solid rgba(201,168,76,0.25)`, padding:'0.2rem 0.6rem', borderRadius:99 }}>You</span>
                    ) : (
                      <GhostBtn onClick={() => handleRemoveAdmin(a.email)} style={{ fontSize:'0.76rem', padding:'0.35rem 0.75rem' }}>
                        <FaTrash style={{ fontSize:'0.6rem', marginRight:4 }} /> Remove
                      </GhostBtn>
                    )}
                  </AdminRow>
                ))}
                {admins.length === 0 && (
                  <div style={{ padding:'2rem', textAlign:'center', color:T.inkFaint }}>No admins found.</div>
                )}
              </div>
            )}
          </Card>
        )}

      </Wrap>

      {/* ── User detail drawer ── */}
      <AnimatePresence>
        {selectedUser && <UserDrawer userId={selectedUser} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>
    </Page>
  );
}
