import React from "react";

import styled from "styled-components";
//import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import {
  updateNotes,
  deleteNotes,
  createNotes,
} from "../../../../../graphql/mutations";

import { Button } from "primereact/button";

import { API, graphqlOperation } from "aws-amplify";

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

const Buttons = ({ selectedNote, setSelectedNote }) => {
  const handleAddNote = () => {
    let when;
    let note;
    /*
    swal("Enter Note Date (mm/dd/yyyy):", {
      content: "input",
    }).then((value) => {
      when = value;
      swal(`Type Note:`, {
        content: "input",
      }).then((value) => {
        note = value;
        const addDetails = {
          when: when,
          note: note,
          
        };
        createNote(addDetails);
      });
    });*/
  };

  const createNote = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createNotes, { input: { ...addDetails } })
      );
    } catch (error) {
      console.log("error on fetching Notes List", error);
    }
  };

  const updateNote = async () => {
    const updateDetails = {
      id: selectedNote.id,
      when: selectedNote.when,
      note: selectedNote.note,
    };

    try {
      await API.graphql(
        graphqlOperation(updateNotes, { input: { ...updateDetails } })
      );
      /*
      swal({
        text: `Note has been updated.`,
        icon: "success",
        buttons: false,
        timer: 2000,
      });*/
    } catch (error) {
      console.log("error on fetching Notes List", error);
    }
  };

  const deleteNoteWarn = async () => {
    /*
    swal({
      text:
        " Are you sure that you would like to permanently delete this note?",
      icon: "warning",
      buttons: ["Yes", "Don't do it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (!willDelete) {
        deleteNote();
      } else {
        return;
      }
    });*/
  };

  const deleteNote = async () => {
    const deleteDetails = {
      id: selectedNote["id"],
    };

    try {
      await API.graphql(
        graphqlOperation(deleteNotes, { input: { ...deleteDetails } })
      );
      setSelectedNote();
    } catch (error) {
      console.log("error on fetching Notes List", error);
    }
  };

  return (
    <ButtonBox>
      <Button
        label="Add a Note"
        icon="pi pi-plus"
        onClick={handleAddNote}
        className={"p-button-raised p-button-rounded"}
      />
      <br />
      {selectedNote && (
        <React.Fragment>
          <Button
            label="Update Note"
            icon="pi pi-user-edit"
            onClick={updateNote}
            className={"p-button-raised p-button-rounded p-button-success"}
          />
          <br />
        </React.Fragment>
      )}
      {selectedNote && (
        <React.Fragment>
          <Button
            label="Delete Note"
            icon="pi pi-user-minus"
            onClick={deleteNoteWarn}
            className={"p-button-raised p-button-rounded p-button-warning"}
          />
          <br />
          <br />
        </React.Fragment>
      )}
    </ButtonBox>
  );
};

export default Buttons;
