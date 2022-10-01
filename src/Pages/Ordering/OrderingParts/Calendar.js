import React from "react";
import { Calendar } from "primereact/calendar";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

export const Cal = () => {
  const delivDate = useSettingsStore((state) => state.delivDate);
  const setIsModified = useSettingsStore((state) => state.setIsModified);
  const setDelivDate = useSettingsStore((state) => state.setDelivDate);
  

  const calDateSetter = (e) => {
    var today = e.value;
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    let newToday = yyyy + "-" + mm + "-" + dd;
    setIsModified(false)
    setDelivDate(newToday)
  };

  const convertToDisplayDate = (d) => {
    var dateSplit = d.split("-");
    return new Date(
      Number(dateSplit[0]),
      Number(dateSplit[1]) - 1,
      Number(dateSplit[2]),
      0,
      0
    );
  };

  return (
    <div className="field col-12 md:col-4">
      <Calendar
        id="touchUI"
        value={convertToDisplayDate(delivDate)}
        onChange={(e) => calDateSetter(e)}
        touchUI
      />
    </div>
  );
};
