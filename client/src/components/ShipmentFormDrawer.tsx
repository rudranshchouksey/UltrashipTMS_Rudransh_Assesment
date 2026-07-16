import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Lock, Loader2, Check, RefreshCw, ChevronDown } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { CREATE_SHIPMENT_MUTATION, UPDATE_SHIPMENT_MUTATION } from '../graphql/mutations';
import { GET_SHIPMENTS } from '../graphql/queries';

export type UserRole = 'ADMIN' | 'EMPLOYEE';

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
  selectedShipment?: Partial<ShipmentFormData> & { id?: string } | null;
  userRole: UserRole;
  onSuccess?: () => void;
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
  selectedShipment,
  userRole,
  onSuccess,
}) => {
  const mode = selectedShipment ? 'edit' : 'create';
  const [formData, setFormData] = useState<ShipmentFormData>(defaultFormData);
  const [statusOpen, setStatusOpen] = useState(false);
  
  // State for the premium success feedback modal
  const [successState, setSuccessState] = useState<{ show: boolean; type: 'create' | 'edit'; id: string }>({
    show: false,
    type: 'create',
    id: ''
  });

  const [createShipment, { loading: creating }] = useMutation<{ createShipment: any }>(CREATE_SHIPMENT_MUTATION, {
    refetchQueries: [{ query: GET_SHIPMENTS }],
    onCompleted: (data) => {
      const newId = data?.createShipment?.id || 'NEW';
      handleSuccess('create', newId);
    },
  });

  const [updateShipment, { loading: updating }] = useMutation(UPDATE_SHIPMENT_MUTATION, {
    onCompleted: (data) => {
      const updatedId = data?.updateShipment?.id || selectedShipment?.id || 'UPDATED';
      handleSuccess('edit', updatedId);
    },
  });

  const isSubmitting = creating || updating;

  const handleSuccess = (type: 'create' | 'edit', id: string) => {
    setSuccessState({ show: true, type, id });
    setTimeout(() => {
      setSuccessState((prev) => ({ ...prev, show: false }));
      onClose();
      if (onSuccess) onSuccess();
    }, 3000); // 3 seconds auto-close
  };

  const closeSuccessModal = () => {
    setSuccessState((prev) => ({ ...prev, show: false }));
    onClose();
    if (onSuccess) onSuccess();
  };

  useEffect(() => {
    if (isOpen) {
      if (selectedShipment) {
        setFormData({
          ...defaultFormData,
          ...selectedShipment,
          pickupDate: selectedShipment.pickupDate ? selectedShipment.pickupDate.substring(0, 16) : '',
          deliveryDate: selectedShipment.deliveryDate ? selectedShipment.deliveryDate.substring(0, 16) : '',
          origin: { ...defaultFormData.origin, ...selectedShipment.origin },
          destination: { ...defaultFormData.destination, ...selectedShipment.destination },
          rates: { ...defaultFormData.rates, ...selectedShipment.rates },
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, selectedShipment]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (mode === 'create') {
      await createShipment({
        variables: {
          input: {
            shipperName: formData.shipperName,
            carrierName: formData.carrierName,
            trackingNumber: formData.trackingNumber,
            status: formData.status,
            origin: {
              address: formData.origin.address,
              city: formData.origin.city,
              state: formData.origin.state,
              zip: formData.origin.zip,
            },
            destination: {
              address: formData.destination.address,
              city: formData.destination.city,
              state: formData.destination.state,
              zip: formData.destination.zip,
            },
            rates: {
              baseRate: formData.rates.baseRate,
              fuelSurcharge: formData.rates.fuelSurcharge,
            },
            pickupDate: formData.pickupDate,
            deliveryDate: formData.deliveryDate,
          }
        }
      });
    } else if (mode === 'edit' && selectedShipment?.id) {
      const optimisticResponse = {
        updateShipment: {
          __typename: 'Shipment',
          id: selectedShipment.id,
          status: formData.status,
          trackingNumber: formData.trackingNumber,
          rates: {
            __typename: 'Rates',
            baseRate: formData.rates.baseRate,
            fuelSurcharge: formData.rates.fuelSurcharge,
            totalRate: formData.rates.baseRate + formData.rates.fuelSurcharge,
          },
          pickupDate: formData.pickupDate,
          deliveryDate: formData.deliveryDate,
          updatedAt: new Date().toISOString(),
          origin: { __typename: 'Address', ...formData.origin },
          destination: { __typename: 'Address', ...formData.destination },
          shipper: { __typename: 'Shipper', id: 'temp-shipper', name: formData.shipperName },
          carrier: { __typename: 'Carrier', id: 'temp-carrier', name: formData.carrierName },
        }
      };

      await updateShipment({
        variables: {
          input: {
            id: selectedShipment.id,
            shipperName: formData.shipperName,
            carrierName: formData.carrierName,
            trackingNumber: formData.trackingNumber,
            status: formData.status,
            origin: {
              address: formData.origin.address,
              city: formData.origin.city,
              state: formData.origin.state,
              zip: formData.origin.zip,
            },
            destination: {
              address: formData.destination.address,
              city: formData.destination.city,
              state: formData.destination.state,
              zip: formData.destination.zip,
            },
            rates: {
              baseRate: formData.rates.baseRate,
              fuelSurcharge: formData.rates.fuelSurcharge,
            },
            pickupDate: formData.pickupDate,
            deliveryDate: formData.deliveryDate,
          }
        },
        optimisticResponse
      });
    }
  };

  const inputClass = `w-full bg-white border border-slate-200/80 hover:border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-150 
    focus:border-blue-500/90 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`;
  const labelClass = "block text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-3 mb-2";

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
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-900/15 backdrop-blur-sm"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full md:w-[40vw] min-w-[400px] bg-white shadow-2xl flex flex-col border-l border-slate-200/80"
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
                  
                  {/* Status Field */}
                  <div className="space-y-2 relative z-50">
                    <label className={labelClass}>Shipment Status</label>
                    <button
                      type="button"
                      onClick={() => setStatusOpen(!statusOpen)}
                      className={`${inputClass} flex items-center justify-between text-left relative z-20`}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {formData.status === 'PENDING' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                        {formData.status === 'IN_TRANSIT' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                        {formData.status === 'DELIVERED' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                        {formData.status === 'EXCEPTION' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                        {formData.status.replace('_', ' ')}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {statusOpen && (
                        <>
                          {/* Invisible backdrop to capture outside clicks */}
                          <div className="fixed inset-0 z-30" onClick={() => setStatusOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-[calc(100%+4px)] left-0 right-0 z-40 bg-white border border-slate-200/80 rounded-lg shadow-xl overflow-hidden py-1"
                          >
                            {[
                              { value: 'PENDING', label: 'Pending', dot: 'bg-amber-400' },
                              { value: 'IN_TRANSIT', label: 'In Transit', dot: 'bg-blue-500' },
                              { value: 'DELIVERED', label: 'Delivered', dot: 'bg-emerald-500' },
                              { value: 'EXCEPTION', label: 'Exception', dot: 'bg-rose-500' }
                            ].map(s => (
                              <button
                                key={s.value}
                                type="button"
                                onClick={() => {
                                  handleChange('status', s.value);
                                  setStatusOpen(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                                <span className="font-medium">{s.label}</span>
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Section 1: Logistics Parties & Tracking */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">
                      Logistics Parties & Tracking
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4">
                      {renderInput('Shipper Name', 'shipperName', 'text', 'e.g. Acme Corp')}
                      {renderInput('Carrier Name', 'carrierName', 'text', 'e.g. Global Freight')}
                      <div className="col-span-2">
                        {renderInput('Tracking Number', 'trackingNumber', 'text', 'e.g. TRK-12345')}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Origin & Destination */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">
                      Origin & Destination
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {/* Origin */}
                      <div>
                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Origin</h4>
                        {renderInput('Street Address', 'origin.address')}
                        <div className="grid grid-cols-2 gap-3">
                          {renderInput('City', 'origin.city')}
                          {renderInput('State', 'origin.state')}
                        </div>
                        {renderInput('ZIP Code', 'origin.zip')}
                      </div>

                      {/* Destination */}
                      <div>
                        <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2">Destination</h4>
                        {renderInput('Street Address', 'destination.address')}
                        <div className="grid grid-cols-2 gap-3">
                          {renderInput('City', 'destination.city')}
                          {renderInput('State', 'destination.state')}
                        </div>
                        {renderInput('ZIP Code', 'destination.zip')}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Financials & Dates */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">
                      Financials & Dates
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4">
                      {renderInput('Base Rate ($)', 'rates.baseRate', 'number')}
                      {renderInput('Fuel Surcharge ($)', 'rates.fuelSurcharge', 'number')}
                      {renderInput('Pickup Date', 'pickupDate', 'datetime-local')}
                      {renderInput('Delivery Date', 'deliveryDate', 'datetime-local')}
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
                  disabled={isSubmitting}
                  className="px-5 py-2 flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-blue-500/20 disabled:bg-blue-400 disabled:cursor-not-allowed w-40 justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {mode === 'create' ? 'Create Shipment' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Success Feedback Modal */}
      <AnimatePresence>
        {successState.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative border border-slate-100"
            >
              <div className="p-6 pb-5 flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${successState.type === 'create' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {successState.type === 'create' ? <Check className="w-7 h-7" /> : <RefreshCw className="w-7 h-7" />}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {successState.type === 'create' ? 'Shipment Created Successfully' : 'Shipment Updated'}
                </h3>
                <p className="text-sm text-slate-500 mb-6 px-2 leading-relaxed">
                  {successState.type === 'create' 
                    ? `Shipment #${successState.id} has been broadcasted to the carrier network.` 
                    : `Changes to Shipment #${successState.id} have been successfully synced down to the data grid.`}
                </p>
                <button
                  onClick={closeSuccessModal}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
