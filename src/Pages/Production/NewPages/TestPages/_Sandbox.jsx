// import { useSettingsStore } from "../../../../Contexts/SettingsZustand";

import { useLocations } from "../../../../data/location/useLocations";
import { useLocationUser2s } from "../../../../data/locationUser2/useLocationUser2";
import { useUser2s } from "../../../../data/user2/useUser2s";
import { groupByObject } from "../../../../utils/collectionFns/groupByObject";
import { keyBy } from "../../../../utils/collectionFns/keyBy";
import { useMemo } from "react";
import { mapValues } from "../../../../utils/objectFns";
import { useSquareOrders } from "../../../../data/square/fetchSquareOrders";
// import { useSyncSquareOrders } from "../../../../core/checkForUpdates";

export const Sandbox = () => {
  // const formType = useSettingsStore((state) => state.formType)
  // const setFormType = useSettingsStore((state) => state.setFormType);

  // setFormType("verifyEmail")

  // console.log("formtype", formType)
  // const { data:LCU } = useLocationUser2s({ shouldFetch: true })
  // const { data:LOC } = useLocations({ shouldFetch: true })
  // const { data:USR } = useUser2s({ shouldFetch: true })

  // const locations = useMemo(() => !!LOC ? keyBy(LOC, L => L.locNick) : {}, [LOC])
  // const users = useMemo(() => !!USR ? keyBy(USR, U => U.id) : {}, [USR])

 

  // const [validLCU, invalidLCU] = useMemo(() => {
  //   if (!LCU || !locations || ! users) return [[],[]]

  //   const valid   = LCU?.filter(lcu => !!locations?.[lcu.locNick] && !!users[lcu.userID]) ?? []
  //   const invalid = LCU?.filter(lcu => !locations?.[lcu.locNick] || !users[lcu.userID]) ?? []
  //   return [valid, invalid]

  // }, [LCU, locations, users])

  // console.log(validLCU, invalidLCU)
  // if (invalidLCU.length) console.warn("Invalid Location User(s):", invalidLCU)

  // const tableData = validLCU.map(lcu => ({ 
  //   ...lcu,
  //   location: locations[lcu.locNick],
  //   user: users[lcu.userID]
  // })).sort(compareBy(row => row.user.name)).sort(compareBy(row => row.locNick))


  // User info is jank thanks to "sign in with google".
  // Signing in this way generates a new user. We need to link it to the user
  // we created that has default-location & auth settings. Our solution is to
  // link these records by email. Not sure how exactly, but it seems some
  // action is taken to ensure that user records have the same username and
  // authClass. 
  //
  // We can avoid the complexity of multiple user records by setting up
  // new users with username === email
  //
  // Auth is technically tracked in 2 places; the user 
  // ('authClass', a category string) and the locationUser 
  // ('authType', a number), but as of now only authClass is used.
  //
  // Managing a created user's settings involves coordinating with Cognito.
  // Managing existing user stuff involves editing their locationUser items.
  // const usersByEmailClass = groupByObject(USR??[], user => user.email)
  // const _withLCU = mapValues(usersByEmailClass, equivalentUsers => {
  //   const { email, authClass, name, username } = equivalentUsers[0]
    
  //   return {
  //     email, authClass, name, username,
  //     user2s: equivalentUsers,
  //     locationUsers: validLCU.filter(lcu => lcu.userID.endsWith(equivalentUsers[0].email)) // feels potentially buggy
  //   }
  // })

  // console.log("By Email:", usersByEmailClass)
  // console.log("User Email eqiv Classes:", _withLCU)


  // const legacyFormatData = validLCU.map(lcu => ({
  //   authClass: users[lcu.userID].authClass,
  //   custName: users[lcu.userID].name,
  //   defLoc: users[lcu.userID].locNick, // maybe?
  //   email: users[lcu.userID].email,
  //   phone,
  //   sub,
  //   username,
  //   customers,
  //   locations,

  // }))

  // const subgroupHeaderTemplate = (data) => {

  //   return (<>
  //     <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
  //       {data.location.locName}
  //     </div>
  //     <div style={{ fontSize: ".9rem", fontFamily: "monospace" }}>
  //       {data.locNick}
  //     </div>
  //   </>)
  // }


  // const { data:squareOrders } = useSquareOrders({ shouldFetch: true })

  // console.log("squareOrders", squareOrders)

  // useSyncSquareOrders()
  
  return (<>

    <h1>Sandbox</h1>

    {/* <DataTable
      value={ tableData ?? []}
      responsiveLayout="scroll"
      scrollable
      scrollHeight="600px"
      rowGroupMode="subheader" 
      rowGroupHeaderTemplate={subgroupHeaderTemplate}
      groupRowsBy="location.locName"
      size="small"

    > */}
      {/* <Column sortable field="location.locName" header="Location" /> */}
      {/* <Column field="user.name"     header="User Display Name" style={{width: "6rem"}}/> */}
      {/* <Column field="user.username" header="username (for sign-in)" /> */}
      {/* <Column field="user.email"    header="email" /> */}

    {/* </DataTable> */}
    
  </>)
}

