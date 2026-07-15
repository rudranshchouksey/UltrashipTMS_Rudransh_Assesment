import type { Shipment } from '../types';
import { ShipmentStatus } from '../types';

const shipperNames = [
  'Pinnacle Logistics Co.', 'Frontier Supply Chain', 'Apex Freight Solutions',
  'Summit Distribution Inc.', 'NovaTrade Corp.', 'Vanguard Exports LLC',
  'Pacific Rim Traders', 'Continental Cargo Ltd.', 'Atlas Global Shipping',
  'EaglePoint Industries',
];

const carrierNames = [
  { name: 'FedEx Freight', scac: 'FXFE' },
  { name: 'XPO Logistics', scac: 'XPOL' },
  { name: 'Old Dominion', scac: 'ODFL' },
  { name: 'J.B. Hunt', scac: 'JBHT' },
  { name: 'Schneider National', scac: 'SNDR' },
  { name: 'Werner Enterprises', scac: 'WERN' },
  { name: 'Saia Inc.', scac: 'SAIA' },
  { name: 'Estes Express', scac: 'EXLA' },
  { name: 'YRC Worldwide', scac: 'YRCW' },
  { name: 'R+L Carriers', scac: 'RLCA' },
];

const cities = [
  { city: 'Los Angeles', state: 'CA', zip: '90001', lat: 33.9425, lng: -118.2551 },
  { city: 'Chicago', state: 'IL', zip: '60601', lat: 41.8781, lng: -87.6298 },
  { city: 'Houston', state: 'TX', zip: '77001', lat: 29.7604, lng: -95.3698 },
  { city: 'Phoenix', state: 'AZ', zip: '85001', lat: 33.4484, lng: -112.074 },
  { city: 'Philadelphia', state: 'PA', zip: '19101', lat: 39.9526, lng: -75.1652 },
  { city: 'San Antonio', state: 'TX', zip: '78201', lat: 29.4241, lng: -98.4936 },
  { city: 'San Diego', state: 'CA', zip: '92101', lat: 32.7157, lng: -117.1611 },
  { city: 'Dallas', state: 'TX', zip: '75201', lat: 32.7767, lng: -96.797 },
  { city: 'Atlanta', state: 'GA', zip: '30301', lat: 33.749, lng: -84.388 },
  { city: 'Miami', state: 'FL', zip: '33101', lat: 25.7617, lng: -80.1918 },
  { city: 'Seattle', state: 'WA', zip: '98101', lat: 47.6062, lng: -122.3321 },
  { city: 'Denver', state: 'CO', zip: '80201', lat: 39.7392, lng: -104.9903 },
  { city: 'Boston', state: 'MA', zip: '02101', lat: 42.3601, lng: -71.0589 },
  { city: 'Nashville', state: 'TN', zip: '37201', lat: 36.1627, lng: -86.7816 },
  { city: 'Portland', state: 'OR', zip: '97201', lat: 45.5152, lng: -122.6784 },
];

const streets = [
  '1200 Industrial Blvd', '5500 Commerce Dr', '890 Warehouse Ave',
  '3300 Logistics Pkwy', '7720 Distribution Ln', '445 Terminal Rd',
  '1025 Freight St', '6100 Supply Chain Way', '2200 Harbor Dr',
  '9800 Cargo Loop', '3150 Transit Blvd', '4400 Depot Ave',
  '7100 Gateway Rd', '550 Trade Center Blvd', '8250 Dockside Dr',
];

const statuses: ShipmentStatus[] = [
  ShipmentStatus.PENDING,
  ShipmentStatus.IN_TRANSIT,
  ShipmentStatus.IN_TRANSIT,
  ShipmentStatus.DELIVERED,
  ShipmentStatus.DELIVERED,
  ShipmentStatus.DELIVERED,
  ShipmentStatus.EXCEPTION,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function tracking(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function generateShipment(index: number): Shipment {
  const shipperName = pick(shipperNames);
  const carrier = pick(carrierNames);
  const originCity = pick(cities);
  let destCity = pick(cities);
  while (destCity.city === originCity.city) destCity = pick(cities);

  const baseRate = Math.round((500 + Math.random() * 1500) * 100) / 100;
  const fuelSurcharge = Math.round((50 + Math.random() * 250) * 100) / 100;

  const pickupDate = randomDate(new Date('2026-07-01'), new Date('2026-07-15'));
  const deliveryDate = randomDate(new Date('2026-07-16'), new Date('2026-07-30'));

  return {
    id: uid(),
    shipper: {
      id: `shipper-${(index % 10) + 1}`,
      name: shipperName,
      contactEmail: shipperName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10) + '@logistics.com',
      phone: `(${200 + (index % 800)}) ${100 + (index % 900)}-${1000 + (index % 9000)}`,
    },
    carrier: {
      id: `carrier-${(index % 10) + 1}`,
      name: carrier.name,
      scacCode: carrier.scac,
      contactEmail: carrier.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) + '@carrier.com',
    },
    origin: {
      address: pick(streets),
      city: originCity.city,
      state: originCity.state,
      zip: originCity.zip,
      geo: { latitude: originCity.lat, longitude: originCity.lng },
    },
    destination: {
      address: pick(streets),
      city: destCity.city,
      state: destCity.state,
      zip: destCity.zip,
      geo: { latitude: destCity.lat, longitude: destCity.lng },
    },
    status: pick(statuses),
    trackingNumber: tracking(),
    rates: {
      baseRate,
      fuelSurcharge,
      totalRate: Math.round((baseRate + fuelSurcharge) * 100) / 100,
    },
    pickupDate,
    deliveryDate,
    createdAt: randomDate(new Date('2026-01-01'), new Date('2026-06-30')),
    updatedAt: new Date().toISOString(),
  };
}

export const mockShipments: Shipment[] = Array.from({ length: 50 }, (_, i) => generateShipment(i));
