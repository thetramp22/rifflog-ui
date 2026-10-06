import { BrowserRouter, Routes, Route } from 'react-router'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import './App.css'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App