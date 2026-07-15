import { ShipmentStatus } from '../types';

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ShipmentStatus, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  [ShipmentStatus.PENDING]: {
    label: 'Pending',
    dotClass: 'hidden',
    bgClass: 'bg-amber-50 border border-amber-200/60',
    textClass: 'text-amber-700',
  },
  [ShipmentStatus.IN_TRANSIT]: {
    label: 'In Transit',
    dotClass: 'hidden',
    bgClass: 'bg-blue-50 border border-blue-200/60',
    textClass: 'text-blue-700',
  },
  [ShipmentStatus.DELIVERED]: {
    label: 'Delivered',
    dotClass: 'hidden',
    bgClass: 'bg-emerald-50 border border-emerald-200/60',
    textClass: 'text-emerald-700',
  },
  [ShipmentStatus.EXCEPTION]: {
    label: 'Exception',
    dotClass: 'hidden',
    bgClass: 'bg-rose-50 border border-rose-200/60',
    textClass: 'text-rose-700',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center justify-center font-semibold rounded-full ${sizeClasses} ${config.bgClass} ${config.textClass}`}
    >
      {config.label}
    </span>
  );
}
