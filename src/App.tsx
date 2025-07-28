import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SupabaseAuthProvider, useSupabaseAuth } from './contexts/SupabaseAuthContext';
import { Layout } from './components/Layout/Layout';
import { LoginForm } from './components/Auth/LoginForm';
import { Calendar } from './pages/Calendar';
import { Users } from './pages/Users';
import { Departments } from './pages/Departments';

function AppContent() {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/users" element={<Users />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/schedules" element={<div className="p-8 text-center">Escalas - Em desenvolvimento</div>} />
          <Route path="/shifts" element={<div className="p-8 text-center">Plantões - Em desenvolvimento</div>} />
          <Route path="/mentorships" element={<div className="p-8 text-center">Mentorias - Em desenvolvimento</div>} />
          <Route path="/exchanges" element={<div className="p-8 text-center">Trocas - Em desenvolvimento</div>} />
          <Route path="/absences" element={<div className="p-8 text-center">Ausências - Em desenvolvimento</div>} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/locations" element={<div className="p-8 text-center">Localizações - Em desenvolvimento</div>} />
          <Route path="/reports" element={<div className="p-8 text-center">Relatórios - Em desenvolvimento</div>} />
          <Route path="/settings" element={<div className="p-8 text-center">Configurações - Em desenvolvimento</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <SupabaseAuthProvider>
      <AppContent />
    </SupabaseAuthProvider>
  );
}

export default App;
