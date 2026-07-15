import { motion } from 'framer-motion';
import {
  Menu,
  Search,
  LayoutGrid,
  Table2,
  Bell,
  Plus,
  Shield,
  UserCircle,
} from 'lucide-react';
import type { ViewMode, UserRole } from '../types';

interface TopNavProps {
  onToggleSidebar: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  userRole: UserRole;
  onRoleToggle: () => void;
}

export default function TopNav({
  onToggleSidebar,
  viewMode,
  onViewModeChange,
  userRole,
  onRoleToggle,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-surface-300/50">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-surface-600 transition-colors hover:bg-surface-200 hover:text-white"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-600" />
          <input
            type="text"
            placeholder="Search shipments, carriers, tracking..."
            className="w-full rounded-xl bg-surface-200/60 py-2.5 pl-10 pr-4 text-sm text-surface-900 placeholder:text-surface-600 outline-none ring-1 ring-surface-300/50 transition-all duration-200 focus:ring-accent-400/40 focus:bg-surface-200"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* View Toggle */}
        <div className="hidden sm:flex items-center rounded-xl bg-surface-200/60 p-1 ring-1 ring-surface-300/50">
          <ViewToggleButton
            active={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
            icon={<Table2 size={15} />}
            label="Grid"
          />
          <ViewToggleButton
            active={viewMode === 'tile'}
            onClick={() => onViewModeChange('tile')}
            icon={<LayoutGrid size={15} />}
            label="Tiles"
          />
        </div>

        {/* Quick Actions */}
        <button className="hidden md:flex items-center gap-2 rounded-xl gradient-accent px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-accent-400/20 transition-all duration-200 hover:shadow-accent-400/40 hover:scale-[1.02] active:scale-[0.98]">
          <Plus size={14} />
          New Shipment
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-surface-600 transition-colors hover:bg-surface-200 hover:text-white">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-400 ring-2 ring-surface-50" />
        </button>

        {/* Role Toggle & Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRoleToggle}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset transition-all duration-300
              ${userRole === 'ADMIN'
                ? 'bg-purple-400/10 text-purple-300 ring-purple-400/20'
                : 'bg-sky-400/10 text-sky-300 ring-sky-400/20'
              }`}
          >
            <Shield size={12} />
            {userRole}
          </button>

          <div className="flex items-center gap-2 rounded-xl bg-surface-200/40 px-3 py-1.5 ring-1 ring-surface-300/30">
            <UserCircle size={22} className="text-surface-600" />
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-surface-900 leading-tight">Alex Morgan</p>
              <p className="text-[10px] text-surface-600 leading-tight">alex@ultraship.io</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200
        ${active ? 'text-white' : 'text-surface-600 hover:text-surface-800'}`}
    >
      {active && (
        <motion.span
          layoutId="viewToggle"
          className="absolute inset-0 rounded-lg bg-accent-400/20 ring-1 ring-accent-400/30"
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </button>
  );
}
