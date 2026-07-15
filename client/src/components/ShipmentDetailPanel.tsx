import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useMutation } from '@apollo/client';
import { UPDATE_SHIPMENT_STATUS } from '../graphql/mutations';
import {
  ArrowLeft,
  MapPin,
  Truck,
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Fuel,
  Receipt,
  User,
  Mail,
  Phone,
  Building2,
  Hash,
  CalendarDays,
} from 'lucide-react';
import type { Shipment, UserRole } from '../types';
import StatusBadge from './StatusBadge';

interface ShipmentDetailPanelProps {
  shipment: Shipment;
  userRole: UserRole;
  onClose: () => void;
}

/* ─── Helpers ─── */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ─── Timeline Step ─── */

interface TimelineStepProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  detail?: string;
  color: string;
  lineColor?: string;
  active?: boolean;
  completed?: boolean;
  isLast?: boolean;
}

function TimelineStep({ icon, label, sublabel, detail, color, lineColor, active, completed, isLast }: TimelineStepProps) {
  return (
    <div className="flex gap-4">
      {/* Icon + Line Column */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-inset transition-all
            ${completed
              ? `bg-${color}-400/15 ring-${color}-400/30 text-${color}-400`
              : active
                ? `bg-${color}-400/15 ring-${color}-400/30 text-${color}-400 animate-pulse-dot`
                : 'bg-surface-300/20 ring-surface-400/20 text-surface-600'
            }`}
        >
          {icon}
        </div>
        {!isLast && (
          <div className={`w-px flex-1 min-h-[32px] mt-1 ${lineColor || 'bg-surface-300/30'}`} />
        )}
      </div>

      {/* Content */}
      <div className="pb-6 pt-1.5 flex-1">
        <p className={`text-sm font-semibold ${completed || active ? 'text-white' : 'text-surface-600'}`}>
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-surface-700 mt-0.5">{sublabel}</p>
        )}
        {detail && (
          <p className="text-[11px] text-surface-600 mt-1">{detail}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Info Chip ─── */

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-surface-200/30 px-4 py-3 ring-1 ring-surface-300/20">
      <div className="mt-0.5 text-surface-600">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-surface-600 mb-0.5">{label}</p>
        <p className="text-xs font-medium text-surface-900 break-all">{value}</p>
      </div>
    </div>
  );
}

/* ─── Section Header ─── */

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="text-accent-500">{icon}</div>
      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-surface-300/40 to-transparent" />
    </div>
  );
}

/* ─── Animation Variants ─── */

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25, delay: 0.1 } },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.97,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const staggerChildren: Variants = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

/* ─── Main Component ─── */

export default function ShipmentDetailPanel({ shipment, userRole, onClose }: ShipmentDetailPanelProps) {
  const [updateStatus, { loading: updating }] = useMutation(UPDATE_SHIPMENT_STATUS);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleUpdateStatus = async () => {
    const nextStatus = shipment.status === 'PENDING' ? 'IN_TRANSIT' : 'DELIVERED';
    try {
      await updateStatus({
        variables: { id: shipment.id, input: { status: nextStatus } },
        refetchQueries: ['GetShipments']
      });
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const statusIndex =
    shipment.status === 'PENDING' ? 0
    : shipment.status === 'IN_TRANSIT' ? 1
    : shipment.status === 'DELIVERED' ? 2
    : 1; // EXCEPTION treated as mid-transit

  const isException = shipment.status === 'EXCEPTION';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-50 glass-overlay"
      />

      {/* Panel */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-4 sm:inset-6 lg:inset-x-auto lg:inset-y-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-3xl z-50
          rounded-3xl glass-strong overflow-hidden flex flex-col
          shadow-2xl shadow-black/50 ring-1 ring-accent-400/10"
      >
        {/* ─── Header ─── */}
        <div className="shrink-0 border-b border-surface-300/30 px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-surface-700
                transition-all duration-200 hover:bg-surface-200/50 hover:text-white group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
              Back to List
            </button>
            <div className="flex items-center gap-3">
              <StatusBadge status={shipment.status} />
              {userRole === 'ADMIN' && (
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || shipment.status === 'DELIVERED'}
                  className="flex items-center gap-2 rounded-xl bg-accent-500/10 px-3 py-2 text-xs font-semibold text-accent-400 ring-1 ring-accent-500/20 transition-all hover:bg-accent-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold gradient-text">
                #{shipment.id.split('-')[0].toUpperCase()}
              </h2>
              <span className="text-xs font-mono text-surface-600 bg-surface-200/40 px-2 py-0.5 rounded-md">
                {shipment.trackingNumber}
              </span>
            </div>
            <p className="mt-1 text-sm text-surface-700">
              {shipment.carrier.name}
              <span className="text-surface-600 ml-1.5 font-mono text-xs">({shipment.carrier.scacCode})</span>
            </p>
          </div>
        </div>

        {/* ─── Scrollable Content ─── */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-8"
        >
          {/* ─── Route Information ─── */}
          <motion.section variants={fadeUp}>
            <SectionHeader title="Route Information" icon={<MapPin size={16} />} />

            <div className="ml-1">
              {/* Origin */}
              <TimelineStep
                icon={<Package size={18} />}
                label={`${shipment.origin.city}, ${shipment.origin.state}`}
                sublabel={shipment.origin.address}
                detail={`ZIP: ${shipment.origin.zip} · Pickup: ${formatDate(shipment.pickupDate)}`}
                color="emerald"
                lineColor={statusIndex >= 1 ? 'bg-gradient-to-b from-emerald-400/50 to-blue-400/50' : 'bg-surface-300/30'}
                completed={statusIndex >= 0}
              />

              {/* In Transit */}
              <TimelineStep
                icon={isException ? <AlertTriangle size={18} /> : <Truck size={18} />}
                label={isException ? 'Exception Reported' : 'In Transit'}
                sublabel={isException ? 'Shipment has encountered an issue' : 'Shipment is on the way'}
                detail={`Est. Delivery: ${formatDate(shipment.deliveryDate)}`}
                color={isException ? 'red' : 'blue'}
                lineColor={statusIndex >= 2 ? 'bg-gradient-to-b from-blue-400/50 to-emerald-400/50' : 'bg-surface-300/30'}
                active={statusIndex === 1}
                completed={statusIndex >= 2}
              />

              {/* Destination */}
              <TimelineStep
                icon={<CheckCircle2 size={18} />}
                label={`${shipment.destination.city}, ${shipment.destination.state}`}
                sublabel={shipment.destination.address}
                detail={`ZIP: ${shipment.destination.zip}`}
                color="emerald"
                completed={statusIndex >= 2}
                isLast
              />
            </div>
          </motion.section>

          {/* ─── Financial Breakdown ─── */}
          <motion.section variants={fadeUp}>
            <SectionHeader title="Financial Breakdown" icon={<Receipt size={16} />} />

            <div className="rounded-2xl bg-surface-200/20 ring-1 ring-surface-300/20 overflow-hidden">
              {/* Base Rate */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <DollarSign size={14} className="text-surface-600" />
                  <span className="text-xs font-medium text-surface-800">Base Rate</span>
                </div>
                <span className="text-sm font-semibold text-surface-900">{formatCurrency(shipment.rates.baseRate)}</span>
              </div>

              <div className="mx-5 h-px bg-surface-300/20" />

              {/* Fuel Surcharge */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <Fuel size={14} className="text-surface-600" />
                  <span className="text-xs font-medium text-surface-800">Fuel Surcharge</span>
                </div>
                <span className="text-sm font-semibold text-surface-900">{formatCurrency(shipment.rates.fuelSurcharge)}</span>
              </div>

              <div className="mx-5 h-px bg-surface-300/20" />

              {/* Total */}
              <div className="flex items-center justify-between px-5 py-4 bg-accent-400/5">
                <div className="flex items-center gap-2.5">
                  <Receipt size={14} className="text-accent-500" />
                  <span className="text-xs font-bold text-white">Total Rate</span>
                </div>
                <span className="text-lg font-bold gradient-text">{formatCurrency(shipment.rates.totalRate)}</span>
              </div>
            </div>
          </motion.section>

          {/* ─── Metadata ─── */}
          <motion.section variants={fadeUp}>
            <SectionHeader title="Metadata" icon={<Clock size={16} />} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Shipper Info */}
              <InfoChip icon={<User size={14} />} label="Shipper" value={shipment.shipper.name} />
              <InfoChip icon={<Mail size={14} />} label="Shipper Email" value={shipment.shipper.contactEmail} />
              <InfoChip icon={<Phone size={14} />} label="Shipper Phone" value={shipment.shipper.phone} />

              {/* Carrier Info */}
              <InfoChip icon={<Building2 size={14} />} label="Carrier" value={shipment.carrier.name} />
              <InfoChip icon={<Hash size={14} />} label="SCAC Code" value={shipment.carrier.scacCode} />
              <InfoChip icon={<Mail size={14} />} label="Carrier Email" value={shipment.carrier.contactEmail} />

              {/* Timestamps */}
              <InfoChip icon={<CalendarDays size={14} />} label="Created At" value={formatDateTime(shipment.createdAt)} />
              <InfoChip icon={<CalendarDays size={14} />} label="Updated At" value={formatDateTime(shipment.updatedAt)} />
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
    </>
  );
}
