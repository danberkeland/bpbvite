export const customCreateProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
      Type
      prodName
      prodNick
      
      createdAt
      updatedAt
    }
  }
`;

export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
      locNick
      createdAt
    }
  }
`;
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
      locNick
      createdAt
    }
  }
`;
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
      locNick
      createdAt
    }
  }
`;