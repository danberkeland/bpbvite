export const createTraining = /* GraphQL */ `
  mutation CreateTraining(
    $input: CreateTrainingInput!
    $condition: ModelOrderConditionInput
  ) {
    createTraining(input: $input, condition: $condition) {
      id
      role
      order
      heading
      instruction
    }
  }
`;
export const updateTraining = /* GraphQL */ `
  mutation UpdateTraining(
    $input: UpdateTrainingInput!
    $condition: ModelOrderConditionInput
  ) {
    updateTraining(input: $input, condition: $condition) {
      id
      role
      order
      heading
      instruction
    }
  }
`;
export const deleteTraining = /* GraphQL */ `
  mutation DeleteTraining(
    $input: DeleteTrainingInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteTraining(input: $input, condition: $condition) {
      id
      order
      role
      heading
      instruction
    }
  }
`;