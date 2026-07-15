import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Calendar, DollarSign, Hash } from 'lucide-react';
import type { Shipment } from '../types';
import StatusBadge from './StatusBadge';

interface TileGridProps {
  shipments: Shipment[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function TileGrid({ shipments }: TileGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      {shipments.map((shipment) => (
        <motion.div
          key={shipment.id}
          variants={cardVariants}
          layout
          className="group rounded-2xl glass transition-all duration-300 hover:glow-accent hover:border-accent-400/20 cursor-pointer"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-accent-500">
                #{shipment.id.split('-')[0].toUpperCase()}
              </span>
            </div>
            <StatusBadge status={shipment.status} />
          </div>

          {/* Route */}
          <div className="px-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <MapPin size={12} className="text-emerald-400 shrink-0" />
                  <p className="text-sm font-semibold text-white truncate">{shipment.origin.city}</p>
                </div>
                <p className="text-[11px] text-surface-600 ml-[18px]">{shipment.origin.state} {shipment.origin.zip}</p>
              </div>

              <div className="flex flex-col items-center gap-0.5 shrink-0 px-1">
                <ArrowRight size={14} className="text-surface-500" />
                <div className="h-[1px] w-8 bg-gradient-to-r from-emerald-400/30 to-red-400/30" />
              </div>

              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <p className="text-sm font-semibold text-white truncate">{shipment.destination.city}</p>
                  <MapPin size={12} className="text-red-400 shrink-0" />
                </div>
                <p className="text-[11px] text-surface-600 mr-[18px]">{shipment.destination.state} {shipment.destination.zip}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 h-[1px] bg-surface-300/40" />

          {/* Details */}
          <div className="px-5 py-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-surface-600 mb-1">Carrier</p>
              <p className="text-xs font-medium text-surface-900 truncate">{shipment.carrier.name}</p>
              <p className="text-[10px] text-surface-600 font-mono">{shipment.carrier.scacCode}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-surface-600 mb-1">Total Rate</p>
              <p className="text-sm font-bold text-white flex items-center justify-end gap-1">
                <DollarSign size={12} className="text-emerald-400" />
                {formatCurrency(shipment.rates.totalRate)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-surface-600">
              <Calendar size={11} />
              <span className="text-[11px]">{formatDate(shipment.pickupDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-surface-600">
              <Hash size={11} />
              <span className="font-mono text-[11px]">{shipment.trackingNumber}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
