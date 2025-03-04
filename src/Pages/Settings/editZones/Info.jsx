import React from "react";
import { InputText } from "primereact/inputtext";

import styled from "styled-components";

//import { setValu_e, fixValu_e } from "../../../helpers/formHelper_s";

const GroupBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: fit-content;
  margin: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  border: 1px solid var(--bpb-orange-vibrant-500);
  background: var(--bpb-orange-vibrant-100);
`;

const Info = ({ selectedZone, setSelectedZone }) => {

  return (
    <GroupBox id="Info" style={{gap: "1rem"}}>
      <h2><i className="pi pi-map"></i> Zone Info</h2>

      <div className="p-inputgroup" style={{width: "20rem"}}>
        <span className="p-inputgroup-addon" style={{justifyContent: "flex-start", width: "7.5rem"}}>
          <label htmlFor="zoneName">Zone Name</label>
        </span>

        <InputText id="zoneName" 
          value={selectedZone?.zoneName ?? ""} 
          readOnly 
          disabled={!selectedZone}
        />
      </div>

      <div className="p-inputgroup" style={{width: "12rem"}}>
        <span className="p-inputgroup-addon" style={{justifyContent: "flex-start", width: "7.5rem"}}>
          <label htmlFor="zoneNum">Zone Number</label>
        </span>
        {/* No zoneNum attribute exists */}
        <InputText disabled id="zoneNum" value={""} onChange={e => console.log("foo")} />
      </div>

      <div className="p-inputgroup" style={{width: "12rem"}}>
        <span className="p-inputgroup-addon" style={{justifyContent: "flex-start", width: "7.5rem"}}>
          <label htmlFor="zoneFee">Zone Fee</label>
        </span>
        <InputText id="zoneFee" 
          value={selectedZone?.zoneFee ?? ""} 
          onChange={e => setSelectedZone({
            ...selectedZone, 
            zoneFee: e.target.value})
          }
          disabled={!selectedZone}
        />
      </div>

      {/* <pre>{JSON.stringify(selectedZone, null, 2)}</pre> */}
    </GroupBox>
  );
};

export default Info;
