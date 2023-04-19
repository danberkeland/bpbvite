import React from "react";
import { NotesCalendar } from "./Parts2/NotesCalendar";
import { useState } from "react";
import { getWorkingDateTime } from "../../../functions/dateAndTime";
import Messages from "./Parts2/Messages";

function Notes2() {

    const [delivDate, setDelivDate] = useState(
        new Date(getWorkingDateTime("NOW").plus({ days: 1 }).toISO())
      )

  return (
    <div>
      <h1>Long Driver Notes</h1>
      <NotesCalendar delivDate={delivDate} setDelivDate={setDelivDate} />
      <Messages />
    </div>
  );
}

export default Notes2;
