export const typeDefs = `#graphql
  enum Role {
    ADMIN
    EMPLOYEE
  }

  enum ShipmentStatus {
    PENDING
    IN_TRANSIT
    DELIVERED
    EXCEPTION
  }

  enum SortDirection {
    ASC
    DESC
  }


  type GeoCoordinate {
    latitude: Float!
    longitude: Float!
  }

  type Address {
    address: String!
    city: String!
    state: String!
    zip: String!
    geo: GeoCoordinate
  }

  type Rates {
    baseRate: Float!
    fuelSurcharge: Float!
    totalRate: Float!
  }

  type Shipper {
    id: ID!
    name: String!
    contactEmail: String!
    phone: String!
  }

  type Carrier {
    id: ID!
    name: String!
    scacCode: String!
    contactEmail: String!
  }

  type Shipment {
    id: ID!
    shipper: Shipper!
    carrier: Carrier!
    origin: Address!
    destination: Address!
    status: ShipmentStatus!
    trackingNumber: String
    rates: Rates!
    pickupDate: String!
    deliveryDate: String
    createdAt: String!
    updatedAt: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type ShipmentEdge {
    cursor: String!
    node: Shipment!
  }

  type ShipmentConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [ShipmentEdge!]!
  }

  input DateRangeInput {
    start: String!
    end: String!
  }

  input ShipmentFilterInput {
    status: [ShipmentStatus!]
    carrierId: ID
    pickupDateRange: DateRangeInput
  }

  input ShipmentSortInput {
    field: String!
    direction: SortDirection!
  }

  type Query {
    shipment(id: ID!): Shipment
    
    shipments(
      first: Int
      after: String
      filter: ShipmentFilterInput
      orderBy: ShipmentSortInput
    ): ShipmentConnection!
  }

  input AddressInput {
    address: String!
    city: String!
    state: String!
    zip: String!
    latitude: Float
    longitude: Float
  }

  input RatesInput {
    baseRate: Float!
    fuelSurcharge: Float!
  }

  input AddShipmentInput {
    shipperName: String!
    carrierName: String!
    origin: AddressInput!
    destination: AddressInput!
    status: ShipmentStatus = PENDING
    trackingNumber: String!
    rates: RatesInput!
    pickupDate: String!
    deliveryDate: String!
  }

  input UpdateShipmentInput {
    id: ID!
    shipperName: String
    carrierName: String
    origin: AddressInput
    destination: AddressInput
    status: ShipmentStatus
    trackingNumber: String
    rates: RatesInput
    pickupDate: String
    deliveryDate: String
  }

  type Mutation {
    createShipment(input: AddShipmentInput!): Shipment!
    updateShipment(input: UpdateShipmentInput!): Shipment!
    deleteShipment(id: ID!): Boolean!
  }
`;
