import React from "react";

import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

/**For display/control of header-type order info*/
export const OptionsCard = ({ orderHeaderState, readOnly }) => {
  const { orderHeader, orderHeaderChanges, setOrderHeaderChanges } =
    orderHeaderState;

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
    <Card
      style={{ marginTop: "0px" }}
      //title={readOnly ? "Items (Read Only)" : "Items"}
    >
      

      {orderHeaderChanges && (
        <span className="p-float-label">
          <InputTextarea
            id="input-note"
            style={{ width: "100%" }}
            value={orderHeader.ItemNote ? orderHeader.itemNote : undefined}
            onChange={(e) =>
              setOrderHeaderChanges({
                ...orderHeader,
                ItemNote: e.target.value ? e.target.value : null,
              })
            }
            disabled={readOnly}
          />
          <label
            htmlFor="input-note"
            style={{
              fontWeight:
                orderHeader.ItemNote !== orderHeaderChanges.ItemNote
                  ? "bold"
                  : "normal",
            }}
          >
            {"Add a Note" +
              (orderHeader.ItemNote !== orderHeaderChanges.ItemNote ? "*" : "")}
          </label>
        </span>
      )}
    </Card>
  );
};
