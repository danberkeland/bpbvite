// export const getUser = /* GraphQL */ `
//   query GetUser($sub: ID!) {
//     getUser2(id: $sub) {
//       name
//       email
//       phone
//       authClass
//       id
//       defaultLoc {
//         locNick
//         locName
//       }
//       locs {
//         items {
//           id
//           Type
//           authType
//           locNick
//           location {
//             locName
//           }
//           userID
//           createdAt
//           updatedAt
//         }
//       }
//       createdAt
//       updatedAt
//     }
//   }
// `;