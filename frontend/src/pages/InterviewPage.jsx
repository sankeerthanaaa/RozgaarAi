// src/pages/InterviewPage.jsx
import { useState } from 'react'
import CategoryTabs from '../components/interview/CategoryTabs'
import QuestionCard from '../components/interview/QuestionCard'
import QuestionList from '../components/interview/QuestionList'
import { Skeleton, EmptyState } from '../components/ui'

const MOCK_QUESTIONS = [
  { id: 1, category: 'Behavioural', text: 'Tell me about a challenging bug you fixed and how you approached it.', tip: 'Did you mention: how you found it, tools used (console, debugger), and what you learned?' },
  { id: 2, category: 'Technical',   text: 'Design a REST API for a resume upload service. What endpoints, validation, and error handling would you include?', tip: 'Did you mention: POST /upload, file type + size validation, 400/413/500 error codes?' },
  { id: 3, category: 'Behavioural', text: 'Where do you see yourself in 5 years?', tip: 'Did you tie it to the role and show growth mindset rather than just a job title?' },
  { id: 4, category: 'Gap-based',   text: 'You lack Docker experience. How would you get up to speed quickly if hired?', tip: 'Did you mention: a specific learning plan, timeframe, and a project you\'d build to practice?' },
  { id: 5, category: 'Technical',   text: 'Explain time complexity. Give an example from your own code.', tip: 'Did you give a real example and mention O(n), O(log n), or O(n²) correctly?' },
  { id: 6, category: 'Behavioural', text: 'Describe a time you disagreed with a teammate. How did you resolve it?', tip: 'Did you show empathy, communication, and a positive outcome without blaming anyone?' },
  { id: 7, category: 'Technical',   text: 'How does React\'s virtual DOM work and why does it improve performance?', tip: 'Did you mention diffing, reconciliation, and batching updates?' },
  { id: 8, category: 'Gap-based',   text: 'Your resume shows no CI/CD experience. How would you contribute to our pipeline?', tip: 'Did you show willingness to learn and mention GitHub Actions, Jenkins, or similar?' },
]

export default function InterviewPage() {
  const [role,        setRole]        = useState('')
  const [category,    setCategory]    = useState('All')
  const [current,     setCurrent]     = useState(0)
  const [done,        setDone]        = useState([])
  const [generated,   setGenerated]   = useState(true)  // set false + call API in production
  const [loading,     setLoading]     = useState(false)

  const filtered = category === 'All'
    ? MOCK_QUESTIONS
    : MOCK_QUESTIONS.filter(q => q.category === category)

  function handleNext() {
    setDone(prev => prev.includes(current) ? prev : [...prev, current])
    setCurrent(i => Math.min(i + 1, filtered.length - 1))
  }

  function handlePrev() {
    setCurrent(i => Math.max(i - 1, 0))
  }

  async function handleGenerate() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setGenerated(true)
    setCurrent(0)
    setDone([])
    setLoading(false)
  }

  return (
    <div style={{
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--container-pad)',
    }}>

      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', flexWrap: 'wrap',
        gap: 'var(--space-4)', marginBottom: 'var(--space-6)',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)'
          }}>
            Interview prep
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Practice with a timer. Analyze yourself honestly.
          </p>
        </div>

        {/* Role selector + generate */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <select
            value={role} onChange={e => setRole(e.target.value)}
            style={{
              height: 40, padding: '0 var(--space-4)',
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
              color: 'var(--color-text-primary)',
              background: 'var(--color-bg-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', outline: 'none',
            }}
          >
            <option value="">General questions</option>
            <option value="swe">Software Engineer</option>
            <option value="da">Data Analyst</option>
            <option value="pm">Product Manager</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating…' : 'Generate questions'}
          </button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <CategoryTabs active={category} onChange={cat => { setCategory(cat); setCurrent(0) }} />
      </div>

      {/* Main content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <Skeleton height="480px" radius="var(--radius-lg)" />
          <Skeleton height="480px" radius="var(--radius-lg)" />
        </div>
      ) : !generated ? (
        <EmptyState
          title="No questions yet"
          description="Select a role and click Generate questions to get started"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No questions in this category"
          description="Try selecting a different category tab"
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}>
          {/* LEFT — active question + timer */}
          <QuestionCard
            question={filtered[current]}
            index={current}
            total={filtered.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />

          {/* RIGHT — question list */}
          <div>
            <p style={{
              fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
              color: 'var(--color-text-tertiary)', letterSpacing: '0.06em',
              textTransform: 'uppercase', marginBottom: 'var(--space-3)'
            }}>
              All questions · {done.length}/{filtered.length} done
            </p>
            <QuestionList
              questions={filtered}
              currentIndex={current}
              doneIndexes={done}
              onSelect={setCurrent}
            />
          </div>
        </div>
      )}
    </div>
  )
}