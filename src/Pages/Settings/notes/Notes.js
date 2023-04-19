import React, { useState, useEffect, useContext } from "react";

import styled from "styled-components";

import { notesData } from "../../../helpers/databaseFetchers";

import NoteList from "./Parts/NoteList";
import Note from "./Parts/Note";
import Buttons from "./Parts/Buttons";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.5fr;
  height: 100vh;
`;

const DescripWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;
  justify-items: start;
  align-content: flex-start;
  width: 100%;
  background: #ffffff;
`;

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  border: 1px solid lightgrey;
  width: 95%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

function Notes() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  useEffect(() => {
    notesData().then((notes) => setNotes(notes));
    setIsLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <MainWrapper>
        <NoteList
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          notes={notes}
        />

        <React.Fragment>
          <DescripWrapper>
            <GroupBox id="Info">
              <Note
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
              />
            </GroupBox>
          </DescripWrapper>
        </React.Fragment>

        <DescripWrapper>
          <Buttons
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
          />
        </DescripWrapper>
      </MainWrapper>
    </React.Fragment>
  );
}

export default Notes;
