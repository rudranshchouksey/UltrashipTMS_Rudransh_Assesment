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
