import React from "react";
import { API, Amplify, Hub, graphqlOperation } from "aws-amplify";
import awsmobile from "./aws-exports";

import { BrowserRouter as Router } from "react-router-dom";

import Pages from "./AppStructure/Pages";
import Loader from "./AppStructure/Loader";
import { useSettingsStore } from "./Contexts/SettingsZustand";

import "./index.css";
import "./bpbTheme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
// import { checkUser } from "./AppStructure/Auth/AuthHelpers";


Amplify.configure(awsmobile);
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
        request
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;


export function App() {
  const isLoading = useSettingsStore((state) => state.isLoading);
  const setFormType = useSettingsStore((state) => state.setFormType);
  const setAuthClass = useSettingsStore((state) => state.setAuthClass);
  const setAccess = useSettingsStore((state) => state.setAccess);
  const setUser = useSettingsStore((state) => state.setUser);
  const setUserObject = useSettingsStore((state) => state.setUserObject);
  const setCurrentLoc = useSettingsStore((state) => state.setCurrentLoc);

  Hub.listen("auth",  async hubCapsule => {
    console.log("HUB:", JSON.stringify(hubCapsule, null, 2))
    switch (hubCapsule.payload.event) {
      case "signIn":
        console.log("New User Signed in");

        const { 
          username, 
          attributes, 
          signInUserSession 
        } = hubCapsule?.payload?.data ?? {}
        const { sub, email } = signInUserSession?.idToken?.payload ?? {}
        const jwtToken = signInUserSession.idToken.jwtToken
        console.log("PAYLOAD INFO:", username, attributes)

        console.log("sub", sub)
        console.log("email", email)
        
        let gqlResponse = await API.graphql(
          graphqlOperation(user2byEmail, { email })
        );

        const userItems = gqlResponse.data.User2byEmail.items
        const matchUser = 
          userItems.find(item => item.username === username) ?? userItems[0]

        const userObject = {
          ...hubCapsule.payload.data,
          attributes: {
            ...attributes,
            ["custom:name"]: matchUser.name,
            ["custom:authType"]: matchUser.authClass,
            ["custom:defLoc"]: matchUser.locNick
          }
        }

        console.log("custom attributes:", userObject.attributes)

        setUserObject(userObject)
        setAccess(jwtToken)
        setUser(matchUser.name)
        setAuthClass(matchUser.authClass)
        setCurrentLoc(matchUser.locNick)
        setFormType("signedIn");
        // window.location = "/";

        break;
      case "signOut":
        console.log("User Signed Out");

        setAccess("");
        setUserObject({});
        setUser("");
        setAuthClass("");
        setFormType("onNoUser");
        setCurrentLoc("");
        break;

      default:
        break;
    }
  });

  return (
    <div style={{backgroundColor: "hsl(37, 52%, 53%)"}}>

      {isLoading && <Loader />}

      <div className="headerBlockContainer">
      <div 
        className="headerBlock" 
        onClick={() => window.location = "/"}
        style={{cursor: "pointer"}}
      />
      </div>

      <Router>
        <Pages />
      </Router>
    </div>
  );
}

export default App;