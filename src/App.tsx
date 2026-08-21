import { BrowserRouter, Routes, Route } from 'react-router'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Sessions from './pages/Sessions'
import './App.css'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path='/' element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sessions" element={<Sessions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App