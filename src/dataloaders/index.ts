import DataLoader from 'dataloader';
import { carriers, shippers } from '../db/mockDb.js';
import { Carrier, Shipper } from '../types/index.js';

export const createDataLoaders = () => {
  return {
    shipperLoader: new DataLoader<string, Shipper>(async (shipperIds) => {
      // In a real app, this would be: `SELECT * FROM shippers WHERE id IN (:shipperIds)`
      const shippersMap = new Map(shippers.map((s) => [s.id, s]));
      return shipperIds.map((id) => shippersMap.get(id) || new Error(`Shipper not found: ${id}`));
    }),
    
    carrierLoader: new DataLoader<string, Carrier>(async (carrierIds) => {
      // In a real app, this would be: `SELECT * FROM carriers WHERE id IN (:carrierIds)`
      const carriersMap = new Map(carriers.map((c) => [c.id, c]));
      return carrierIds.map((id) => carriersMap.get(id) || new Error(`Carrier not found: ${id}`));
    }),
  };
};
