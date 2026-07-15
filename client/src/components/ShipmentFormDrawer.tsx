import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Lock } from 'lucide-react';

export type UserRole = 'ADMIN' | 'EMPLOYEE';
export type FormMode = 'create' | 'edit';

interface ShipmentFormData {
  shipperName: string;
  carrierName: string;
  trackingNumber: string;
  status: string;
  origin: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  destination: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  rates: {
    baseRate: number;
    fuelSurcharge: number;
  };
  pickupDate: string;
  deliveryDate: string;
}

interface ShipmentFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: FormMode;
  initialData?: Partial<ShipmentFormData>;
  userRole: UserRole;
  onSubmit: (data: ShipmentFormData) => void;
}

const defaultFormData: ShipmentFormData = {
  shipperName: '',
  carrierName: '',
  trackingNumber: '',
  status: 'PENDING',
  origin: { address: '', city: '', state: '', zip: '' },
  destination: { address: '', city: '', state: '', zip: '' },
  rates: { baseRate: 0, fuelSurcharge: 0 },
  pickupDate: '',
  deliveryDate: '',
};

export const ShipmentFormDrawer: React.FC<ShipmentFormDrawerProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  userRole,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ShipmentFormData>(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          ...defaultFormData,
          ...initialData,
          origin: { ...defaultFormData.origin, ...initialData.origin },
          destination: { ...defaultFormData.destination, ...initialData.destination },
          rates: { ...defaultFormData.rates, ...initialData.rates },
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, mode, initialData]);

  const isEmployeeEdit = userRole === 'EMPLOYEE' && mode === 'edit';

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const keys = field.split('.');
      if (keys.length === 1) return { ...prev, [field]: value };
      
      const [parent, child] = keys;
      return {
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = `w-full bg-white border border-slate-200/80 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none transition-all duration-200 
    focus:border-blue-500/80 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`;
  const labelClass = "block text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5";

  // A helper to render an input, properly disabling it and showing lock icons if needed.
  const renderInput = (
    label: string, 
    field: string, 
    type: string = 'text', 
    placeholder: string = '', 
    disabledOverride: boolean = false
  ) => {
    const value = field.split('.').reduce((o, i) => (o as any)[i], formData);
    const isDisabled = disabledOverride || isEmployeeEdit;
    
    return (
      <div className="relative flex flex-col">
        <label className={labelClass}>{label}</label>
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => handleChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
            disabled={isDisabled}
            placeholder={placeholder}
            className={inputClass}
          />
          {isDisabled && isEmployeeEdit && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 group" title="Employees cannot modify this field">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-50 shadow-2xl flex flex-col border-l border-white/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {mode === 'create' ? 'Create New Shipment' : 'Edit Shipment'}
                </h2>
                {isEmployeeEdit && (
                  <p className="text-xs text-orange-500 font-medium mt-0.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Employee access restricts editing to Status only
                  </p>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="shipment-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Status Field (Always editable except if we want creation to default to pending) */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <label className={labelClass}>Shipment Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className={inputClass}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="EXCEPTION">Exception</option>
                  </select>
                </div>

                {/* Section 1: Parties Involved */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                    Parties & Tracking
                  </h3>
                  <div className="space-y-3">
                    {renderInput('Shipper Name', 'shipperName', 'text', 'e.g. Acme Corp')}
                    {renderInput('Carrier Name', 'carrierName', 'text', 'e.g. Global Freight')}
                    {renderInput('Tracking Number', 'trackingNumber', 'text', 'e.g. TRK-12345')}
                  </div>
                </div>

                {/* Section 2: Logistics Route */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                    Logistics Route
                  </h3>
                  
                  {/* Origin */}
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Origin</h4>
                    {renderInput('Street Address', 'origin.address')}
                    <div className="grid grid-cols-2 gap-3">
                      {renderInput('City', 'origin.city')}
                      {renderInput('State', 'origin.state')}
                    </div>
                    {renderInput('ZIP / Postal Code', 'origin.zip')}
                  </div>

                  {/* Destination */}
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Destination</h4>
                    {renderInput('Street Address', 'destination.address')}
                    <div className="grid grid-cols-2 gap-3">
                      {renderInput('City', 'destination.city')}
                      {renderInput('State', 'destination.state')}
                    </div>
                    {renderInput('ZIP / Postal Code', 'destination.zip')}
                  </div>
                </div>

                {/* Section 3: Financials & Schedule */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2">
                    Financials & Schedule
                  </h3>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {renderInput('Base Rate ($)', 'rates.baseRate', 'number')}
                      {renderInput('Fuel Surcharge ($)', 'rates.fuelSurcharge', 'number')}
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {renderInput('Pickup Date', 'pickupDate', 'datetime-local')}
                      {renderInput('Delivery Date', 'deliveryDate', 'datetime-local')}
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="shipment-form"
                className="px-5 py-2 flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-blue-500/20"
              >
                <Save className="w-4 h-4" />
                {mode === 'create' ? 'Create Shipment' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
