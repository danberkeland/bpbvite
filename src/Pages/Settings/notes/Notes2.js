import React from "react";
import { NotesCalendar } from "./Parts2/NotesCalendar";
import { useState } from "react";
import { getWorkingDateTime } from "../../../functions/dateAndTime";
import Messages from "./Parts2/Messages";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Notes.css";

function Notes2() {
  const [delivDate, setDelivDate] = useState(
    new Date(getWorkingDateTime("NOW").plus({ days: 1 }).toISO())
  );

  return (
    <div className="long-driver-notes-container">
      <h1 className="title">Long Driver Notes</h1>
      <div className="calendar-datatable-container">
        <div className="calendar-container">
          <NotesCalendar delivDate={delivDate} setDelivDate={setDelivDate} />
        </div>
        <div className="datatable-container">
          <Messages />
        </div>
      </div>
    </div>
  );
}

export default Notes2;
