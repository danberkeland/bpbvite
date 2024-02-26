import React from "react";
import { NotesCalendar } from "./Parts2/NotesCalendar";
import { useState } from "react";
import { getWorkingDateTime } from "../../../functions/dateAndTime";
import Messages from "./Parts2/Messages";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './Notes.css'
import { useListData } from "../../../data/_listData";

function Notes2() {
  const [delivDate, setDelivDate] = useState(
    new Date(getWorkingDateTime("NOW").plus({ days: 1 }).toISO())
  );

  // const { data:notes } = useNotesList(true);
  const { data:notes } = useListData({ tableName: "Notes", shouldFetch: true })

  console.log('notes', notes)

  return (
    <div className="notes long-driver-notes-container">
      <h1 className="title">Long Driver Notes</h1>
      <div className="calendar-datatable-container">
        <div className="calendar-container">
          <NotesCalendar delivDate={delivDate} setDelivDate={setDelivDate} notes={notes} />
        </div>
        <div className="datatable-container">
          <Messages notes={notes} delivDate={delivDate}/>
        </div>
      </div>
    </div>
  );
}

export default Notes2;
