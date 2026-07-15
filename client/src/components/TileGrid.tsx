import { motion } from 'framer-motion';
import type { Shipment, UserRole } from '../types';
import ShipmentTileCard from './ShipmentTileCard';

interface TileGridProps {
  shipments: Shipment[];
  userRole: UserRole;
  onSelectShipment: (shipment: Shipment) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export default function TileGrid({ shipments, userRole, onSelectShipment }: TileGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      {shipments.map((shipment) => (
        <ShipmentTileCard
          key={shipment.id}
          shipment={shipment}
          userRole={userRole}
          onSelect={onSelectShipment}
        />
      ))}
    </motion.div>
  );
}
