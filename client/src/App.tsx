import { useState, useCallback } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import ShipmentsPage from './views/ShipmentsPage';
import { mockShipments } from './data/mockShipments';
import type { ViewMode, UserRole, Shipment } from './types';
import { ShipmentFormDrawer } from './components/ShipmentFormDrawer';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('userRole') as UserRole) || 'ADMIN';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerShipment, setDrawerShipment] = useState<Shipment | null>(null);

  const toggleRole = useCallback(
    () => setUserRole((prev) => {
      const nextRole = prev === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN';
      localStorage.setItem('userRole', nextRole);
      return nextRole;
    }),
    []
  );

  const handleOpenNew = useCallback(() => {
    setDrawerShipment(null);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((shipment: Shipment) => {
    setDrawerShipment(shipment);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => setDrawerShipment(null), 300);
  }, []);

  return (
    <>
      <DashboardLayout
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        userRole={userRole}
        onRoleToggle={toggleRole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNew={handleOpenNew}
      >
        <ShipmentsPage 
          shipments={mockShipments} 
          viewMode={viewMode} 
          userRole={userRole}
          searchQuery={searchQuery}
          onClearFilters={() => setSearchQuery('')}
          onEditShipment={handleOpenEdit}
        />
      </DashboardLayout>
      <ShipmentFormDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedShipment={drawerShipment || null}
        userRole={userRole}
      />
    </>
  );
}

export default App;
