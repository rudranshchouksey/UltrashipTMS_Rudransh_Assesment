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
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shipments</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track all shipment activity across your logistics network.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={shipments.length.toString()} accent="text-slate-900" />
        <StatCard label="Pending" value={shipments.filter(s => s.status === 'PENDING').length.toString()} accent="text-amber-500" />
        <StatCard label="In Transit" value={shipments.filter(s => s.status === 'IN_TRANSIT').length.toString()} accent="text-blue-600" />
        <StatCard label="Delivered" value={shipments.filter(s => s.status === 'DELIVERED').length.toString()} accent="text-emerald-600" />
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

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3.5 border border-slate-200/60 shadow-sm">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
