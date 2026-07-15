import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

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
      className="flex flex-col items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden p-12 text-center h-full min-h-[400px]"
    >
      <div className="relative flex items-center justify-center h-20 w-20 mb-6">
        <div className="absolute inset-0 rounded-full bg-slate-50 ring-1 ring-slate-100" />
        <div className="absolute inset-2 rounded-full bg-indigo-50/50 border border-indigo-100/50" />
        <Search size={32} className="relative z-10 text-indigo-400" strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">No shipments found</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        We couldn't find any shipments matching your filters. Try adjusting your search term or clearing the active filters.
      </p>

      <button
        onClick={onClearFilters}
        className="rounded-lg bg-white border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98]"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
}
