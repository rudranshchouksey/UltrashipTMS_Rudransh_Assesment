import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  DollarSign,
  MoreVertical,
  Pencil,
  Flag,
  Trash2,
} from 'lucide-react';
import type { Shipment, UserRole } from '../types';
import StatusBadge from './StatusBadge';

interface ShipmentTileCardProps {
  shipment: Shipment;
  userRole: UserRole;
  onSelect: (shipment: Shipment) => void;
}

/* ─── Helpers ─── */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function getRouteProgress(status: Shipment['status']): { percent: number; color: string; pulse: boolean } {
  switch (status) {
    case 'PENDING':
      return { percent: 0, color: 'bg-indigo-600', pulse: false };
    case 'IN_TRANSIT':
      return { percent: 50, color: 'bg-indigo-600', pulse: true };
    case 'DELIVERED':
      return { percent: 100, color: 'bg-indigo-600', pulse: false };
    case 'EXCEPTION':
      return { percent: 50, color: 'bg-rose-500', pulse: true };
    default:
      return { percent: 0, color: 'bg-slate-300', pulse: false };
  }
}

/* ─── Menu Item ─── */

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}

function MenuItem({ icon, label, danger, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150
        ${danger
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Context Menu ─── */

interface ContextMenuProps {
  userRole: UserRole;
  onClose: () => void;
}

const menuVariants = {
  hidden: { opacity: 0, scale: 0.92, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.92, y: -4, transition: { duration: 0.1 } },
};

function ContextMenu({ userRole, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl bg-white border border-slate-200 p-1.5 shadow-lg"
    >
      <MenuItem
        icon={<Pencil size={13} />}
        label="Edit"
        onClick={() => { onClose(); }}
      />
      <MenuItem
        icon={<Flag size={13} />}
        label="Flag"
        onClick={() => { onClose(); }}
      />
      {userRole === 'ADMIN' && (
        <>
          <div className="my-1 h-px bg-slate-100" />
          <MenuItem
            icon={<Trash2 size={13} />}
            label="Delete"
            danger
            onClick={() => { onClose(); }}
          />
        </>
      )}
    </motion.div>
  );
}

/* ─── Card Variants ─── */

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/* ─── ShipmentTileCard ─── */

export default function ShipmentTileCard({ shipment, userRole, onSelect }: ShipmentTileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const route = getRouteProgress(shipment.status);

  function handleCardClick() {
    if (!menuOpen) {
      onSelect(shipment);
    }
  }

  function handleMenuToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  }

  return (
    <motion.div
      variants={cardVariants}
      layout
      onClick={handleCardClick}
      className="group relative rounded-2xl bg-white border border-slate-200 cursor-pointer
        transition-all duration-200 ease-out shadow-sm
        hover:scale-[1.02] hover:shadow-lg hover:border-slate-300"
    >
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-accent-500">
            #{shipment.id.split('-')[0].toUpperCase()}
          </span>
          <StatusBadge status={shipment.status} />
        </div>

        {/* Context Menu Trigger */}
        <div className="relative">
          <button
            onClick={handleMenuToggle}
            className="rounded-lg p-1.5 text-slate-400 opacity-0 group-hover:opacity-100
              transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
          >
            <MoreVertical size={16} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <ContextMenu
                userRole={userRole}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Route with Progress Bar ─── */}
      <div className="px-5 pb-4">
        {/* Cities */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <MapPin size={12} className="text-emerald-500 shrink-0" />
            <span className="text-sm font-semibold text-slate-900 truncate">{shipment.origin.city}</span>
          </div>
          <ArrowRight size={14} className="text-slate-400 shrink-0 mx-2" />
          <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
            <span className="text-sm font-semibold text-slate-900 truncate">{shipment.destination.city}</span>
            <MapPin size={12} className="text-rose-500 shrink-0" />
          </div>
        </div>

        {/* State labels */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500">{shipment.origin.state} {shipment.origin.zip}</span>
          <span className="text-[10px] text-slate-500">{shipment.destination.state} {shipment.destination.zip}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${route.percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className={`absolute inset-y-0 left-0 rounded-full ${route.color}
              ${route.pulse ? 'animate-shimmer' : ''}`}
            style={route.pulse ? {
              backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)`,
            } : undefined}
          />
          {/* Progress Dot */}
          {route.percent > 0 && route.percent < 100 && (
            <motion.div
              initial={{ left: 0, opacity: 0 }}
              animate={{ left: `${route.percent}%`, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-white
                ${route.color}
                ${route.pulse ? 'animate-pulse-dot' : ''}`}
            />
          )}
        </div>
      </div>

      {/* ─── Divider ─── */}
      <div className="mx-5 h-px bg-slate-100" />

      {/* ─── Footer: Carrier + Rate ─── */}
      <div className="px-5 py-4 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Carrier</p>
          <p className="text-xs font-medium text-slate-900 truncate">{shipment.carrier.name}</p>
          <p className="text-[10px] text-slate-500 font-mono">{shipment.carrier.scacCode}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Total Rate</p>
          <p className="text-sm font-bold text-slate-900 flex items-center justify-end gap-1">
            <DollarSign size={12} className="text-emerald-500" />
            {formatCurrency(shipment.rates.totalRate)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
