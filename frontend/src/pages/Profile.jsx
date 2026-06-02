import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BadgeCheck, Camera, CheckCircle2, Edit3, MailCheck, Save, UserRound } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    newPassword: '',
    referral: '',
    mentalCondition: '',
    ageGroup: '',
    country: '',
    goals: '',
    preferences: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view this page.');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data.user;
        setProfile(user);
        setFormData({
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          referral: user.referral || '',
          mentalCondition: user.mentalCondition || '',
          ageGroup: user.ageGroup || '',
          country: user.country || '',
          goals: user.goals || '',
          preferences: user.preferences || '',
          password: '',
          newPassword: ''
        });

        const pictureResponse = await axios.get('http://localhost:5000/profile-picture', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfilePicture(pictureResponse.data.imageUrl ? `http://localhost:5000${pictureResponse.data.imageUrl}` : null);
        setError(null);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture || typeof profilePicture === 'string') return null;
    const data = new FormData();
    data.append('image', profilePicture);
    const response = await axios.post('http://localhost:5000/upload-profile-picture', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.imageUrl;
  };

  const handleVerifyEmail = async () => {
    try {
      await axios.post('http://localhost:5000/verify-email', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uploadedImage = await handleProfilePictureUpload();
      setProfile(response.data.user);
      if (uploadedImage) setProfilePicture(`http://localhost:5000${uploadedImage}`);
      setImagePreview(null);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="ss-page flex items-center justify-center">
        <div className="ss-panel rounded-3xl p-8 font-bold text-[#1f5f53]">Loading your space...</div>
      </main>
    );
  }

  return (
    <main className="ss-page">
      <div className="ss-container grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="ss-panel rounded-[2rem] p-7">
          {error && <div className="mb-5 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

          <div className="text-center">
            <div className="relative mx-auto h-36 w-36">
              <img
                src={imagePreview || profilePicture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'}
                alt="Profile"
                className="h-36 w-36 rounded-[2rem] border-4 border-white object-cover shadow-xl"
              />
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f5f53] text-white shadow-lg">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <Camera size={20} />
                </label>
              )}
            </div>

            <h1 className="mt-6 text-3xl font-black text-[#17332e]">{profile?.name || 'SoulSpeak member'}</h1>
            <p className="mt-1 font-bold text-[#66746f]">@{profile?.username}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <span className="ss-badge">
                <UserRound size={14} />
                {profile?.isCompanion ? 'Companion' : 'Member'}
              </span>
              <span className={`ss-badge ${profile?.verified ? '' : 'bg-amber-100 text-amber-800'}`}>
                <BadgeCheck size={14} />
                {profile?.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>

            {!profile?.verified && (
              <button onClick={handleVerifyEmail} className="ss-button-secondary mt-6 w-full">
                <MailCheck size={18} />
                Verify email
              </button>
            )}

            <button onClick={() => setIsEditing((value) => !value)} className="ss-button-primary mt-3 w-full">
              <Edit3 size={18} />
              {isEditing ? 'Close editor' : 'Edit profile'}
            </button>
          </div>
        </aside>

        <section className="ss-card rounded-[2rem] p-6 sm:p-8">
          {!isEditing ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase text-[#1f5f53]">Member profile</p>
                  <h2 className="mt-2 text-3xl font-black text-[#17332e]">Your support preferences</h2>
                </div>
                <CheckCircle2 className="text-[#1f5f53]" size={30} />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  ['Email', profile?.email],
                  ['Country', profile?.country],
                  ['Age group', profile?.ageGroup],
                  ['Condition', profile?.mentalCondition],
                  ['Found us through', profile?.referral],
                  ['Communication', profile?.preferences]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl bg-[#f7f3ec] p-5">
                    <p className="text-xs font-black uppercase text-[#788780]">{label}</p>
                    <p className="mt-2 font-bold text-[#243533]">{value || 'Not provided'}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-3xl bg-[#e7f4f0] p-5">
                <p className="text-xs font-black uppercase text-[#1f5f53]">Goals</p>
                <p className="mt-2 leading-7 text-[#40534e]">{profile?.goals || 'No goals added yet.'}</p>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-black uppercase text-[#1f5f53]">Edit profile</p>
                <h2 className="mt-2 text-3xl font-black text-[#17332e]">Keep your details fresh</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['name', 'Name'],
                  ['username', 'Username'],
                  ['email', 'Email'],
                  ['country', 'Country'],
                  ['referral', 'How did you find us?'],
                  ['mentalCondition', 'Condition'],
                  ['ageGroup', 'Age group'],
                  ['preferences', 'Preferences'],
                  ['password', 'Current password', 'password'],
                  ['newPassword', 'New password', 'password']
                ].map(([name, placeholder, type]) => (
                  <input
                    key={name}
                    type={type || 'text'}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="ss-input"
                  />
                ))}
              </div>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="What are your goals?"
                className="ss-input min-h-32"
              />
              <button type="submit" className="ss-button-primary w-full sm:w-auto">
                <Save size={18} />
                Save changes
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
