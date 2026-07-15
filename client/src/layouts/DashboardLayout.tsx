import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarContent from './Sidebar';
import TopNav from './TopNav';
import type { ViewMode, UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  userRole: UserRole;
  onRoleToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNew: () => void;
}

const springTransition = { type: 'spring', stiffness: 300, damping: 30 };

export default function DashboardLayout({
  children,
  viewMode,
  onViewModeChange,
  userRole,
  onRoleToggle,
  searchQuery,
  onSearchChange,
  onOpenNew,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fa] relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 288 : 64,
        }}
        transition={springTransition}
        className="flex-shrink-0 z-50 h-full bg-[#0f172a] absolute lg:relative z-50"
      >
        <div className="w-full h-full flex flex-col border-r border-slate-800 overflow-visible">
          <SidebarContent onClose={closeSidebar} isOpen={isSidebarOpen} />
        </div>
      </motion.aside>

      {/* Main Content Container */}
      <motion.main
        layout
        transition={springTransition}
        className="flex flex-1 flex-col overflow-hidden relative min-w-0"
      >
        <TopNav
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          userRole={userRole}
          onRoleToggle={onRoleToggle}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onOpenNew={onOpenNew}
        />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
