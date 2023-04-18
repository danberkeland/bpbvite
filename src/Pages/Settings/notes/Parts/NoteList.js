import React from "react";

import styled from "styled-components";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScrollPanel } from "primereact/scrollpanel";

const ListWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  margin: auto;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

const NoteList = ({ selectedNote, setSelectedNote, notes }) => {
  const handleSelection = (e) => {
    setSelectedNote(e.value);
  };

  return (
    <ListWrapper>
      <ScrollPanel style={{ width: "100%", height: "100vh" }}>
        <DataTable
          value={notes}
          className="p-datatable-striped"
          selection={selectedNote}
          onSelectionChange={handleSelection}
          selectionMode="single"
          dataKey="id"
        >
          <Column field="when" header="Date" sortable></Column>
          <Column field="note" header="Note" sortable></Column>
        </DataTable>
      </ScrollPanel>
    </ListWrapper>
  );
};

export default NoteList;
