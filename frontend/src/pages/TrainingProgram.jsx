import { ExternalLink, MailQuestion, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrainingProgram = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/questions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <main className="ss-page">
      <div className="ss-container">
        <section className="rounded-[2rem] bg-[#17332e] p-7 text-white shadow-2xl">
          <span className="ss-badge bg-white/10 text-white">
            <Sparkles size={15} />
            Companion growth path
          </span>
          <h1 className="mt-5 text-4xl font-black">SoulSpeak Training Program</h1>
          <p className="mt-3 max-w-3xl leading-8 text-white/74">
            Build the listening, empathy, and communication skills needed to become a steadier companion.
          </p>
        </section>

        <section className="mt-6 grid gap-4">
          {questions.map((question, index) => (
            <article key={question._id || index} className="ss-card rounded-[2rem] p-6 transition hover:-translate-y-0.5 hover:shadow-2xl">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="ss-badge">
                    <MailQuestion size={15} />
                    Topic {index + 1}
                  </span>
                  <h2 className="mt-4 text-2xl font-black text-[#17332e]">{question.question}</h2>
                  <p className="mt-3 leading-7 text-[#66746f]">
                    Review the supporting material, then come back to the companion assessment when you feel ready.
                  </p>
                </div>
                {question.resource && (
                  <a href={question.resource} target="_blank" rel="noreferrer" className="ss-button-secondary shrink-0">
                    Resource
                    <ExternalLink size={17} />
                  </a>
                )}
              </div>
            </article>
          ))}
          {questions.length === 0 && (
            <div className="ss-card rounded-[2rem] p-8 text-center font-semibold text-[#66746f]">
              Training topics will appear here once an admin adds companion questions.
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default TrainingProgram;
