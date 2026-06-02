import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileWarning, Plus, ShieldAlert, X } from 'lucide-react';

interface ReportModel {
  _id: string;
  timestamp: string;
  type: string;
  details: string;
  status: string;
}

const Report = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [reports, setReports] = useState<ReportModel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'review',
    details: '',
    profileId: '',
    chatId: ''
  });

  const fetchUserEmail = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserEmail(response.data.user.email);
    } catch (error) {
      console.error('Failed to fetch user email');
    }
  };

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports');
    }
  };

  useEffect(() => {
    fetchReports();
    fetchUserEmail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    let enhancedDetails = formData.details;

    if (formData.type === 'profile-report' && formData.profileId) {
      enhancedDetails = `Profile: ${formData.profileId}\n${formData.details}`;
    } else if (formData.type === 'chat-report' && formData.chatId) {
      enhancedDetails = `Chat ID: ${formData.chatId}\n${formData.details}`;
    }

    try {
      await axios.post(
        'http://localhost:5000/reports',
        { type: formData.type, details: enhancedDetails, userEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setFormData({ type: 'review', details: '', profileId: '', chatId: '' });
      fetchReports();
    } catch (error) {
      console.error('Failed to submit report');
    }
  };

  const statusClass = (status: string) => {
    if (status === 'resolved') return 'bg-emerald-100 text-emerald-800';
    if (status === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-amber-100 text-amber-800';
  };

  return (
    <main className="ss-page">
      <div className="ss-container">
        <section className="mb-6 rounded-[2rem] bg-[#17332e] p-7 text-white shadow-2xl">
          <span className="ss-badge bg-white/10 text-white">
            <ShieldAlert size={15} />
            Community safety
          </span>
          <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black">Reports</h1>
              <p className="mt-3 max-w-2xl leading-7 text-white/74">
                Submit reviews, profile concerns, or chat reports and track moderation status from one calm workspace.
              </p>
            </div>
            <button onClick={() => setShowModal(true)} className="ss-button-primary bg-[#f0b36f] text-[#17332e] hover:bg-[#e79f56]">
              <Plus size={18} />
              New report
            </button>
          </div>
        </section>

        <section className="ss-card overflow-hidden rounded-[2rem]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-[#e7f4f0] text-left text-sm text-[#17332e]">
                <tr>
                  <th className="px-6 py-4 font-black">Time</th>
                  <th className="px-6 py-4 font-black">Type</th>
                  <th className="px-6 py-4 font-black">Details</th>
                  <th className="px-6 py-4 font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2ebe7]">
                {reports.map((report) => (
                  <tr key={report._id} className="transition hover:bg-[#f7f3ec]">
                    <td className="px-6 py-4 text-sm font-semibold text-[#53645f]">{new Date(report.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1f5f53]">{report.type}</td>
                    <td className="px-6 py-4 text-sm leading-6 text-[#40534e]">{report.details}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusClass(report.status)}`}>{report.status}</span>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#66746f]">
                      <FileWarning className="mx-auto mb-3 text-[#1f5f53]" />
                      No reports yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10211d]/55 p-4 backdrop-blur-sm">
          <div className="ss-panel w-full max-w-lg rounded-[2rem] p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#17332e]">Create report</h2>
              <button onClick={() => setShowModal(false)} className="rounded-full p-2 text-[#66746f] hover:bg-[#eef5f1]">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="ss-input">
                <option value="review">Review</option>
                <option value="profile-report">Profile Report</option>
                <option value="chat-report">Chat Report</option>
              </select>
              {formData.type === 'profile-report' && (
                <input value={formData.profileId} onChange={(e) => setFormData({ ...formData, profileId: e.target.value })} className="ss-input" placeholder="Pseudoname of the user" required />
              )}
              {formData.type === 'chat-report' && (
                <input value={formData.chatId} onChange={(e) => setFormData({ ...formData, chatId: e.target.value })} className="ss-input" placeholder="Chat ID" required />
              )}
              <textarea value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} rows={5} className="ss-input" placeholder="What happened?" required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="ss-button-secondary">
                  Cancel
                </button>
                <button type="submit" className="ss-button-primary">
                  Submit report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Report;
