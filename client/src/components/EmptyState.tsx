import { motion } from 'framer-motion';
import { Search, PackageX } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden py-16 px-6 text-center h-full min-h-[400px]"
    >
      <div className="relative flex items-center justify-center mb-6">
        <div className="bg-gradient-to-tr from-slate-50 to-slate-100 p-4 rounded-full text-slate-400 flex items-center justify-center relative">
          <Search size={32} className="relative z-10" strokeWidth={1.5} />
          <PackageX size={20} className="absolute -bottom-1 -right-1 text-slate-300 z-20" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-900">No matching shipments found</h3>
      <p className="text-sm text-slate-500 max-w-sm text-center mt-1">
        We couldn't find any shipments matching your filters. Try checking your spelling or modifying the active constraints.
      </p>

      <button
        onClick={onClearFilters}
        className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        Clear active filters
      </button>
    </motion.div>
  );
}
