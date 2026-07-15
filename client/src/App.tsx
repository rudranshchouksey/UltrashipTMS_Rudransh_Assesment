import { useState, useCallback } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import ShipmentsPage from './views/ShipmentsPage';
import { mockShipments } from './data/mockShipments';
import type { ViewMode, UserRole } from './types';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('userRole') as UserRole) || 'ADMIN';
  });
  const toggleRole = useCallback(
    () => setUserRole((prev) => {
      const nextRole = prev === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN';
      localStorage.setItem('userRole', nextRole);
      return nextRole;
    }),
    []
  );

  return (
    <DashboardLayout
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      userRole={userRole}
      onRoleToggle={toggleRole}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <ShipmentsPage 
        shipments={mockShipments} 
        viewMode={viewMode} 
        userRole={userRole}
        searchQuery={searchQuery}
        onClearFilters={() => setSearchQuery('')}
      />
    </DashboardLayout>
  );
}

export default App;
