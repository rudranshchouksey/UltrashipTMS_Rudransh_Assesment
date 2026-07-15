import { shipments } from '../db/mockDb.js';
import { Shipment, ShipmentStatus, SortDirection, ShipmentSortField } from '../types/index.js';

interface FilterInput {
  status?: ShipmentStatus[];
  carrierId?: string;
  pickupDateRange?: { start: string; end: string };
}

interface SortInput {
  field: ShipmentSortField;
  direction: SortDirection;
}

export class ShipmentService {
  static async getShipments(
    first = 10,
    after?: string,
    filter?: FilterInput,
    sort?: SortInput[]
  ) {
    let result = [...shipments];

    // Apply Filters
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        result = result.filter((s) => filter.status!.includes(s.status));
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
    if (sort && sort.length > 0) {
      result.sort((a, b) => {
        for (const s of sort) {
          let valA: any, valB: any;
          switch (s.field) {
            case ShipmentSortField.PICKUP_DATE:
              valA = new Date(a.pickupDate).getTime();
              valB = new Date(b.pickupDate).getTime();
              break;
            case ShipmentSortField.DELIVERY_DATE:
              valA = a.deliveryDate ? new Date(a.deliveryDate).getTime() : 0;
              valB = b.deliveryDate ? new Date(b.deliveryDate).getTime() : 0;
              break;
            case ShipmentSortField.STATUS:
              valA = a.status;
              valB = b.status;
              break;
            case ShipmentSortField.TOTAL_RATE:
              valA = a.rates.totalRate;
              valB = b.rates.totalRate;
              break;
          }

          if (valA < valB) return s.direction === SortDirection.ASC ? -1 : 1;
          if (valA > valB) return s.direction === SortDirection.ASC ? 1 : -1;
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
