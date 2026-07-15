import { motion } from 'framer-motion';
import { MoreHorizontal, MapPin, ExternalLink, Copy } from 'lucide-react';
import type { Shipment } from '../types';
import StatusBadge from './StatusBadge';

interface DataGridProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
}

const columns = [
  { key: 'id', label: 'Shipment ID', width: 'w-[140px]' },
  { key: 'status', label: 'Status', width: 'w-[120px]' },
  { key: 'shipper', label: 'Shipper', width: 'w-[160px]' },
  { key: 'carrier', label: 'Carrier', width: 'w-[150px]' },
  { key: 'origin', label: 'Origin', width: 'w-[170px]' },
  { key: 'destination', label: 'Destination', width: 'w-[170px]' },
  { key: 'rate', label: 'Total Rate', width: 'w-[110px]' },
  { key: 'pickupDate', label: 'Pickup Date', width: 'w-[120px]' },
  { key: 'tracking', label: 'Tracking #', width: 'w-[130px]' },
  { key: 'actions', label: '', width: 'w-[60px]' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncateId(id: string): string {
  return id.split('-')[0].toUpperCase();
}

export default function DataGrid({ shipments, onSelectShipment }: DataGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          {/* Sticky Header */}
          <thead>
            <tr className="border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`sticky top-0 z-10 bg-slate-50 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 ${col.width}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100">
            {shipments.map((shipment, index) => (
              <motion.tr
                key={shipment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.015, duration: 0.25 }}
                onClick={() => onSelectShipment(shipment)}
                className="group cursor-pointer transition-colors duration-150 hover:bg-slate-50/80 bg-white"
              >
                {/* ID */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-medium text-indigo-600">
                      #{truncateId(shipment.id)}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-900">
                      <Copy size={11} />
                    </button>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={shipment.status} size="sm" />
                </td>

                {/* Shipper */}
                <td className="px-4 py-3.5">
                  <p className="text-xs font-medium text-slate-900 truncate max-w-[140px]">{shipment.shipper.name}</p>
                </td>

                {/* Carrier */}
                <td className="px-4 py-3.5">
                  <div>
                    <p className="text-xs font-medium text-slate-900 truncate max-w-[130px]">{shipment.carrier.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{shipment.carrier.scacCode}</p>
                  </div>
                </td>

                {/* Origin */}
                <td className="px-4 py-3.5">
                  <div className="flex items-start gap-1.5">
                    <MapPin size={12} className="mt-0.5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">{shipment.origin.city}, {shipment.origin.state}</p>
                      <p className="text-[10px] text-slate-500">{shipment.origin.zip}</p>
                    </div>
                  </div>
                </td>

                {/* Destination */}
                <td className="px-4 py-3.5">
                  <div className="flex items-start gap-1.5">
                    <MapPin size={12} className="mt-0.5 text-red-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-900">{shipment.destination.city}, {shipment.destination.state}</p>
                      <p className="text-[10px] text-slate-500">{shipment.destination.zip}</p>
                    </div>
                  </div>
                </td>

                {/* Rate */}
                <td className="px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-900">{formatCurrency(shipment.rates.totalRate)}</span>
                </td>

                {/* Pickup Date */}
                <td className="px-4 py-3.5">
                  <span className="text-xs text-slate-600">{formatDate(shipment.pickupDate)}</span>
                </td>

                {/* Tracking */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[11px] text-slate-500">{shipment.trackingNumber}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600">
                      <ExternalLink size={11} />
                    </button>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <button className="rounded-lg p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100 hover:text-slate-900">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 bg-white">
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{shipments.length}</span> shipments
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, '...', 5].map((p, i) => (
            <button
              key={i}
              className={`h-8 min-w-[32px] rounded-lg px-2.5 text-xs font-medium transition-colors
                ${p === 1
                  ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
