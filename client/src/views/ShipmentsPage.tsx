import { AnimatePresence } from 'framer-motion';
import type { Shipment, ViewMode } from '../types';
import DataGrid from '../components/DataGrid';
import TileGrid from '../components/TileGrid';

interface ShipmentsPageProps {
  shipments: Shipment[];
  viewMode: ViewMode;
}

export default function ShipmentsPage({ shipments, viewMode }: ShipmentsPageProps) {
  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Shipments</h2>
        <p className="mt-1 text-sm text-surface-600">
          Manage and track all shipment activity across your logistics network.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={shipments.length.toString()} accent="text-white" />
        <StatCard label="Pending" value={shipments.filter(s => s.status === 'PENDING').length.toString()} accent="text-amber-400" />
        <StatCard label="In Transit" value={shipments.filter(s => s.status === 'IN_TRANSIT').length.toString()} accent="text-blue-400" />
        <StatCard label="Delivered" value={shipments.filter(s => s.status === 'DELIVERED').length.toString()} accent="text-emerald-400" />
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <DataGrid key="grid" shipments={shipments} />
        ) : (
          <TileGrid key="tile" shipments={shipments} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl glass px-4 py-3.5">
      <p className="text-[10px] uppercase tracking-wider text-surface-600 font-semibold">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
