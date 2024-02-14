import { Auth, Hub } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";

import { getLocation, getUser, listLocationUsers } from "../../graphql/queries";

const user2byEmail = /* GraphQL */ `
  query User2byEmail(
    $email: String!
   
    $sortDirection: ModelSortDirection
    $filter: ModelUser2FilterInput
    $limit: Int
    $nextToken: String
  ) {
    User2byEmail(
      email: $email
      
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        email
        username
        phone
        authClass
        subs
        locNick
        # defaultLoc {
        #   Type
        #   locNick
        #   locName
        #   zoneNick
        #   addr1
        #   addr2
        #   city
        #   zip
        #   email
        #   orderCnfEmail
        #   phone
        #   firstName
        #   lastName
        #   toBePrinted
        #   toBeEmailed
        #   printDuplicate
        #   terms
        #   invoicing
        #   latestFirstDeliv
        #   latestFinalDeliv
        #   webpageURL
        #   picURL
        #   gMap
        #   specialInstructions
        #   delivOrder
        #   qbID
        #   currentBalance
        #   isActive
        #   ttl
        #   requests
        #   createdAt
        #   updatedAt
        #   locationCreditAppId
        # }
        # locs {
        #   items {
        #     locNick
        #   }
        #   nextToken
        # }
        request
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

//  Checks for and, if exists, returns full Cognito object for user
export const checkUser = async () => {
  try {
    let cognitoUser = await Auth.currentAuthenticatedUser();

    let gqlResponse = await API.graphql(
      graphqlOperation(user2byEmail, {
        email: cognitoUser.attributes.email,
      })
    );
    // console.log(use)
    // console.log("currentAuthenticatedUser");
    // console.log("use.attributes.email", use.attributes.email);
    // console.log('use.attributes.username', use.username)
    // console.log("user2byEmail", gqlResponse.data.User2byEmail.items);

    const userItems = gqlResponse.data.User2byEmail.items
    const matchUser = userItems.find(item => 
      item.username === cognitoUser.username
    ) ?? userItems[0]

    cognitoUser.attributes["custom:name"] = matchUser.name;
    cognitoUser.attributes["custom:authType"] = matchUser.authClass;
    cognitoUser.attributes["custom:defLoc"] = matchUser.locNick;
    return cognitoUser;
  } catch (err) {
    console.log("Error AUthenticating User", err);
  }
};

export const checkUser2 = async (cognitoUser) => {
  try {
    // let cognitoUser = await Auth.currentAuthenticatedUser();

    let gqlResponse = await API.graphql(
      graphqlOperation(user2byEmail, {
        email: cognitoUser.attributes.email,
      })
    );

    const userItems = gqlResponse.data.User2byEmail.items
    const matchUser = userItems.find(item => 
      item.username === cognitoUser.username
    ) ?? userItems[0]

    cognitoUser.attributes["custom:name"] = matchUser.name
    cognitoUser.attributes["custom:authType"] = matchUser.authClass
    cognitoUser.attributes["custom:defLoc"] = matchUser.locNick
    return cognitoUser

  } catch (err) {
    console.log("Error AUthenticating User", err);
  }
};




// checks for and, if available, returns detailed user info from database
export const fetchUserDetails = async (sub) => {
  try {
    console.log("getUser");
    let user = await API.graphql(graphqlOperation(getUser, { sub: sub }));
    return user.data.getUser;
  } catch (error) {
    console.log("error on fetching UserDetails List", error);
  }
};

// creates listener for Auth events
export const setAuthListener = (
  setFormType,
  setAccess,
  setUser,
  setAuthClass,
  setUserObject
) => {
  Hub.listen("auth", (data) => {
    switch (data.payload.event) {
      case "signIn":
        console.log("New User Signed in");
        checkUser().then((use) => {
          setUserObject(use);
          setAccess(use.signInUserSession.accessToken.jwtToken);
          setUser(use.attributes["custom:name"]);
          setAuthClass(use.attributes["custom:authType"]);
          setFormType("signedIn");
        });

        break;
      case "signOut":
        console.log("User Signed Out");

        setAccess("");
        setUserObject({});
        setUser("");
        setAuthClass("");
        setFormType("onNoUser");
        break;

      default:
        setFormType("onNoUser");
        break;
    }
  });
};

// Signs out user
export const authSignOut = async (setFormType) => {
  await Auth.signOut();
  setFormType("onNoUser");
};

// Grabs Authentication level for combo of location and user(sub)
export const grabAuth = async (loc, sub) => {
  console.log("grabAuth");
  let info = await API.graphql(
    graphqlOperation(listLocationUsers, {
      filter: {
        locNick: { eq: loc },
        sub: { eq: sub },
      },
    })
  );
  console.log("authInfo", info);
  return info.data.listLocationUsers.items[0].authType;
};

// Returns List of Locations/User combo details
export const grabLocationUsers = async () => {
  console.log("listLocationUsers");
  const userList = await API.graphql(
    graphqlOperation(listLocationUsers, {
      limit: "1000",
    })
  );
  return userList;
};

export const grabFullLocation = async (selected) => {
  console.log("getLocation");

  console.log("selected", selected);
  const locInfo = await API.graphql(
    graphqlOperation(getLocation, { locNick: selected.locNick })
  );
  let fullInfo = locInfo.data.getLocation;
  return fullInfo;
};
