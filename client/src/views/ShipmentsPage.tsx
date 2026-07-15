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
          title="Total Loads Booked" 
          value={shipments.length.toString()} 
          badgeText="100% Volume"
          badgeClass="bg-slate-50 text-slate-600 border border-slate-200"
        />
        <StatCard 
          title="Loads Pending" 
          value={shipments.filter((s: Shipment) => s.status === 'PENDING').length.toString()} 
          badgeText="Needs attention"
          badgeClass="bg-amber-50 text-amber-700 border border-amber-200/60"
        />
        <StatCard 
          title="Loads In Transit" 
          value={shipments.filter((s: Shipment) => s.status === 'IN_TRANSIT').length.toString()} 
          badgeText="On schedule"
          badgeClass="bg-blue-50 text-blue-700 border border-blue-200/60"
        />
        <StatCard 
          title="Loads Delivered" 
          value={shipments.filter((s: Shipment) => s.status === 'DELIVERED').length.toString()} 
          badgeText="98% Success"
          badgeClass="bg-emerald-50 text-emerald-700 border border-emerald-200/60"
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
  title, 
  value, 
  badgeText, 
  badgeClass 
}: { 
  title: string; 
  value: string; 
  badgeText?: string; 
  badgeClass?: string 
}) {
  return (
    <div className="flex flex-col justify-end rounded-xl bg-white p-5 border border-slate-200/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative h-full min-h-[120px]">
      {badgeText && (
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass}`}>
            <span className="text-[14px] leading-none mb-0.5">•</span> {badgeText}
          </span>
        </div>
      )}
      <div>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-xs font-semibold text-slate-500 mt-1">{title}</p>
      </div>
    </div>
  );
}
