import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage        from './pages/HomePage'
import ATSPage         from './pages/ATSPage'
import InterviewPage   from './pages/InterviewPage'
import DashboardPage   from './pages/DashboardPage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import ProtectedRoute  from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/ats"       element={<ATSPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}