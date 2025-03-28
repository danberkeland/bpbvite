import * as attributes from '../standardAttributes.js'



export const createDoughBackup = /* GraphQL */ `
  mutation CreateDoughBackup(
    $input: CreateDoughBackupInput!
    $condition: ModelDoughBackupConditionInput
  ) {
    createDoughBackup(input: $input, condition: $condition) {
      ${attributes.doughBackupAttributes}
    }
  }
`;
export const updateDoughBackup = /* GraphQL */ `
  mutation UpdateDoughBackup(
    $input: UpdateDoughBackupInput!
    $condition: ModelDoughBackupConditionInput
  ) {
    updateDoughBackup(input: $input, condition: $condition) {
      ${attributes.doughBackupAttributes}
    }
  }
`;
export const deleteDoughBackup = /* GraphQL */ `
  mutation DeleteDoughBackup(
    $input: DeleteDoughBackupInput!
    $condition: ModelDoughBackupConditionInput
  ) {
    deleteDoughBackup(input: $input, condition: $condition) {
      ${attributes.doughBackupAttributes}
    }
  }
`;



export const createDoughComponentBackup = /* GraphQL */ `
  mutation CreateDoughComponentBackup(
    $input: CreateDoughComponentBackupInput!
    $condition: ModelDoughComponentBackupConditionInput
  ) {
    createDoughComponentBackup(input: $input, condition: $condition) {
      ${attributes.doughComponentBackupAttributes}
    }
  }
`;
export const updateDoughComponentBackup = /* GraphQL */ `
  mutation UpdateDoughComponentBackup(
    $input: UpdateDoughComponentBackupInput!
    $condition: ModelDoughComponentBackupConditionInput
  ) {
    updateDoughComponentBackup(input: $input, condition: $condition) {
      ${attributes.doughComponentBackupAttributes}
    }
  }
`;
export const deleteDoughComponentBackup = /* GraphQL */ `
  mutation DeleteDoughComponentBackup(
    $input: DeleteDoughComponentBackupInput!
    $condition: ModelDoughComponentBackupConditionInput
  ) {
    deleteDoughComponentBackup(input: $input, condition: $condition) {
      ${attributes.doughComponentBackupAttributes}
    }
  }
`;



export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      ${attributes.userAttributes}
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      ${attributes.userAttributes}
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      ${attributes.userAttributes}
    }
  }
`;
export const createUser2 = /* GraphQL */ `
  mutation CreateUser2(
    $input: CreateUser2Input!
    $condition: ModelUser2ConditionInput
  ) {
    createUser2(input: $input, condition: $condition) {
      ${attributes.user2Attributes}
    }
  }
`;
export const updateUser2 = /* GraphQL */ `
  mutation UpdateUser2(
    $input: UpdateUser2Input!
    $condition: ModelUser2ConditionInput
  ) {
    updateUser2(input: $input, condition: $condition) {
      ${attributes.user2Attributes}
    }
  }
`;
export const deleteUser2 = /* GraphQL */ `
  mutation DeleteUser2(
    $input: DeleteUser2Input!
    $condition: ModelUser2ConditionInput
  ) {
    deleteUser2(input: $input, condition: $condition) {
      ${attributes.user2Attributes}
    }
  }
`;



export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
      ${attributes.locationAttributes}
    }
  }
`;
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
      ${attributes.locationAttributes}
    }
  }
`;
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
      ${attributes.locationAttributes}
    }
  }
`;



export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
      ${attributes.productAttributes}
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
      ${attributes.productAttributes}
    }
  }
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
      ${attributes.productAttributes}
    }
  }
`;



export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      ${attributes.orderAttributes}
    }
  }
`;
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      ${attributes.orderAttributes}
    }
  }
`;
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
      ${attributes.orderAttributes}
    }
  }
`;



export const createStanding = /* GraphQL */ `
  mutation CreateStanding(
    $input: CreateStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    createStanding(input: $input, condition: $condition) {
      ${attributes.standingAttributes}
    }
  }
`;
export const updateStanding = /* GraphQL */ `
  mutation UpdateStanding(
    $input: UpdateStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    updateStanding(input: $input, condition: $condition) {
      ${attributes.standingAttributes}
    }
  }
`;
export const deleteStanding = /* GraphQL */ `
  mutation DeleteStanding(
    $input: DeleteStandingInput!
    $condition: ModelStandingConditionInput
  ) {
    deleteStanding(input: $input, condition: $condition) {
      ${attributes.standingAttributes}
    }
  }
`;



export const createZone = /* GraphQL */ `
  mutation CreateZone(
    $input: CreateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    createZone(input: $input, condition: $condition) {
      ${attributes.zoneAttributes}
    }
  }
`;
export const updateZone = /* GraphQL */ `
  mutation UpdateZone(
    $input: UpdateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    updateZone(input: $input, condition: $condition) {
      ${attributes.zoneAttributes}
    }
  }
`;
export const deleteZone = /* GraphQL */ `
  mutation DeleteZone(
    $input: DeleteZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    deleteZone(input: $input, condition: $condition) {
      ${attributes.zoneAttributes}
    }
  }
`;



export const createRoute = /* GraphQL */ `
  mutation CreateRoute(
    $input: CreateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    createRoute(input: $input, condition: $condition) {
      ${attributes.routeAttributes}
    }
  }
`;
export const updateRoute = /* GraphQL */ `
  mutation UpdateRoute(
    $input: UpdateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    updateRoute(input: $input, condition: $condition) {
      ${attributes.routeAttributes}
    }
  }
`;
export const deleteRoute = /* GraphQL */ `
  mutation DeleteRoute(
    $input: DeleteRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    deleteRoute(input: $input, condition: $condition) {
      ${attributes.routeAttributes}
    }
  }
`;



export const createInfoQBAuth = /* GraphQL */ `
  mutation CreateInfoQBAuth(
    $input: CreateInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    createInfoQBAuth(input: $input, condition: $condition) {
      ${attributes.infoQBAuthAttributes}
    }
  }
`;
export const updateInfoQBAuth = /* GraphQL */ `
  mutation UpdateInfoQBAuth(
    $input: UpdateInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    updateInfoQBAuth(input: $input, condition: $condition) {
      ${attributes.infoQBAuthAttributes}
    }
  }
`;
export const deleteInfoQBAuth = /* GraphQL */ `
  mutation DeleteInfoQBAuth(
    $input: DeleteInfoQBAuthInput!
    $condition: ModelInfoQBAuthConditionInput
  ) {
    deleteInfoQBAuth(input: $input, condition: $condition) {
      ${attributes.infoQBAuthAttributes}
    }
  }
`;



export const createNotes = /* GraphQL */ `
  mutation CreateNotes(
    $input: CreateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    createNotes(input: $input, condition: $condition) {
      ${attributes.notesAttributes}
    }
  }
`;
export const updateNotes = /* GraphQL */ `
  mutation UpdateNotes(
    $input: UpdateNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    updateNotes(input: $input, condition: $condition) {
      ${attributes.notesAttributes}
    }
  }
`;
export const deleteNotes = /* GraphQL */ `
  mutation DeleteNotes(
    $input: DeleteNotesInput!
    $condition: ModelNotesConditionInput
  ) {
    deleteNotes(input: $input, condition: $condition) {
      ${attributes.notesAttributes}
    }
  }
`;



export const createTemplateProd = /* GraphQL */ `
  mutation CreateTemplateProd(
    $input: CreateTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    createTemplateProd(input: $input, condition: $condition) {
      ${attributes.templateProdAttributes}
    }
  }
`;
export const updateTemplateProd = /* GraphQL */ `
  mutation UpdateTemplateProd(
    $input: UpdateTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    updateTemplateProd(input: $input, condition: $condition) {
      ${attributes.templateProdAttributes}
    }
  }
`;
export const deleteTemplateProd = /* GraphQL */ `
  mutation DeleteTemplateProd(
    $input: DeleteTemplateProdInput!
    $condition: ModelTemplateProdConditionInput
  ) {
    deleteTemplateProd(input: $input, condition: $condition) {
      ${attributes.templateProdAttributes}
    }
  }
`;



export const createProdsNotAllowed = /* GraphQL */ `
  mutation CreateProdsNotAllowed(
    $input: CreateProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    createProdsNotAllowed(input: $input, condition: $condition) {
      ${attributes.prodsNotAllowedAttributes}
    }
  }
`;
export const updateProdsNotAllowed = /* GraphQL */ `
  mutation UpdateProdsNotAllowed(
    $input: UpdateProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    updateProdsNotAllowed(input: $input, condition: $condition) {
      ${attributes.prodsNotAllowedAttributes}
    }
  }
`;
export const deleteProdsNotAllowed = /* GraphQL */ `
  mutation DeleteProdsNotAllowed(
    $input: DeleteProdsNotAllowedInput!
    $condition: ModelProdsNotAllowedConditionInput
  ) {
    deleteProdsNotAllowed(input: $input, condition: $condition) {
      ${attributes.prodsNotAllowedAttributes}
    }
  }
`;



export const createZoneRoute = /* GraphQL */ `
  mutation CreateZoneRoute(
    $input: CreateZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    createZoneRoute(input: $input, condition: $condition) {
      ${attributes.zoneRouteAttributes}
    }
  }
`;
export const updateZoneRoute = /* GraphQL */ `
  mutation UpdateZoneRoute(
    $input: UpdateZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    updateZoneRoute(input: $input, condition: $condition) {
      ${attributes.zoneRouteAttributes}
    }
  }
`;
export const deleteZoneRoute = /* GraphQL */ `
  mutation DeleteZoneRoute(
    $input: DeleteZoneRouteInput!
    $condition: ModelZoneRouteConditionInput
  ) {
    deleteZoneRoute(input: $input, condition: $condition) {
      ${attributes.zoneRouteAttributes}
    }
  }
`;



export const createLocationUser = /* GraphQL */ `
  mutation CreateLocationUser(
    $input: CreateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    createLocationUser(input: $input, condition: $condition) {
      ${attributes.locationUserAttributes}
    }
  }
`;
export const updateLocationUser = /* GraphQL */ `
  mutation UpdateLocationUser(
    $input: UpdateLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    updateLocationUser(input: $input, condition: $condition) {
      ${attributes.locationUserAttributes}
    }
  }
`;
export const deleteLocationUser = /* GraphQL */ `
  mutation DeleteLocationUser(
    $input: DeleteLocationUserInput!
    $condition: ModelLocationUserConditionInput
  ) {
    deleteLocationUser(input: $input, condition: $condition) {
      ${attributes.locationUserAttributes}
    }
  }
`;
export const createLocationUser2 = /* GraphQL */ `
  mutation CreateLocationUser2(
    $input: CreateLocationUser2Input!
    $condition: ModelLocationUser2ConditionInput
  ) {
    createLocationUser2(input: $input, condition: $condition) {
      ${attributes.locationUser2Attributes}
    }
  }
`;
export const updateLocationUser2 = /* GraphQL */ `
  mutation UpdateLocationUser2(
    $input: UpdateLocationUser2Input!
    $condition: ModelLocationUser2ConditionInput
  ) {
    updateLocationUser2(input: $input, condition: $condition) {
      ${attributes.locationUser2Attributes}
    }
  }
`;
export const deleteLocationUser2 = /* GraphQL */ `
  mutation DeleteLocationUser2(
    $input: DeleteLocationUser2Input!
    $condition: ModelLocationUser2ConditionInput
  ) {
    deleteLocationUser2(input: $input, condition: $condition) {
      ${attributes.locationUser2Attributes}
    }
  }
`;



export const createAltPricing = /* GraphQL */ `
  mutation CreateAltPricing(
    $input: CreateAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    createAltPricing(input: $input, condition: $condition) {
      ${attributes.altPricingAttributes}
    }
  }
`;
export const updateAltPricing = /* GraphQL */ `
  mutation UpdateAltPricing(
    $input: UpdateAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    updateAltPricing(input: $input, condition: $condition) {
      ${attributes.altPricingAttributes}
    }
  }
`;
export const deleteAltPricing = /* GraphQL */ `
  mutation DeleteAltPricing(
    $input: DeleteAltPricingInput!
    $condition: ModelAltPricingConditionInput
  ) {
    deleteAltPricing(input: $input, condition: $condition) {
      ${attributes.altPricingAttributes}
    }
  }
`;



export const createAltLeadTime = /* GraphQL */ `
  mutation CreateAltLeadTime(
    $input: CreateAltLeadTimeInput!
    $condition: ModelAltLeadTimeConditionInput
  ) {
    createAltLeadTime(input: $input, condition: $condition) {
      ${attributes.altLeadTimeAttributes}
    }
  }
`;
export const updateAltLeadTime = /* GraphQL */ `
  mutation UpdateAltLeadTime(
    $input: UpdateAltLeadTimeInput!
    $condition: ModelAltLeadTimeConditionInput
  ) {
    updateAltLeadTime(input: $input, condition: $condition) {
      ${attributes.altLeadTimeAttributes}
    }
  }
`;
export const deleteAltLeadTime = /* GraphQL */ `
  mutation DeleteAltLeadTime(
    $input: DeleteAltLeadTimeInput!
    $condition: ModelAltLeadTimeConditionInput
  ) {
    deleteAltLeadTime(input: $input, condition: $condition) {
      ${attributes.altLeadTimeAttributes}
    }
  }
`;



export const createTraining = /* GraphQL */ `
  mutation CreateTraining(
    $input: CreateTrainingInput!
    $condition: ModelTrainingConditionInput
  ) {
    createTraining(input: $input, condition: $condition) {
      ${attributes.trainingAttributes}
    }
  }
`;
export const updateTraining = /* GraphQL */ `
  mutation UpdateTraining(
    $input: UpdateTrainingInput!
    $condition: ModelTrainingConditionInput
  ) {
    updateTraining(input: $input, condition: $condition) {
      ${attributes.trainingAttributes}
    }
  }
`;
export const deleteTraining = /* GraphQL */ `
  mutation DeleteTraining(
    $input: DeleteTrainingInput!
    $condition: ModelTrainingConditionInput
  ) {
    deleteTraining(input: $input, condition: $condition) {
      ${attributes.trainingAttributes}
    }
  }
`;



export const createLocationProductOverride = /* GraphQL */ `
  mutation CreateLocationProductOverride(
    $input: CreateLocationProductOverrideInput!
    $condition: ModelLocationProductOverrideConditionInput
  ) {
    createLocationProductOverride(input: $input, condition: $condition) {
      ${attributes.locationProductOverrideAttributes}
    }
  }
`;
export const updateLocationProductOverride = /* GraphQL */ `
  mutation UpdateLocationProductOverride(
    $input: UpdateLocationProductOverrideInput!
    $condition: ModelLocationProductOverrideConditionInput
  ) {
    updateLocationProductOverride(input: $input, condition: $condition) {
      ${attributes.locationProductOverrideAttributes}
    }
  }
`;
export const deleteLocationProductOverride = /* GraphQL */ `
  mutation DeleteLocationProductOverride(
    $input: DeleteLocationProductOverrideInput!
    $condition: ModelLocationProductOverrideConditionInput
  ) {
    deleteLocationProductOverride(input: $input, condition: $condition) {
      ${attributes.locationProductOverrideAttributes}
    }
  }
`;