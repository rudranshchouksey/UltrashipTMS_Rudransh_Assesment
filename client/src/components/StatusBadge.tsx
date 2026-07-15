import { ShipmentStatus } from '../types';

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ShipmentStatus, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  [ShipmentStatus.PENDING]: {
    label: 'Pending',
    dotClass: 'bg-amber-500',
    bgClass: 'bg-amber-50 ring-amber-200/60',
    textClass: 'text-amber-700',
  },
  [ShipmentStatus.IN_TRANSIT]: {
    label: 'In Transit',
    dotClass: 'bg-blue-500',
    bgClass: 'bg-blue-50 ring-blue-200/60',
    textClass: 'text-blue-700',
  },
  [ShipmentStatus.DELIVERED]: {
    label: 'Delivered',
    dotClass: 'bg-emerald-500',
    bgClass: 'bg-emerald-50 ring-emerald-200/60',
    textClass: 'text-emerald-700',
  },
  [ShipmentStatus.EXCEPTION]: {
    label: 'Exception',
    dotClass: 'bg-rose-500',
    bgClass: 'bg-rose-50 ring-rose-200/60',
    textClass: 'text-rose-700',
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
