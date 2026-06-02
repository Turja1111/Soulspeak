import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, HeartHandshake, Sparkles } from 'lucide-react';

const steps = [
  {
    field: 'referral',
    title: 'How did you find SoulSpeak?',
    helper: 'This helps us understand where support seekers are meeting us.',
    options: ['Social Media', 'Friend/Family Recommendation', 'Healthcare Provider', 'Online Search', 'Advertisement', 'Other']
  },
  {
    field: 'mentalCondition',
    title: 'What best describes what you are navigating?',
    helper: 'Choose the closest match. You can keep details private.',
    options: ['Anxiety', 'Depression', 'PTSD', 'Bipolar Disorder', 'OCD', 'Prefer not to say', 'Other']
  },
  {
    field: 'ageGroup',
    title: 'What is your age group?',
    helper: 'We use this to shape the community experience responsibly.',
    options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+']
  },
  {
    field: 'gender',
    title: 'What is your gender?',
    helper: 'Share only what feels comfortable.',
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say']
  },
  {
    field: 'country',
    title: 'What country are you from?',
    helper: 'A simple location cue helps future localization and safety planning.',
    type: 'input',
    placeholder: 'Country'
  },
  {
    field: 'goals',
    title: 'What are your goals?',
    helper: 'Pick the reason that feels most true today.',
    options: ['Improve mental health', 'Manage stress', 'Build resilience', 'Enhance relationships', 'Boost productivity', 'Other']
  },
  {
    field: 'preferences',
    title: 'How would you like to receive support?',
    helper: 'This can change later as the product grows.',
    options: ['Text-based communication', 'Video calls', 'In-person sessions', 'No preference']
  },
  {
    field: 'account',
    title: 'Create your account',
    helper: 'A pseudonym is welcome. SoulSpeak is designed for gentle privacy.',
    type: 'account'
  }
];

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    referral: '',
    mentalCondition: '',
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageGroup: '',
    gender: '',
    country: '',
    goals: '',
    preferences: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const step = steps[currentStep];
  const progress = useMemo(() => Math.round(((currentStep + 1) / steps.length) * 100), [currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError(null);
  };

  const validateCurrentStep = () => {
    if (step.type === 'account') {
      const required = ['name', 'username', 'email', 'password', 'confirmPassword'];
      const missing = required.find((field) => !formData[field]);
      if (missing) return 'Please complete your account details.';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
      return null;
    }

    if (!formData[step.field]) return 'Please answer this step to continue.';
    return null;
  };

  const nextStep = () => {
    const validation = validateCurrentStep();
    if (validation) {
      setError(validation);
      return;
    }

    setError(null);
    setCurrentStep((value) => Math.min(value + 1, steps.length - 1));
  };

  const previousStep = () => {
    setError(null);
    setCurrentStep((value) => Math.max(value - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validateCurrentStep();
    if (validation) {
      setError(validation);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      if (response.status === 201) {
        setSuccess('You joined our community. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const renderStep = () => {
    if (step.type === 'input') {
      return (
        <input
          type="text"
          name={step.field}
          placeholder={step.placeholder}
          value={formData[step.field]}
          onChange={handleChange}
          className="ss-input"
        />
      );
    }

    if (step.type === 'account') {
      return (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            { name: 'name', placeholder: 'Full name' },
            { name: 'username', placeholder: 'Pseudonym' },
            { name: 'email', placeholder: 'Email', type: 'email' },
            { name: 'password', placeholder: 'Password', type: 'password' },
            { name: 'confirmPassword', placeholder: 'Confirm password', type: 'password' }
          ].map((field) => (
            <input
              key={field.name}
              type={field.type || 'text'}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              className="ss-input"
              required
            />
          ))}
          <button type="submit" className="ss-button-primary w-full">
            Create account
            <ArrowRight size={18} />
          </button>
        </form>
      );
    }

    return (
      <div className="grid gap-3">
        {step.options.map((option) => {
          const selected = formData[step.field] === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionSelect(step.field, option)}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left font-bold transition ${
                selected
                  ? 'border-[#1f5f53] bg-[#1f5f53] text-white shadow-lg'
                  : 'border-[#d7e2dd] bg-white/82 text-[#40534e] hover:border-[#92b8aa] hover:bg-white'
              }`}
            >
              <span>{option}</span>
              {selected && <Check size={18} />}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <main className="ss-page">
      <div className="ss-container grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-[2rem] bg-[#17332e] p-8 text-white shadow-2xl">
          <span className="ss-badge bg-white/10 text-white">
            <Sparkles size={15} />
            New member intake
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight">Start with the support you actually need.</h1>
          <p className="mt-5 leading-8 text-white/74">
            SoulSpeak uses a guided intake so the experience can feel personal without becoming overwhelming.
          </p>
          <div className="mt-8 rounded-3xl bg-white/10 p-5">
            <HeartHandshake className="text-[#f0b36f]" size={30} />
            <p className="mt-4 text-lg font-bold">Your answers help shape companion matching, community tone, and future wellness paths.</p>
          </div>
          <Link to="/login" className="mt-6 inline-block font-bold text-white/80 hover:text-white">
            Already have an account?
          </Link>
        </aside>

        <section className="ss-panel rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-[#1f5f53]">Step {currentStep + 1} of {steps.length}</p>
                <h2 className="mt-2 text-3xl font-black text-[#17332e]">{step.title}</h2>
              </div>
              <span className="rounded-full bg-[#e0efe9] px-4 py-2 text-sm font-black text-[#1f5f53]">{progress}%</span>
            </div>
            <p className="mt-3 text-[#66746f]">{step.helper}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#dce8e2]">
              <div className="h-full rounded-full bg-[#1f5f53] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div>{renderStep()}</div>

          {error && <div className="mt-5 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          {success && <div className="mt-5 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{success}</div>}

          {step.type !== 'account' && (
            <div className="mt-8 flex gap-3">
              <button onClick={previousStep} disabled={currentStep === 0} className="ss-button-secondary flex-1 disabled:opacity-45">
                <ArrowLeft size={18} />
                Back
              </button>
              <button onClick={nextStep} className="ss-button-primary flex-1">
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Signup;
