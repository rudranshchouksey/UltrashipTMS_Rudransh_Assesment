import { GraphQLContext, Role, ShipmentStatus } from '../types/index.js';
import { ShipmentService } from '../services/shipmentService.js';
import { requireAuth, requireRole } from '../context.js';
import { GraphQLError } from 'graphql';
import { faker } from '@faker-js/faker';

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
      { first, after, filter, sort }: any,
      context: GraphQLContext
    ) => {
      requireAuth(context.user);
      return await ShipmentService.getShipments(first, after, filter, sort);
    },
  },
  
  Mutation: {
    addShipment: async (_: any, { input }: any, context: GraphQLContext) => {
      requireRole(context.user, Role.ADMIN);
      
      const newShipment = {
        id: faker.string.uuid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...input,
      };
      
      // Normally we would save to DB here. For this mock, we just return the object
      return newShipment;
    },
    
    updateShipment: async (_: any, { id, input }: any, context: GraphQLContext) => {
      requireAuth(context.user);
      const user = context.user!;
      
      const shipment = await ShipmentService.getShipmentById(id);
      if (!shipment) {
        throw new GraphQLError(`Shipment ${id} not found`, { extensions: { code: 'NOT_FOUND' } });
      }

      if (user.role === Role.EMPLOYEE) {
        // Enforce employee restrictions
        const inputKeys = Object.keys(input);
        const allowedKeys = ['status'];
        
        const hasUnauthorizedKeys = inputKeys.some(key => !allowedKeys.includes(key));
        
        if (hasUnauthorizedKeys) {
          throw new GraphQLError("Employees are only authorized to update the shipment status.", {
            extensions: { code: 'FORBIDDEN' }
          });
        }
      }

      // Normally save to DB here
      return { ...shipment, ...input, updatedAt: new Date().toISOString() };
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
