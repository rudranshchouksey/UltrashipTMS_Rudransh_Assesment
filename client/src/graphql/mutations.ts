import { gql } from '@apollo/client';

export const CREATE_SHIPMENT_MUTATION = gql`
  mutation CreateShipment($input: AddShipmentInput!) {
    createShipment(input: $input) {
      id
      status
      trackingNumber
      rates {
        baseRate
        fuelSurcharge
        totalRate
      }
      pickupDate
      deliveryDate
      createdAt
      updatedAt
      shipper {
        id
        name
        contactEmail
        phone
      }
      carrier {
        id
        name
        scacCode
        contactEmail
      }
      origin {
        address
        city
        state
        zip
      }
      destination {
        address
        city
        state
        zip
      }
    }
  }
`;

export const UPDATE_SHIPMENT_MUTATION = gql`
  mutation UpdateShipment($input: UpdateShipmentInput!) {
    updateShipment(input: $input) {
      id
      status
      trackingNumber
      rates {
        baseRate
        fuelSurcharge
        totalRate
      }
      pickupDate
      deliveryDate
      updatedAt
      shipper {
        id
        name
      }
      carrier {
        id
        name
      }
      origin {
        address
        city
        state
        zip
      }
      destination {
        address
        city
        state
        zip
      }
    }
  }
`;
