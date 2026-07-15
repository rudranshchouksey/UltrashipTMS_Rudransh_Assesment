import { faker } from '@faker-js/faker';
import { Carrier, Shipment, ShipmentStatus, Shipper } from '../types/index.js';

export const shippers: Shipper[] = Array.from({ length: 10 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  contactEmail: faker.internet.email(),
  phone: faker.phone.number(),
}));

export const carriers: Carrier[] = Array.from({ length: 10 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  scacCode: faker.string.alpha(4).toUpperCase(),
  contactEmail: faker.internet.email(),
}));

export const shipments: Shipment[] = Array.from({ length: 50 }).map(() => {
  const baseRate = parseFloat(faker.finance.amount({ min: 500, max: 2000, dec: 2 }));
  const fuelSurcharge = parseFloat(faker.finance.amount({ min: 50, max: 300, dec: 2 }));
  
  return {
    id: faker.string.uuid(),
    shipperId: faker.helpers.arrayElement(shippers).id,
    carrierId: faker.helpers.arrayElement(carriers).id,
    origin: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip: faker.location.zipCode(),
      geo: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    },
    destination: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip: faker.location.zipCode(),
      geo: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    },
    status: faker.helpers.enumValue(ShipmentStatus),
    trackingNumber: faker.string.alphanumeric(10).toUpperCase(),
    rates: {
      baseRate,
      fuelSurcharge,
      totalRate: baseRate + fuelSurcharge,
    },
    pickupDate: faker.date.recent({ days: 10 }).toISOString(),
    deliveryDate: faker.date.soon({ days: 5 }).toISOString(),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const createShipmentRecord = (input: any): Shipment => {
  let shipper = shippers.find(s => s.name.toLowerCase() === input.shipperName.toLowerCase());
  if (!shipper) {
    shipper = {
      id: faker.string.uuid(),
      name: input.shipperName,
      contactEmail: faker.internet.email(),
      phone: faker.phone.number(),
    };
    shippers.push(shipper);
  }

  let carrier = carriers.find(c => c.name.toLowerCase() === input.carrierName.toLowerCase());
  if (!carrier) {
    carrier = {
      id: faker.string.uuid(),
      name: input.carrierName,
      scacCode: faker.string.alpha(4).toUpperCase(),
      contactEmail: faker.internet.email(),
    };
    carriers.push(carrier);
  }

  const newShipment: Shipment = {
    id: '#' + faker.string.hexadecimal({ length: 8, prefix: '' }).toUpperCase(),
    shipperId: shipper.id,
    carrierId: carrier.id,
    origin: input.origin,
    destination: input.destination,
    status: input.status,
    trackingNumber: input.trackingNumber,
    rates: {
      baseRate: input.rates.baseRate,
      fuelSurcharge: input.rates.fuelSurcharge,
      totalRate: input.rates.baseRate + input.rates.fuelSurcharge,
    },
    pickupDate: input.pickupDate,
    deliveryDate: input.deliveryDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  shipments.push(newShipment);
  return newShipment;
};

export const updateShipmentRecord = (id: string, input: any): Shipment => {
  const index = shipments.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error(`Shipment ${id} not found`);
  }

  const shipment = shipments[index];

  if (input.shipperName) {
    let shipper = shippers.find(s => s.name.toLowerCase() === input.shipperName.toLowerCase());
    if (!shipper) {
      shipper = {
        id: faker.string.uuid(),
        name: input.shipperName,
        contactEmail: faker.internet.email(),
        phone: faker.phone.number(),
      };
      shippers.push(shipper);
    }
    shipment.shipperId = shipper.id;
  }

  if (input.carrierName) {
    let carrier = carriers.find(c => c.name.toLowerCase() === input.carrierName.toLowerCase());
    if (!carrier) {
      carrier = {
        id: faker.string.uuid(),
        name: input.carrierName,
        scacCode: faker.string.alpha(4).toUpperCase(),
        contactEmail: faker.internet.email(),
      };
      carriers.push(carrier);
    }
    shipment.carrierId = carrier.id;
  }

  if (input.origin) shipment.origin = { ...shipment.origin, ...input.origin };
  if (input.destination) shipment.destination = { ...shipment.destination, ...input.destination };
  if (input.status) shipment.status = input.status;
  if (input.trackingNumber) shipment.trackingNumber = input.trackingNumber;
  if (input.pickupDate) shipment.pickupDate = input.pickupDate;
  if (input.deliveryDate) shipment.deliveryDate = input.deliveryDate;
  
  if (input.rates) {
    shipment.rates = {
      baseRate: input.rates.baseRate ?? shipment.rates.baseRate,
      fuelSurcharge: input.rates.fuelSurcharge ?? shipment.rates.fuelSurcharge,
      totalRate: (input.rates.baseRate ?? shipment.rates.baseRate) + (input.rates.fuelSurcharge ?? shipment.rates.fuelSurcharge),
    };
  }

  shipment.updatedAt = new Date().toISOString();
  return shipment;
};
