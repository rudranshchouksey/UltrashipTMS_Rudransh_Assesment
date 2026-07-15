export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  EXCEPTION = 'EXCEPTION',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ShipmentSortField {
  PICKUP_DATE = 'PICKUP_DATE',
  DELIVERY_DATE = 'DELIVERY_DATE',
  STATUS = 'STATUS',
  TOTAL_RATE = 'TOTAL_RATE',
}

export interface User {
  id: string;
  role: Role;
}

export interface GraphQLContext {
  user?: User;
  dataLoaders: ReturnType<typeof import('../dataloaders/index.js').createDataLoaders>;
}

// Database Models (Mock)
export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zip: string;
  geo?: GeoCoordinate;
}

export interface Rates {
  baseRate: number;
  fuelSurcharge: number;
  totalRate: number;
}

export interface Shipper {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
}

export interface Carrier {
  id: string;
  name: string;
  scacCode: string;
  contactEmail: string;
}

export interface Shipment {
  id: string;
  shipperId: string;
  carrierId: string;
  origin: Address;
  destination: Address;
  status: ShipmentStatus;
  trackingNumber?: string;
  rates: Rates;
  pickupDate: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}
