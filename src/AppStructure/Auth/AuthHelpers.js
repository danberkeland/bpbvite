// import { Auth } from "aws-amplify";
// import { API, graphqlOperation } from "aws-amplify";

// const user2byEmail = /* GraphQL */ `
//   query User2byEmail(
//     $email: String!
   
//     $sortDirection: ModelSortDirection
//     $filter: ModelUser2FilterInput
//     $limit: Int
//     $nextToken: String
//   ) {
//     User2byEmail(
//       email: $email
      
//       sortDirection: $sortDirection
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//     ) {
//       items {
//         id
//         name
//         email
//         username
//         phone
//         authClass
//         subs
//         locNick
//         request
//         createdAt
//         updatedAt
//       }
//       nextToken
//     }
//   }
// `;

// //  Checks for and, if exists, returns full Cognito object for user
// export const checkUser = async () => {
//   try {
//     let cognitoUser = await Auth.currentAuthenticatedUser();

//     let gqlResponse = await API.graphql(
//       graphqlOperation(user2byEmail, {
//         email: cognitoUser.attributes.email,
//       })
//     );
//     console.log("cog resp:", JSON.stringify(cognitoUser, null, 2))
//     console.log("gql resp:", JSON.stringify(gqlResponse, null, 2))

//     const userItems = gqlResponse.data.User2byEmail.items
//     const matchUser = userItems.find(item => 
//       item.username === cognitoUser.username
//     ) ?? userItems[0]

//     cognitoUser.attributes["custom:name"] = matchUser.name;
//     cognitoUser.attributes["custom:authType"] = matchUser.authClass;
//     cognitoUser.attributes["custom:defLoc"] = matchUser.locNick;
//     return cognitoUser;
    
//   } catch (err) {
//     console.log("Error AUthenticating User", err);
//   }
// };