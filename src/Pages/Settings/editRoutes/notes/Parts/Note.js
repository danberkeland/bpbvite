import React from "react";

import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";

import { setValue, fixValue } from "../../../../../helpers/formHelpers";

const Note = ({ selectedNote, setSelectedNote }) => {
  return (
    <React.Fragment>
      {selectedNote && (
        <React.Fragment>
          <br />
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <label htmlFor="when"> Date</label>
              <br />
            </span>

            <InputText
              id="when"
              placeholder={selectedNote.when}
              onKeyUp={(e) =>
                e.code === "Enter" && setSelectedNote(setValue(e, selectedNote))
              }
              onBlur={(e) => setSelectedNote(fixValue(e, selectedNote))}
            />
          </div>
          <br />

          <div className="p-inputgroup">
            <InputTextarea
              rows={3}
              cols={30}
              id="note"
              placeholder={selectedNote.note}
              onKeyUp={(e) =>
                e.code === "Enter" && setSelectedNote(setValue(e, selectedNote))
              }
              onBlur={(e) => setSelectedNote(fixValue(e, selectedNote))}
            />
          </div>
          <br />
        </React.Fragment>
      )}{" "}
    </React.Fragment>
  );
};

export default Note;
