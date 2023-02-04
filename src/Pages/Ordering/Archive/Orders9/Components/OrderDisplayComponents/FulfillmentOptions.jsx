import React, { useEffect } from "react";

import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

/**For display/control of header-type order info*/
export const FullfillmentOptions = ({ orderHeaderState }) => {
  const { orderHeader, orderHeaderChanges, setOrderHeaderChanges } =
    orderHeaderState;

    useEffect(()=>{
        console.log("orderHeader", orderHeaderChanges)
    }, [orderHeaderChanges])

  const fulfillOptions = [
    {
      label:
        orderHeader?.defaultRoute === "deliv"
          ? "Delivery (default)"
          : "Delivery",
      value: "deliv",
    },
    {
      label:
        orderHeader?.defaultRoute === "slopick"
          ? "Pick up SLO (default)"
          : "Pick up SLO",
      value: "slopick",
    },
    {
      label:
        orderHeader?.defaultRoute === "atownpick"
          ? "Pickup Carlton (default)"
          : "Pickup Carlton",
      value: "atownpick",
    },
  ];

  return (
    <div className="fullfillmentOptions">
      {orderHeaderChanges && (
      
          <Dropdown
            id="filfillDropdown"
            options={fulfillOptions}
            optionLabel="label"
            optionValue="value"
            value={orderHeaderChanges.route}
            onChange={(e) =>
              setOrderHeaderChanges({ ...orderHeaderChanges, route: e.value })
            }
          />
       
      )}
    </div>
  );
};
