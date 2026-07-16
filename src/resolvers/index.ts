import { GraphQLContext, Role, ShipmentStatus } from '../types/index.js';
import { ShipmentService } from '../services/shipmentService.js';
import { requireAuth, requireRole } from '../context.js';
import { GraphQLError } from 'graphql';
import { faker } from '@faker-js/faker';
import { createShipmentRecord, updateShipmentRecord } from '../db/mockDb.js';
export const resolvers = {
  Query: {
    shipment: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requireAuth(context.user); // Anyone authenticated can read
      const shipment = await ShipmentService.getShipmentById(id);
      if (!shipment) {
        throw new GraphQLError(`Shipment ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return shipment;
    },
    shipments: async (
      _: any,
      { first, after, filter, orderBy }: any,
      context: GraphQLContext
    ) => {
      requireAuth(context.user);
      return await ShipmentService.getShipments(first, after, filter, orderBy);
    },
  },
  
  Mutation: {
    createShipment: async (_: any, { input }: any, context: GraphQLContext) => {
      // 1. RBAC Guard
      requireAuth(context.user);
      if (context.user?.role !== Role.ADMIN) {
        throw new GraphQLError('Forbidden: Only ADMIN users can create shipments.', {
          extensions: { code: 'FORBIDDEN' },
        });
      }
      
      // 2. Data Validation
      if (input.rates) {
        if (input.rates.baseRate < 0 || input.rates.fuelSurcharge < 0) {
          throw new GraphQLError('Rates must be positive numbers.', { extensions: { code: 'BAD_USER_INPUT' } });
        }
      }
      
      if (input.pickupDate && input.deliveryDate) {
        if (new Date(input.deliveryDate) < new Date(input.pickupDate)) {
          throw new GraphQLError('Delivery date cannot be earlier than pickup date.', { extensions: { code: 'BAD_USER_INPUT' } });
        }
      }
      
      // 3. Database Mutation
      return createShipmentRecord(input);
    },
    
    updateShipment: async (_: any, { input }: any, context: GraphQLContext) => {
      requireAuth(context.user);
      const user = context.user!;
      const { id, ...updateData } = input;
      
      const shipment = await ShipmentService.getShipmentById(id);
      if (!shipment) {
        throw new GraphQLError(`Shipment ${id} not found`, { extensions: { code: 'NOT_FOUND' } });
      }

      // 1. RBAC Guard
      if (user.role === Role.EMPLOYEE) {
        const inputKeys = Object.keys(updateData);
        const hasUnauthorizedKeys = inputKeys.some(key => key !== 'status');
        
        if (hasUnauthorizedKeys) {
          throw new GraphQLError("Forbidden: Employees are only permitted to update the shipment status.", {
            extensions: { code: 'FORBIDDEN' }
          });
        }
      }

      // 2. Data Validation
      if (updateData.rates) {
        if (updateData.rates.baseRate < 0 || updateData.rates.fuelSurcharge < 0) {
           throw new GraphQLError('Rates must be positive numbers.', { extensions: { code: 'BAD_USER_INPUT' } });
        }
      }
      
      const mergedPickup = updateData.pickupDate || shipment.pickupDate;
      const mergedDelivery = updateData.deliveryDate || shipment.deliveryDate;
      
      if (mergedPickup && mergedDelivery) {
        if (new Date(mergedDelivery) < new Date(mergedPickup)) {
          throw new GraphQLError('Delivery date cannot be earlier than pickup date.', { extensions: { code: 'BAD_USER_INPUT' } });
        }
      }

      // 3. Database Mutation
      return updateShipmentRecord(id, updateData);
    },
    
    deleteShipment: async (_: any, { id }: any, context: GraphQLContext) => {
      requireRole(context.user, Role.ADMIN);
      // Mock delete
      return true;
    }
  },

  Shipment: {
    // DataLoader integration
    shipper: async (parent: any, _: any, context: GraphQLContext) => {
      return await context.dataLoaders.shipperLoader.load(parent.shipperId);
    },
    carrier: async (parent: any, _: any, context: GraphQLContext) => {
      return await context.dataLoaders.carrierLoader.load(parent.carrierId);
    },
  },
};
