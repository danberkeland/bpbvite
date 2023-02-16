export const listTrainingsSimple = /* GraphQL */ `
  query ListTrainings(
    $id: String
    $filter: ModelTrainingFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTraining(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        role
        order
        heading
        instruction
      }
    }
  }
`;

export const listTrainingFull = /* GraphQL */ `
  query listTrainings {
    listTrainings {
        items {
          
          heading
          id
          instruction
          order
          role
          
        }
        nextToken
      }
  }
`;

export const getTrainingDetails = /* GraphQL */ `
  query GetTraining($id: ID!) {
    getTraining(id: $id) {
      id
      role
      order
      heading
      instruction
    }
  }
`;
