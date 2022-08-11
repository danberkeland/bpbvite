/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo2 = /* GraphQL */ `
  query GetTodo2($id: ID!) {
    getTodo2(id: $id) {
      id
      name
      description
      nickName
      createdAt
      updatedAt
    }
  }
`;
export const listTodo2s = /* GraphQL */ `
  query ListTodo2s(
    $filter: ModelTodo2FilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodo2s(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        nickName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
