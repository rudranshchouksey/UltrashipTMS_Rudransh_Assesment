import { gql } from '@apollo/client';

export const GET_SHIPMENTS = gql`
  query GetShipments(
    $first: Int
    $after: String
    $filter: ShipmentFilterInput
    $sort: [ShipmentSortInput!]
  ) {
    shipments(first: $first, after: $after, filter: $filter, sort: $sort) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
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
            geo {
              latitude
              longitude
            }
          }
          destination {
            address
            city
            state
            zip
            geo {
              latitude
              longitude
            }
          }
        }
      }
    }
  }
`;
