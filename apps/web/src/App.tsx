import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "./auth/AuthContext"
import { WelcomePage } from "./pages/WelcomePage"
import { DashboardPage } from "./pages/DashboardPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { LoginPage } from "./pages/LoginPage"

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 text-cloud-400">
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}