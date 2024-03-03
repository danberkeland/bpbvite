// import { API, Auth, graphqlOperation } from "aws-amplify";
// import axios from "axios";
// // import { checkUser } from "./AppStructure/Auth/AuthHelpers";
// // import { sendCognitoSignupEmail } from "./Pages/Ordering/Orders/functions/sendEmailConfirmation";

// const API_cognitoUser =
//   "https://wj4mb7q3xi.execute-api.us-east-2.amazonaws.com/auth";


// const user2byEmail = /* GraphQL */ `
// query User2byEmail(
//   $email: String!
  
//   $sortDirection: ModelSortDirection
//   $filter: ModelUser2FilterInput
//   $limit: Int
//   $nextToken: String
// ) {
//   User2byEmail(
//     email: $email
    
//     sortDirection: $sortDirection
//     filter: $filter
//     limit: $limit
//     nextToken: $nextToken
//   ) {
//     items {
//       id
//       name
//       email
//       username
//       phone
//       authClass
//       subs
//       locNick
//       request
//       createdAt
//       updatedAt
//     }
//     nextToken
//   }
// }
// `;
// //  Checks for and, if exists, returns full Cognito object for user
// const checkUser = async () => {
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
// export const submitConfirm = async (props) => {
//   checkUser()
//     .then((user) => {
//       let event = {
//         token: user.signInUserSession.accessToken.jwtToken,
//         code: props.confirm,
//       };
//       try {
//         axios.post(API_cognitoUser + "/confirmcognitoemail", event);
//       } catch (err) {
//         console.log("Error confirming code", err);
//       }
//     })
//     .then((prod) => {
//       console.log("code confirm", prod);
//       return prod;
//     });
// };
  


// // NEW STUFF

// export const setNewPassword = async (props, fns) => {
//   const { setIsLoading, setFormType, userObject } = fns;
//   const { passwordConfirm } = props;
//   setIsLoading(true);
//   await Auth.completeNewPassword(userObject, passwordConfirm).then((use) => {
//     setFormType("onNoUser");
//     setIsLoading(false);
//   });
// };


// export const resetPassword = async (props, fns) => {
//   const { email, code, passwordNew } = props;
//   const { 
//     setIsLoading, 
//     setFormType, 
//     // userObject 
//   } = fns;
//   console.log("fns", fns);
//   console.log("props", props);
//   console.log("code", code);
//   console.log("email", email);
//   console.log("passwordNew", passwordNew);
//   Auth.forgotPasswordSubmit(email, code, passwordNew)
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err))
//     .then((use) => {
//       setFormType("onNoUser");
//       setIsLoading(false);
//     });
// };

// // Auth calls

// // export const submitAuth = async (props) => {
// // const {email, password, setIsLoading, setFormType, setShowMessage, setUserObject} = props;
// export const submitAuth = async (props, fns) => {
//   const { email, password } = props;
//   const {
//     setIsLoading,
//     setFormType,
//     // setShowMessage,
//     setUserObject,
//     // setResetPassword,
//   } = fns;

//   // const emailCheck = [
//   //   "danberkeland@gmail.com",
//   //   "eat@highstdeli.com",
//   //   "osos@highstdeli.com",
//   //   "slo@highstdeli.com",
//   //   "kreuzberg.mgr@poorbutsexy.biz",
//   //   "kraken.avila.mgr@poorbutsexy.biz",
//   //   "kraken.bonetti.mgr@poorbutsexy.biz",
//   //   "kraken.pismo.mgr@poorbutsexy.biz",
//   //   "loshel@live.com",
//   //   "reneerose11@gmail.com",
//   //   "tara@scoutcoffeeco.com",
//   //   "ryan@scoutcoffeeco.com",
//   //   "peter@sloprovisions.com",
//   //   "trixybliss@att.net",
//   //   "james@poorbutsexy.biz",
//   // ];

//   console.log("submitProps", props);

//   setIsLoading(true);
//   await Auth.signIn(email, password)
//     .then((use) => {
//       setUserObject(use);

//       if (use.challengeName === "NEW_PASSWORD_REQUIRED") {
//         setIsLoading(false);
//         setFormType("resetPassword");
//         return;
//       } else if (use.attributes.email_verified === false) {
//         setIsLoading(false);
//         setFormType("verifyEmail");
//         return;
//       } else {
//         setIsLoading(false);
//         setFormType("signedIn");
//       }
//     })
//     .catch((error) => {
//       if (error) {
//         /*
//         if (emailCheck.includes(email)){
//           setResetPassword(true)
//           return
//         }
//         setShowMessage(true);
//         */
//         setIsLoading(false);
//       }
//     });
// };
