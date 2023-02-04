// Hello from Orders8,
// I think I have settled on a best practice of being as minimal with
// custom data hooks as possible. It is important to note that the data
// returned from useSWR is carefully cached so that "if nothing changes,"
// the data returned is the SAME as the old data (as in, it points to the
// same memory address so that we can say 'old data' === 'new data'. If we
// mess with the data at all before returning it we run the risk of creating
// and returning a copy of the data (with a new location in memory), which
// would falsely signal a change.
//
// In particular, whenever we have something like useEffect watching
// and responding to changes in our cached data, we virtually eliminate
// unintended side effects (e.g. needless re-renders) by putting the
// untouched swr data in the dependency array and moving all
// transformations inside the useEffect.
//
///The only 'safe' manipulation I've tested so far is returning a
// nested part of the original data. This makes sense because a
// nested property key just points to the address in memory. Since
// swr returns the same object when nothing changes, the nested key
// should also point to the same address, so useEffects should also
// not detect changes.

import React, { useState } from "react";
import { useSettingsStore } from "../../../../Contexts/SettingsZustand";

import { getWorkingDateTime } from "./Functions/dateAndTime";

import { OrderDisplay } from "./Components/OrderDisplay";
import { OrderSelection } from "./Components/OrderSelection";
// import { RadioButton } from "primereact/radiobutton";
import { TabMenu } from "primereact/tabmenu";

import { StandingDisplay } from "./Components/StandingDisplay";
import { AdminControls } from "./Components/AdminControls";
// import { Button } from "primereact/button";

const Orders9 = () => {
  const globalState = useSettingsStore();
  const user = {
    name: globalState.user,
    authClass: globalState.authClass,
    location: globalState.currentLoc,
  };

  // Admin Settings
  const [location, setLocation] = useState(
    user.location !== "backporch" ? user.location : null
  );
  const [isWhole, setIsWhole] = useState(true);
  const [isStand, setIsStand] = useState(true);
  const adminSettings = {
    location,
    setLocation,
    isWhole,
    setIsWhole,
    isStand,
    setIsStand,
  };

  // Public Settings
  const [delivDate, setDelivDate] = useState(
    new Date(getWorkingDateTime("NOW").plus({ days: 1 }).toISO())
  );
  const selection = {
    location,
    setLocation,
    delivDate,
    setDelivDate,
  };

  //const cartSettings = { location, delivDate }
  const standingSettings = { location, isWhole, isStand, delivDate };

  const [activeIndex, setActiveIndex] = useState(0);
  const [orderingType, setOrderingType] = useState("cart");

  const handleCartStand = () => {
    setActiveIndex(Math.abs(activeIndex-1))
  }

  return (
    <React.Fragment>
      
      {user.location === "backporch" && (
        <AdminControls
          adminSettings={adminSettings}
          orderingType={orderingType}
        />
      )}
       <div className="cartStanding">
        <button className="cartStandButton" onClick={handleCartStand}>{activeIndex===1 ? "RETURN TO CART" : "EDIT STANDING ORDER"}</button>
      </div>
      {activeIndex===0 && (
        <>
          <OrderSelection selection={selection} />

          <OrderDisplay
            location={location}
            delivDate={delivDate}
            userName={user.name}
          />
        </>
      )}
      {activeIndex===1 && (
        <>
          <StandingDisplay standingSettings={standingSettings} user={user} />
        </>
      )}
      {/* <pre>{"LOCATION DETAILS: " + JSON.stringify(locationDetails, null, 2)}</pre> */}
      {/* <pre>{"CART DATA (first 3): " + JSON.stringify(cartData?.slice(0, 3), null, 2)}</pre> */}
      {/* <pre>{"STANDING DATA (first 3): " + JSON.stringify(standingData?.slice(0, 3), null, 2)}</pre> */}
      {/* <pre>{"ORDER HEADER: " + JSON.stringify(orderHeader, null, 2)}</pre> */}
      {/* <pre>{"ORDER LIST: " + JSON.stringify(orderItems, null, 2)}</pre> */}
      <div style={{ height: "200px" }} />
    </React.Fragment>
  );
};

export default Orders9;
