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