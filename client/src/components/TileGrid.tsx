import { motion } from 'framer-motion';
import type { Shipment, UserRole } from '../types';
import ShipmentTileCard from './ShipmentTileCard';

interface TileGridProps {
  shipments: Shipment[];
  userRole: UserRole;
  onSelectShipment: (shipment: Shipment) => void;
  onEditShipment: (shipment: Shipment) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.04,
    },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

export default function TileGrid({ shipments, userRole, onSelectShipment, onEditShipment }: TileGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      {shipments.map((shipment) => (
        <ShipmentTileCard
          key={shipment.id}
          shipment={shipment}
          userRole={userRole}
          onSelect={onSelectShipment}
          onEdit={() => onEditShipment(shipment)}
        />
      ))}
    </motion.div>
  );
}
