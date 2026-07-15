import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle2 } from 'lucide-react';
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
}

import EmptyState from '../components/EmptyState';

export default function ShipmentsPage({ shipments: fallbackShipments, viewMode, userRole, searchQuery, onClearFilters }: ShipmentsPageProps) {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const { data } = useQuery<any>(GET_SHIPMENTS, {
    variables: { first: 50 },
    fetchPolicy: 'cache-and-network'
  });

  // Extract from GraphQL response, fallback to mock data if not available
  const baseShipments = data?.shipments?.edges?.map((e: any) => e.node) || fallbackShipments;

  // Apply search filter
  const shipments = baseShipments.filter((s: Shipment) => {
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

  return (
    <div className="p-4 sm:p-8 lg:p-10">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shipments</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track all shipment activity across your logistics network.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Total" 
          value={shipments.length.toString()} 
          icon={<Package size={16} />}
          trendText="Across all facilities"
          trendIndicatorClass="bg-slate-300"
        />
        <StatCard 
          label="Pending" 
          value={shipments.filter((s: Shipment) => s.status === 'PENDING').length.toString()} 
          icon={<Clock size={16} />}
          trendText="Needs assignment"
          trendIndicatorClass="bg-amber-400"
        />
        <StatCard 
          label="In Transit" 
          value={shipments.filter((s: Shipment) => s.status === 'IN_TRANSIT').length.toString()} 
          icon={<Truck size={16} />}
          trendText="Currently moving"
          trendIndicatorClass="bg-indigo-500"
        />
        <StatCard 
          label="Delivered" 
          value={shipments.filter((s: Shipment) => s.status === 'DELIVERED').length.toString()} 
          icon={<CheckCircle2 size={16} />}
          trendText="Successfully completed"
          trendIndicatorClass="bg-emerald-500"
        />
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {shipments.length === 0 ? (
          <EmptyState key="empty" onClearFilters={onClearFilters} />
        ) : viewMode === 'grid' ? (
          <DataGrid
            key="grid"
            shipments={shipments}
            onSelectShipment={handleSelectShipment}
          />
        ) : (
          <TileGrid
            key="tile"
            shipments={shipments}
            userRole={userRole}
            onSelectShipment={handleSelectShipment}
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

function StatCard({ 
  label, 
  value, 
  icon, 
  trendText, 
  trendIndicatorClass 
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  trendText?: string; 
  trendIndicatorClass?: string 
}) {
  return (
    <div className="flex flex-col rounded-xl bg-white px-5 py-4 border border-slate-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-slate-400">{icon}</div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      </div>
      <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      {trendText && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${trendIndicatorClass}`} />
          <span className="text-[11px] font-medium text-slate-500">{trendText}</span>
        </div>
      )}
    </div>
  );
}
