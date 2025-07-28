import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';

export function Header() {
  const { profile, signOut } = useSupabaseAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Sistema de Gestão de Escalas
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="h-8 w-8 rounded-full bg-gray-200 p-1 text-gray-600" />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
              <p className="text-xs text-gray-500">{profile?.role.name}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
