import { shipments } from '../db/mockDb.js';
import { Shipment, ShipmentStatus, SortDirection } from '../types/index.js';

interface FilterInput {
  status?: string[];
  carrierId?: string;
  pickupDateRange?: { start: string; end: string };
}

interface SortInput {
  field: string;
  direction: SortDirection;
}

export class ShipmentService {
  static async getShipments(
    first = 10,
    after?: string,
    filter?: FilterInput,
    orderBy?: SortInput
  ) {
    let result = [...shipments];

    // Apply Filters
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        // Handle exact status string match mapping to enum internally
        result = result.filter((s) => filter.status!.includes(s.status as string));
      }
      if (filter.carrierId) {
        result = result.filter((s) => s.carrierId === filter.carrierId);
      }
      if (filter.pickupDateRange) {
        const start = new Date(filter.pickupDateRange.start).getTime();
        const end = new Date(filter.pickupDateRange.end).getTime();
        result = result.filter((s) => {
          const p = new Date(s.pickupDate).getTime();
          return p >= start && p <= end;
        });
      }
    }

    // Apply Sorting
    if (orderBy) {
      result.sort((a, b) => {
        let valA: any, valB: any;
        switch (orderBy.field) {
          case 'id':
            valA = a.id;
            valB = b.id;
            break;
          case 'pickupDate':
            valA = new Date(a.pickupDate).getTime();
            valB = new Date(b.pickupDate).getTime();
            break;
          case 'status':
            valA = a.status;
            valB = b.status;
            break;
          case 'rate':
            valA = a.rates.totalRate;
            valB = b.rates.totalRate;
            break;
          default:
            valA = a.id;
            valB = b.id;
            break;
        }

        // Handle string comparison (alphanumeric sorting)
        if (typeof valA === 'string' && typeof valB === 'string') {
          const comparison = valA.localeCompare(valB);
          if (comparison !== 0) {
            return orderBy.direction === SortDirection.ASC ? comparison : -comparison;
          }
        } 
        // Handle numeric/date comparison
        else {
          if (valA < valB) return orderBy.direction === SortDirection.ASC ? -1 : 1;
          if (valA > valB) return orderBy.direction === SortDirection.ASC ? 1 : -1;
        }
        
        return 0;
      });
    }

    // Apply Cursor Pagination
    let startIndex = 0;
    if (after) {
      const decodedCursor = Buffer.from(after, 'base64').toString('ascii');
      const index = result.findIndex((s) => s.id === decodedCursor);
      if (index !== -1) {
        startIndex = index + 1;
      }
    }

    const paginatedItems = result.slice(startIndex, startIndex + first);
    const hasNextPage = startIndex + first < result.length;
    const hasPreviousPage = startIndex > 0;

    const edges = paginatedItems.map((item) => ({
      cursor: Buffer.from(item.id).toString('base64'),
      node: item,
    }));

    const startCursor = edges.length > 0 ? edges[0].cursor : null;
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      totalCount: result.length,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
      },
      edges,
    };
  }

  static async getShipmentById(id: string): Promise<Shipment | undefined> {
    return shipments.find((s) => s.id === id);
  }
}
