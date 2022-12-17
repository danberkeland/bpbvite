export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      locNick
      prodNick
      qty
      SO
      isWhole
      delivDate
      rate
      route
      isLate
      ItemNote
      createdOn
    }
  }
`;

export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      id
      locNick
      prodNick
      qty
      SO
      isWhole
      delivDate
      rate
      route
      isLate
      ItemNote
      createdOn
    }
  }
`;