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

export const ShipmentStatus = {
  PENDING: 'PENDING',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  EXCEPTION: 'EXCEPTION',
} as const;

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

export interface Shipment {
  id: string;
  shipper: Shipper;
  carrier: Carrier;
  origin: Address;
  destination: Address;
  status: ShipmentStatus;
  trackingNumber: string;
  rates: Rates;
  pickupDate: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'grid' | 'tile';
export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface MenuItem {
  label: string;
  icon: string;
  children?: { label: string; href: string }[];
  href?: string;
}
