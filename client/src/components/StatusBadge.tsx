import { ShipmentStatus } from '../types';

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ShipmentStatus, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  [ShipmentStatus.PENDING]: {
    label: 'Pending',
    dotClass: 'bg-amber-400',
    bgClass: 'bg-amber-400/10 ring-amber-400/20',
    textClass: 'text-amber-300',
  },
  [ShipmentStatus.IN_TRANSIT]: {
    label: 'In Transit',
    dotClass: 'bg-blue-400',
    bgClass: 'bg-blue-400/10 ring-blue-400/20',
    textClass: 'text-blue-300',
  },
  [ShipmentStatus.DELIVERED]: {
    label: 'Delivered',
    dotClass: 'bg-emerald-400',
    bgClass: 'bg-emerald-400/10 ring-emerald-400/20',
    textClass: 'text-emerald-300',
  },
  [ShipmentStatus.EXCEPTION]: {
    label: 'Exception',
    dotClass: 'bg-red-400',
    bgClass: 'bg-red-400/10 ring-red-400/20',
    textClass: 'text-red-300',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${sizeClasses} ${config.bgClass} ${config.textClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
