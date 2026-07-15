import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Truck,
  Package,
  BarChart3,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Boxes,
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
  isOpen: boolean;
}

interface MenuGroup {
  label: string;
  icon: React.ReactNode;
  children?: { label: string; active?: boolean }[];
  active?: boolean;
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    active: false,
  },
  {
    label: 'Logistics',
    icon: <Truck size={18} />,
    children: [
      { label: 'Shipments', active: true },
      { label: 'Orders' },
      { label: 'Routes' },
    ],
  },
  {
    label: 'Inventory',
    icon: <Package size={18} />,
    children: [
      { label: 'Warehouses' },
      { label: 'Stock Levels' },
    ],
  },
  {
    label: 'Analytics',
    icon: <BarChart3 size={18} />,
    children: [
      { label: 'Reports' },
      { label: 'KPIs' },
      { label: 'Cost Analysis' },
    ],
  },
  {
    label: 'Documents',
    icon: <FileText size={18} />,
  },
  {
    label: 'Settings',
    icon: <Settings size={18} />,
  },
];

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: -320, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const overlayVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

function MenuItemGroup({ group, isOpen }: { group: MenuGroup, isOpen: boolean }) {
  const [expanded, setExpanded] = useState(
    group.children?.some((c) => c.active) ?? false
  );

  if (!group.children) {
    return (
      <div className="group relative">
        <button
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
            ${group.active
              ? 'bg-accent-50 text-accent-600'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }
            ${isOpen ? 'gap-3' : 'justify-center'}
          `}
        >
          <span className={`shrink-0 ${group.active ? 'text-accent-500' : 'text-slate-400'}`}>{group.icon}</span>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap"
              >
                {group.label}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 bg-slate-900 text-white text-xs font-semibold py-1.5 px-2.5 rounded shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
            {group.label}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900
          ${isOpen ? 'gap-3' : 'justify-center'}
        `}
      >
        <span className="shrink-0 text-slate-400">{group.icon}</span>
        
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex-1 text-left whitespace-nowrap"
              >
                {group.label}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: expanded ? 0 : -90 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-slate-400 shrink-0"
              >
                <ChevronDown size={14} />
              </motion.span>
            </>
          )}
        </AnimatePresence>
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 bg-slate-900 text-white text-xs font-semibold py-1.5 px-2.5 rounded shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
          {group.label}
        </div>
      )}

      <AnimatePresence initial={false}>
        {expanded && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-5 border-l border-slate-200 pl-3 mt-1 space-y-0.5">
              {group.children.map((child) => (
                <button
                  key={child.label}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-200 whitespace-nowrap
                    ${child.active
                      ? 'bg-accent-50 text-accent-600'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                >
                  <ChevronRight size={12} className={`shrink-0 ${child.active ? 'text-accent-500' : 'text-slate-400'}`} />
                  {child.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ onClose, isOpen }: SidebarProps) {
  return (
    <>
      {/* Header */}
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} border-b border-slate-200/60 px-5 py-5 h-16`}>
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent shadow-lg shrink-0">
              <Boxes size={18} className="text-white" />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Ultraship</h1>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">TMS Platform</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden shrink-0"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1">
          {menuGroups.map((group) => (
            <MenuItemGroup key={group.label} group={group} isOpen={isOpen} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200/60 p-4 overflow-hidden">
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="rounded-lg bg-slate-50 p-3 border border-slate-200/60 shadow-sm whitespace-nowrap"
              >
                <p className="text-xs font-semibold text-slate-800">Pro Plan Active</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Unlimited shipments</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group relative cursor-pointer">
                  <span className="text-[10px] font-bold text-slate-600">PRO</span>
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 ml-2 bg-slate-900 text-white text-xs font-semibold py-1.5 px-2.5 rounded shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-[100]">
                    Pro Plan Active
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </>
  );
}
