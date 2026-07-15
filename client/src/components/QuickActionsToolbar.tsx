import { UserPlus, Send, FileText, Truck } from 'lucide-react';

export default function QuickActionsToolbar() {
  const actions = [
    {
      id: 'onboard',
      title: 'Onboard Carrier',
      description: 'Add new carrier network',
      icon: <UserPlus size={18} className="text-white" />,
      colorClass: 'bg-[#1e293b] hover:bg-slate-800'
    },
    {
      id: 'invite',
      title: 'Invite Shipper',
      description: 'Send portal access',
      icon: <Send size={18} className="text-white" />,
      colorClass: 'bg-[#2563eb] hover:bg-blue-700'
    },
    {
      id: 'quote',
      title: 'Create Quote',
      description: 'Generate rate quote',
      icon: <FileText size={18} className="text-white" />,
      colorClass: 'bg-[#10b981] hover:bg-emerald-600'
    },
    {
      id: 'load',
      title: 'Create Load',
      description: 'Book a new shipment',
      icon: <Truck size={18} className="text-white" />,
      colorClass: 'bg-[#f59e0b] hover:bg-amber-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {actions.map((action) => (
        <button
          key={action.id}
          className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150 shadow-sm ${action.colorClass}`}
        >
          <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/10 p-2">
            {action.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{action.title}</p>
            <p className="text-xs text-white/80">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
