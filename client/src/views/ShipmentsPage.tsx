import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useQuery } from '@apollo/client/react';
import { GET_SHIPMENTS } from '../graphql/queries';
import type { Shipment, ViewMode, UserRole } from '../types';
import DataGrid from '../components/DataGrid';
import TileGrid from '../components/TileGrid';
import ShipmentDetailPanel from '../components/ShipmentDetailPanel';

interface ShipmentsPageProps {
  shipments: Shipment[];
  viewMode: ViewMode;
  userRole: UserRole;
  searchQuery: string;
  onClearFilters: () => void;
  onEditShipment: (shipment: Shipment) => void;
}

import EmptyState from '../components/EmptyState';
import QuickActionsToolbar from '../components/QuickActionsToolbar';

export default function ShipmentsPage({ shipments: fallbackShipments, viewMode, userRole, searchQuery, onClearFilters, onEditShipment }: ShipmentsPageProps) {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  
  // 1. Filter State Setup
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Sort State Configuration
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ASC' | 'DESC' | null }>({ key: 'createdAt', direction: 'DESC' });

  // 4. Data Array Manipulation (Server-side filter and sort payload)
  const { data } = useQuery<any>(GET_SHIPMENTS, {
    variables: { 
      first: 50,
      ...(statusFilter ? { filter: { status: statusFilter } } : {}),
      ...(sortConfig.direction ? { orderBy: { field: sortConfig.key, direction: sortConfig.direction } } : {})
    },
    fetchPolicy: 'cache-and-network'
  });

  // Extract from GraphQL response, fallback to mock data if not available
  const fetchedShipments = data?.shipments?.edges?.map((e: any) => e.node) || fallbackShipments;

  // Apply search filter (and local status filter to handle immediate client-side feedback or if fallbackShipments are used)
  const shipments = fetchedShipments.filter((s: Shipment) => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.trackingNumber.toLowerCase().includes(q) ||
      s.shipper.name.toLowerCase().includes(q) ||
      s.carrier.name.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  });

  const handleSelectShipment = useCallback((shipment: Shipment) => {
    setSelectedShipment(shipment);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedShipment(null);
  }, []);

  const handleSortChange = useCallback((key: string) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'ASC') return { key, direction: 'DESC' };
        if (prev.direction === 'DESC') return { key, direction: null };
        return { key, direction: 'ASC' };
      }
      return { key, direction: 'ASC' };
    });
  }, []);

  // For the KPI cards, we preferably want to show the total numbers regardless of the active filter
  // If we only have filtered data from the server, the other cards would show 0.
  // Using fallbackShipments as a base for accurate total counts in this demo environment.
  const statBase = fallbackShipments.length > 0 ? fallbackShipments : fetchedShipments;

  return (
    <div className="p-4 sm:p-8 lg:p-10">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shipments</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track all shipment activity across your logistics network.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActionsToolbar />

      {/* Summary Stats / Interactive Filter Toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Loads Booked" 
          value={statBase.length.toString()} 
          badgeText="100% Volume"
          badgeClass="bg-slate-50 text-slate-600 border border-slate-200"
          isActive={statusFilter === null}
          onClick={() => setStatusFilter(null)}
          activeRingClass="border-slate-400 bg-slate-50/70 ring-4 ring-slate-500/10"
        />
        <StatCard 
          title="Loads Pending" 
          value={statBase.filter((s: Shipment) => s.status === 'PENDING').length.toString()} 
          badgeText="Needs attention"
          badgeClass="bg-amber-50 text-amber-700 border border-amber-200/60"
          isActive={statusFilter === 'PENDING'}
          onClick={() => setStatusFilter('PENDING')}
          activeRingClass="border-amber-400 bg-amber-50/50 ring-4 ring-amber-500/10"
        />
        <StatCard 
          title="Loads In Transit" 
          value={statBase.filter((s: Shipment) => s.status === 'IN_TRANSIT').length.toString()} 
          badgeText="On schedule"
          badgeClass="bg-blue-50 text-blue-700 border border-blue-200/60"
          isActive={statusFilter === 'IN_TRANSIT'}
          onClick={() => setStatusFilter('IN_TRANSIT')}
          activeRingClass="border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10"
        />
        <StatCard 
          title="Loads Delivered" 
          value={statBase.filter((s: Shipment) => s.status === 'DELIVERED').length.toString()} 
          badgeText="98% Success"
          badgeClass="bg-emerald-50 text-emerald-700 border border-emerald-200/60"
          isActive={statusFilter === 'DELIVERED'}
          onClick={() => setStatusFilter('DELIVERED')}
          activeRingClass="border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-500/10"
        />
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {shipments.length === 0 ? (
          <EmptyState key="empty" onClearFilters={() => {
            onClearFilters();
            setStatusFilter(null);
            setSortConfig({ key: 'id', direction: 'ASC' });
          }} />
        ) : viewMode === 'grid' ? (
          <DataGrid
            key="grid"
            shipments={shipments}
            onSelectShipment={handleSelectShipment}
            onEditShipment={onEditShipment}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
        ) : (
          <TileGrid
            key="tile"
            shipments={shipments}
            userRole={userRole}
            onSelectShipment={handleSelectShipment}
            onEditShipment={onEditShipment}
          />
        )}
      </AnimatePresence>

      {/* Detail Panel Overlay */}
      <AnimatePresence>
        {selectedShipment && (
          <ShipmentDetailPanel
            key={selectedShipment.id}
            shipment={selectedShipment}
            userRole={userRole}
            onClose={handleCloseDetail}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 2 & 3. Interactive Card States & Premium Active State Design
function StatCard({ 
  title, 
  value, 
  badgeText, 
  badgeClass,
  isActive,
  onClick,
  activeRingClass
}: { 
  title: string; 
  value: string; 
  badgeText?: string; 
  badgeClass?: string;
  isActive?: boolean;
  onClick?: () => void;
  activeRingClass?: string;
}) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col justify-end rounded-xl p-5 border shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative h-full min-h-[120px] transition-all duration-300 ${onClick ? 'cursor-pointer transform hover:-translate-y-0.5' : ''} ${
        isActive 
          ? activeRingClass || 'border-blue-500 bg-blue-50/30 ring-4 ring-blue-500/10' 
          : 'bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {badgeText && (
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass}`}>
            <span className="text-[14px] leading-none mb-0.5">•</span> {badgeText}
          </span>
        </div>
      )}
      <div>
        <p className={`text-3xl font-bold tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-800'}`}>{value}</p>
        <p className={`text-xs font-semibold mt-1 ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>{title}</p>
      </div>
    </div>
  );
}
