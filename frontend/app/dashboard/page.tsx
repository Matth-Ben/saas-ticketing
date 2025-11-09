'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-700 shadow dark:shadow-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tableau de bord</h1>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <Button variant="secondary" onClick={() => window.location.href = '/settings'}>
                  Paramètres
                </Button>
                <Button variant="secondary" onClick={logout}>
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto p-6">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow dark:shadow-gray-800 p-6 mb-6">
            <h2 className="text-xl text-gray-900 dark:text-gray-100 font-semibold mb-4">
              Bienvenue, {user?.firstName || user?.email} !
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Vous êtes connecté en tant que <strong>{user?.role}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Stats Cards - Placeholder */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow dark:shadow-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Projets</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow dark:shadow-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tickets</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow dark:shadow-gray-800 p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Factures</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg shadow dark:shadow-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Activité récente</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Aucune activité pour le moment
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
