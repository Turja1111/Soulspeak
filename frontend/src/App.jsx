import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import axios from 'axios';

// Axios interceptor to rewrite local API URL in production
axios.interceptors.request.use((config) => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocal && config.url && config.url.startsWith('http://localhost:5000')) {
    config.url = config.url.replace('http://localhost:5000', '/api');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  HeartHandshake,
  Leaf,
  LockKeyhole,
  Menu,
  MessageCircleHeart,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X
} from 'lucide-react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CompanionText from './pages/CompanionText';
import TrainingProgram from './pages/TrainingProgram';
import Admin from './pages/Admin';
import Forum from './pages/Forum';
import Report from './pages/Report';
import Chat from './pages/Chat';
import ResetPassword from './pages/ResetPassword';

const API_URL = 'http://localhost:5000';

const Home = ({ user }) => {
  const [quote, setQuote] = useState('You do not have to carry everything alone today.');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        setQuote(response.data?.slip?.advice || 'Small steps still count.');
      } catch (error) {
        setQuote('Welcome to a peaceful space for meaningful connection.');
      }
    };

    fetchQuote();
  }, []);

  const supportCards = [
    {
      icon: MessageCircleHeart,
      title: 'Free companion chat',
      text: 'Start a private conversation with trained community companions when you need someone steady nearby.'
    },
    {
      icon: UsersRound,
      title: 'Community circles',
      text: 'Share posts, ask for support, add comments, and find others working through similar seasons.'
    },
    {
      icon: BookOpenCheck,
      title: 'Become a companion',
      text: 'Take the assessment, learn active listening skills, and support other members with care.'
    }
  ];

  const steps = ['Tell us what you need', 'Find a companion or circle', 'Chat, reflect, and grow'];

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="ss-container grid min-h-[690px] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="relative z-10">
            <span className="ss-kicker">
              <Sparkles size={15} />
              Peer support, built gently
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.03] text-[#142f2a] sm:text-6xl lg:text-7xl">
              Need someone to talk to?
              <span className="block text-[#1f5f53]">SoulSpeak is listening.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#53645f]">
              A calm place for emotional support, companion chat, community conversation, and guided growth.
              Connect with people who practice empathy before advice.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={user ? '/chat' : '/signup'} className="ss-button-primary">
                {user ? 'Open chat' : 'Get started'}
                <ArrowRight size={18} />
              </Link>
              <Link to={user ? '/forum' : '/login'} className="ss-button-secondary">
                {user ? 'Visit community' : 'I already have an account'}
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ['24/7', 'space to reach out'],
                ['70%+', 'assessment to qualify'],
                ['3', 'support paths']
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur">
                  <div className="text-2xl font-black text-[#1f5f53]">{value}</div>
                  <div className="mt-1 text-sm font-medium text-[#66746f]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="ss-panel overflow-hidden rounded-[2rem]">
              <div className="relative h-[520px] bg-[#203933]">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
                  alt="A peaceful support moment"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10211d] via-[#10211d]/35 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="rounded-3xl bg-white/14 p-5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0b36f] text-[#172f2a]">
                        <HeartHandshake size={24} />
                      </div>
                      <div>
                        <p className="font-bold">Daily grounding note</p>
                        <p className="text-sm text-white/75">A tiny prompt before the next step.</p>
                      </div>
                    </div>
                    <p className="mt-4 text-lg font-semibold leading-7">"{quote}"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-10 hidden rounded-3xl bg-white p-4 shadow-2xl lg:block">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff1eb] text-[#1f5f53]">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <p className="text-sm font-black text-[#17332e]">Private by design</p>
                  <p className="text-xs text-[#6b7773]">JWT protected member areas</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-20 hidden rounded-3xl bg-[#f0b36f] p-4 text-[#172f2a] shadow-2xl lg:block">
              <p className="text-sm font-black">Companions ready</p>
              <p className="text-xs font-semibold opacity-75">Assessment-backed listeners</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ss-container py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {supportCards.map((card) => (
            <article key={card.title} className="ss-card rounded-3xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0efe9] text-[#1f5f53]">
                <card.icon size={24} />
              </div>
              <h2 className="mt-5 text-xl font-black text-[#183530]">{card.title}</h2>
              <p className="mt-3 leading-7 text-[#5f6e69]">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ss-container grid gap-5 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] bg-[#17332e] p-7 text-white shadow-2xl">
          <span className="ss-badge bg-white/10 text-white">
            <LockKeyhole size={14} />
            Safety matters
          </span>
          <h2 className="mt-5 text-3xl font-black">Support, community, and moderation in one flow.</h2>
          <p className="mt-4 leading-7 text-white/74">
            SoulSpeak includes account suspension controls, report tracking, email verification, private chats,
            and an admin workspace to keep the community healthier.
          </p>
        </div>

        <div className="ss-card rounded-[2rem] p-7">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-3xl bg-[#f7f3ec] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f5f53] font-black text-white">
                  {index + 1}
                </div>
                <p className="mt-5 text-lg font-black text-[#17332e]">{step}</p>
                <p className="mt-2 text-sm leading-6 text-[#697671]">
                  {index === 0 && 'Use guided onboarding to name goals, preferences, and support needs.'}
                  {index === 1 && 'Choose companion chat, community posting, or training resources.'}
                  {index === 2 && 'Keep conversations going and report issues when extra care is needed.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Listen for login events so the app can refresh the current user immediately
  useEffect(() => {
    const onLogin = (e) => {
      if (e?.detail) {
        setUser(e.detail);
      } else {
        fetchUser();
      }
    };
    window.addEventListener('user:login', onLogin);
    return () => window.removeEventListener('user:login', onLogin);
  }, []);

  const navItems = useMemo(() => {
    if (!user) {
      return [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Login' },
        { to: '/signup', label: 'Sign Up' }
      ];
    }

    const items = [
      { to: '/home', label: 'Home' },
      { to: '/chat', label: 'Chat' },
      { to: '/forum', label: 'Community' },
      { to: '/report', label: 'Reports' },
      { to: '/profile', label: 'Profile' }
    ];

    if (!user.isCompanion) {
      items.splice(2, 0, { to: '/become-a-companion', label: 'Become A Companion' });
    }

    if (user.email === 'admin@gmail.com') {
      items.push({ to: '/admin', label: 'Admin' });
    }

    return items;
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-bold transition ${
      isActive ? 'bg-[#17332e] text-white shadow-lg' : 'text-[#40534e] hover:bg-white/75 hover:text-[#17332e]'
    }`;

  return (
    <Router>
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 border-b border-white/60 bg-[#f8f5ef]/82 backdrop-blur-xl">
          <div className="ss-container flex h-[76px] items-center justify-between">
            <Link to={user ? '/home' : '/'} className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17332e] text-white shadow-lg">
                <Leaf size={23} />
              </span>
              <span>
                <span className="block text-xl font-black leading-5 text-[#17332e]">SoulSpeak</span>
                <span className="text-xs font-bold text-[#7b8a84]">care through conversation</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              {user ? (
                <>
                  <span className="ss-badge">
                    <Brain size={14} />
                    {user.isCompanion ? 'Companion' : 'Member'}
                  </span>
                  <button onClick={handleLogout} className="ss-button-secondary py-2">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/signup" className="ss-button-primary py-2">
                  Join free
                </Link>
              )}
            </div>

            <button
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d6ded9] bg-white text-[#17332e] lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-[#e5ebe7] bg-[#f8f5ef] px-4 py-4 lg:hidden">
              <div className="mx-auto flex max-w-md flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </NavLink>
                ))}
                {user ? (
                  <button onClick={handleLogout} className="ss-button-secondary mt-2">
                    Logout
                  </button>
                ) : (
                  <Link to="/signup" className="ss-button-primary mt-2" onClick={() => setMenuOpen(false)}>
                    Join free
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/home" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/become-a-companion" element={<CompanionText />} />
          <Route path="/training-program" element={<TrainingProgram />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/report" element={<Report />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
