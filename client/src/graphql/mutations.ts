import { gql } from '@apollo/client';

export const UPDATE_SHIPMENT_STATUS = gql`
  mutation UpdateShipmentStatus($id: ID!, $input: UpdateShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      id
      status
      updatedAt
    }
  }
`;
