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
      return { percent: 0, color: 'from-amber-400 to-amber-500', pulse: false };
    case 'IN_TRANSIT':
      return { percent: 50, color: 'from-blue-400 to-indigo-500', pulse: true };
    case 'DELIVERED':
      return { percent: 100, color: 'from-emerald-400 to-green-500', pulse: false };
    case 'EXCEPTION':
      return { percent: 50, color: 'from-red-400 to-red-500', pulse: true };
    default:
      return { percent: 0, color: 'from-surface-400 to-surface-500', pulse: false };
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
          ? 'text-red-400 hover:bg-red-400/10'
          : 'text-surface-800 hover:bg-surface-200/60 hover:text-white'
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
      className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl glass-strong p-1.5 shadow-2xl shadow-black/40 ring-1 ring-surface-300/40"
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
          <div className="my-1 h-px bg-surface-300/30" />
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
      className="group relative rounded-2xl glass cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.2),0_0_80px_rgba(99,102,241,0.08)]
        hover:border-accent-400/25"
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
            className="rounded-lg p-1.5 text-surface-600 opacity-0 group-hover:opacity-100
              transition-all duration-200 hover:bg-surface-200 hover:text-white"
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
            <MapPin size={12} className="text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold text-white truncate">{shipment.origin.city}</span>
          </div>
          <ArrowRight size={14} className="text-surface-500 shrink-0 mx-2" />
          <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
            <span className="text-sm font-semibold text-white truncate">{shipment.destination.city}</span>
            <MapPin size={12} className="text-red-400 shrink-0" />
          </div>
        </div>

        {/* State labels */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-surface-600">{shipment.origin.state} {shipment.origin.zip}</span>
          <span className="text-[10px] text-surface-600">{shipment.destination.state} {shipment.destination.zip}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 rounded-full bg-surface-300/40 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${route.percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${route.color}
              ${route.pulse ? 'animate-shimmer' : ''}`}
            style={route.pulse ? {
              backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent), linear-gradient(to right, var(--tw-gradient-stops))`,
            } : undefined}
          />
          {/* Progress Dot */}
          {route.percent > 0 && route.percent < 100 && (
            <motion.div
              initial={{ left: 0, opacity: 0 }}
              animate={{ left: `${route.percent}%`, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-surface-50
                bg-gradient-to-r ${route.color}
                ${route.pulse ? 'animate-pulse-dot' : ''}`}
            />
          )}
        </div>
      </div>

      {/* ─── Divider ─── */}
      <div className="mx-5 h-px bg-surface-300/30" />

      {/* ─── Footer: Carrier + Rate ─── */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-surface-600 mb-0.5">Carrier</p>
          <p className="text-xs font-medium text-surface-900 truncate">{shipment.carrier.name}</p>
          <p className="text-[10px] text-surface-600 font-mono">{shipment.carrier.scacCode}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-wider text-surface-600 mb-0.5">Total Rate</p>
          <p className="text-sm font-bold text-white flex items-center justify-end gap-1">
            <DollarSign size={12} className="text-emerald-400" />
            {formatCurrency(shipment.rates.totalRate)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
