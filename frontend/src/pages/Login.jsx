import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, KeyRound, Mail, MessageCircleHeart, ShieldCheck, X } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password.');
    }
  };

  const handleResetSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/reset-password', { email: resetEmail });
      if (response.status === 200) {
        alert('Password reset email sent. Please check your inbox!');
        setShowEmailPopup(false);
        setResetEmail('');
      }
    } catch (error) {
      alert('Error sending reset email. Please try again.');
    }
  };

  return (
    <main className="ss-page flex items-center">
      <div className="ss-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-[#17332e] p-8 text-white shadow-2xl lg:p-10">
          <span className="ss-badge bg-white/10 text-white">
            <MessageCircleHeart size={15} />
            Welcome back
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight lg:text-5xl">
            Pick up the conversation where you left it.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/74">
            Sign in to reach companion chat, community circles, reports, training resources, and your profile.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ['Private member areas', ShieldCheck],
              ['Listener-first support', MessageCircleHeart]
            ].map(([label, Icon]) => (
              <div key={label} className="rounded-3xl bg-white/10 p-4">
                <Icon size={22} className="text-[#f0b36f]" />
                <p className="mt-3 font-bold">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ss-panel rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <h2 className="text-3xl font-black text-[#17332e]">Sign in</h2>
            <p className="mt-2 text-[#66746f]">Use the email and password connected to your SoulSpeak account.</p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#40534e]">
                  <Mail size={16} />
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="ss-input"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#40534e]">
                  <KeyRound size={16} />
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="ss-input"
                  placeholder="Your password"
                  required
                />
              </label>

              {error && <div className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

              <button type="submit" className="ss-button-primary w-full">
                Sign in
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-center text-sm sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => setShowEmailPopup(true)} className="font-bold text-[#1f5f53]">
                Forgot password?
              </button>
              <Link to="/signup" className="font-bold text-[#52645e]">
                New here? Create account
              </Link>
            </div>
          </div>
        </section>
      </div>

      {showEmailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10211d]/55 p-4 backdrop-blur-sm">
          <div className="ss-panel w-full max-w-md rounded-[2rem] p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-[#17332e]">Reset password</h3>
              <button onClick={() => setShowEmailPopup(false)} className="rounded-full p-2 text-[#66746f] hover:bg-[#eef5f1]">
                <X size={20} />
              </button>
            </div>
            <p className="mt-3 leading-7 text-[#66746f]">Enter your email address and SoulSpeak will send a reset link.</p>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="you@example.com"
              className="ss-input mt-5"
            />
            <div className="mt-6 flex gap-3">
              <button onClick={handleResetSubmit} className="ss-button-primary flex-1">
                Send link
              </button>
              <button onClick={() => setShowEmailPopup(false)} className="ss-button-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Login;
