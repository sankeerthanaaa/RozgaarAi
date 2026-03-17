// src/pages/ATSPage.jsx
import { useState } from 'react'
import SourceToggle   from '../components/ats/SourceToggle'
import FileDropzone   from '../components/ats/FileDropzone'
import LinkedInImport from '../components/ats/LinkedInImport'
import JobRoleSelector from '../components/ats/JobRoleSelector'
import ScorePanel     from '../components/ats/ScorePanel'
import SuggestionsPanel from '../components/ats/SuggestionsPanel'  
import { Skeleton }   from '../components/ui'

// mock result — replace with real API call on Day 4
const MOCK_RESULT = {
  atsScore: 78,
  jobRole: 'Software Engineer',
  breakdown: [
    { label: 'Keyword match',        value: 82 },
    { label: 'Section completeness', value: 90 },
    { label: 'Formatting score',     value: 65 },
  ],
  keywords: {
    present: ['React', 'Node.js', 'TypeScript', 'REST API'],
    missing: ['Docker', 'Kubernetes', 'CI/CD'],
  },
  suggestions: [
    {
      id: 1, section: 'Experience', type: 'Improve', priority: 'High',
      before: 'Worked on various backend features',
      after:  'Engineered 4 REST API features using Node.js, reducing response time by 35%',
    },
    {
      id: 2, section: 'Skills', type: 'Add', priority: 'Medium',
      before: null,
      after:  'Add Docker, Kubernetes, CI/CD to your skills section',
    },
    {
      id: 3, section: 'Summary', type: 'Improve', priority: 'Low',
      before: 'Experienced developer looking for opportunities',
      after:  'Full-stack engineer with 3 years building scalable web apps using React and Node.js',
    },
  ],
}

export default function ATSPage() {
  const [source,    setSource]    = useState('upload')
  const [file,      setFile]      = useState(null)
  const [role,      setRole]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState(null)

  async function handleAnalyze() {
    if (!file && source === 'upload') return
    setLoading(true)
    // simulate API delay — swap with resumeService.analyze() on Day 4
    await new Promise(r => setTimeout(r, 1500))
    setResult(MOCK_RESULT)
    setLoading(false)
  }

  return (
    <div style={{
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--container-pad)',
    }}>

      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)'
        }}>
          Check your ATS score
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Upload your resume or import from LinkedIn to get started
        </p>
      </div>

      {/* Toggle */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <SourceToggle active={source} onChange={setSource} />
      </div>

      {/* Upload area */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        {source === 'upload'
          ? <FileDropzone onFileSelect={setFile} />
          : <LinkedInImport onImport={url => console.log('import:', url)} />
        }
      </div>

      {/* Role + Analyze button row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        <JobRoleSelector value={role} onChange={setRole} />
        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={loading || (!file && source === 'upload')}
        >
          {loading ? 'Analyzing…' : 'Analyze resume'}
        </button>
      </div>

      {/* Results — two column */}
      {(loading || result) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}>
          {/* LEFT — FE Dev 1 */}
          <div>
            {loading
              ? <LoadingSkeleton />
              : <ScorePanel result={result} />
            }
          </div>

          {/* RIGHT — FE Dev 2 */}
          <div>
            {loading
              ? <LoadingSkeleton />
              : <SuggestionsPanel suggestions={result.suggestions} />
            }
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Skeleton height="200px" radius="var(--radius-lg)" />
      <Skeleton height="140px" radius="var(--radius-lg)" />
      <Skeleton height="100px" radius="var(--radius-lg)" />
    </div>
  )
}