import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useMutation } from '@apollo/client/react';
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
          className={`flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset transition-all
            ${completed
              ? `bg-${color}-50 ring-${color}-200 text-${color}-600`
              : active
                ? `bg-${color}-50 ring-${color}-200 text-${color}-600 animate-pulse-dot`
                : 'bg-slate-50 ring-slate-200 text-slate-400'
            }`}
        >
          {icon}
        </div>
        {!isLast && (
          <div className={`w-px flex-1 min-h-[32px] mt-1 ${lineColor || 'bg-slate-200'}`} />
        )}
      </div>

      {/* Content */}
      <div className="pb-6 pt-1.5 flex-1">
        <p className={`text-sm font-semibold ${completed || active ? 'text-slate-900' : 'text-slate-500'}`}>
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-slate-600 mt-0.5">{sublabel}</p>
        )}
        {detail && (
          <p className="text-[11px] text-slate-500 mt-1">{detail}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Info Chip ─── */

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200 shadow-sm">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
        <p className="text-xs font-medium text-slate-900 break-all">{value}</p>
      </div>
    </div>
  );
}

/* ─── Section Header ─── */

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="text-indigo-500">{icon}</div>
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
      <div className="flex-1 h-px bg-slate-200" />
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
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    x: '100%',
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
        className="fixed inset-0 z-50 backdrop-blur-sm bg-slate-900/10"
      />

      {/* Panel */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-y-0 right-0 w-full max-w-xl z-50 bg-slate-50 border-l border-slate-200 overflow-hidden flex flex-col shadow-2xl"
      >
        {/* ─── Header ─── */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600
                transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 group"
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
                  className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-500/20 transition-all hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                #{shipment.id.split('-')[0].toUpperCase()}
              </h2>
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {shipment.trackingNumber}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {shipment.carrier.name}
              <span className="text-slate-500 ml-1.5 font-mono text-xs">({shipment.carrier.scacCode})</span>
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

            <div className="ml-1 bg-white p-6 rounded-2xl ring-1 ring-slate-200 shadow-sm">
              {/* Origin */}
              <TimelineStep
                icon={<Package size={18} />}
                label={`${shipment.origin.city}, ${shipment.origin.state}`}
                sublabel={shipment.origin.address}
                detail={`ZIP: ${shipment.origin.zip} · Pickup: ${formatDate(shipment.pickupDate)}`}
                color="indigo"
                lineColor={statusIndex >= 1 ? 'bg-indigo-200' : 'bg-slate-200'}
                completed={statusIndex >= 0}
              />

              {/* In Transit */}
              <TimelineStep
                icon={isException ? <AlertTriangle size={18} /> : <Truck size={18} />}
                label={isException ? 'Exception Reported' : 'In Transit'}
                sublabel={isException ? 'Shipment has encountered an issue' : 'Shipment is on the way'}
                detail={`Est. Delivery: ${formatDate(shipment.deliveryDate)}`}
                color={isException ? 'rose' : 'indigo'}
                lineColor={statusIndex >= 2 ? 'bg-indigo-200' : 'bg-slate-200'}
                active={statusIndex === 1}
                completed={statusIndex >= 2}
              />

              {/* Destination */}
              <TimelineStep
                icon={<CheckCircle2 size={18} />}
                label={`${shipment.destination.city}, ${shipment.destination.state}`}
                sublabel={shipment.destination.address}
                detail={`ZIP: ${shipment.destination.zip}`}
                color="indigo"
                completed={statusIndex >= 2}
                isLast
              />
            </div>
          </motion.section>

          {/* ─── Financial Breakdown ─── */}
          <motion.section variants={fadeUp}>
            <SectionHeader title="Financial Breakdown" icon={<Receipt size={16} />} />

            <dl className="rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden shadow-sm">
              {/* Base Rate */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <dt className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
                  <DollarSign size={14} className="text-slate-400" />
                  Base Rate
                </dt>
                <dd className="text-sm font-semibold text-slate-900">{formatCurrency(shipment.rates.baseRate)}</dd>
              </div>

              {/* Fuel Surcharge */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <dt className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
                  <Fuel size={14} className="text-slate-400" />
                  Fuel Surcharge
                </dt>
                <dd className="text-sm font-semibold text-slate-900">{formatCurrency(shipment.rates.fuelSurcharge)}</dd>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-5 py-4 bg-slate-50">
                <dt className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <Receipt size={14} className="text-indigo-600" />
                  Total Rate
                </dt>
                <dd className="text-lg font-bold text-indigo-600">{formatCurrency(shipment.rates.totalRate)}</dd>
              </div>
            </dl>
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
