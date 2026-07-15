import { useState, useCallback } from 'react';
import Sidebar from './layouts/Sidebar';
import TopNav from './layouts/TopNav';
import ShipmentsPage from './views/ShipmentsPage';
import { mockShipments } from './data/mockShipments';
import type { ViewMode, UserRole } from './types';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleRole = useCallback(
    () => setUserRole((prev) => (prev === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN')),
    []
  );

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav
          onToggleSidebar={toggleSidebar}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          userRole={userRole}
          onRoleToggle={toggleRole}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <ShipmentsPage shipments={mockShipments} viewMode={viewMode} userRole={userRole} />
        </main>
      </div>
    </div>
  );
}

export default App;
