import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterSchoolPage from './pages/RegisterSchoolPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import AreasPage from './pages/AreasPage';
import ReportsPage from './pages/ReportsPage';
import ReadingsPage from './pages/ReadingsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/register-school"
          element={<RegisterSchoolPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/analysis"
            element={<AnalysisPage />}
          />

          <Route
            path="/areas"
            element={<AreasPage />}
          />

          <Route
            path="/readings"
            element={<ReadingsPage />}
          />

          <Route
            path="/reports"
            element={<ReportsPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;