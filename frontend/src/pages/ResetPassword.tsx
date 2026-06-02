import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/confirm-reset-password', { password, token });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <main className="ss-page flex items-center">
      <div className="ss-container max-w-3xl">
        <section className="ss-panel rounded-[2rem] p-7 sm:p-10">
          <span className="ss-badge">
            <ShieldCheck size={15} />
            Secure reset
          </span>
          <h1 className="mt-5 text-4xl font-black text-[#17332e]">Create a new password</h1>
          <p className="mt-3 max-w-xl leading-7 text-[#66746f]">
            Choose a password you have not used elsewhere. You will be sent back to login after it is updated.
          </p>

          {message && <div className="mt-6 rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">{message}</div>}
          {error && <div className="mt-6 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#40534e]">
                <KeyRound size={16} />
                New password
              </span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="ss-input" required minLength={4} />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#40534e]">
                <KeyRound size={16} />
                Confirm password
              </span>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="ss-input" required minLength={4} />
            </label>
            <button type="submit" className="ss-button-primary w-full sm:w-auto">
              Reset password
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ResetPassword;
