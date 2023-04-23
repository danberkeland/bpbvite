import React from "react";
import { InputText } from "primereact/inputtext";

//import { setValue, fixValue } from "../../../helpers/formHelpers";

const Info = ({ selectedZone, setSelectedZone }) => {

  return (
    <React.Fragment>
      <h2><i className="pi pi-map"></i> Zone Info</h2>

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneName">Zone Name</label>
          <br />
        </span>

        <InputText id="zoneName" value={selectedZone?.zoneName ?? ""} disabled />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneNum">Zone Number</label>
          <br />
        </span>
        {/* No zoneNum attribute exists? */}
        <InputText disabled id="zoneNum" value={""} onChange={e => console.log("foo")} />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneFee">Zone Fee</label>
          <br />
        </span>
        <InputText id="zoneFee" 
          value={selectedZone?.zoneFee ?? ""} 
          onChange={e => setSelectedZone({
            ...selectedZone, 
            zoneFee: e.target.value})
          } 
        />
      </div>
      <br />
      {/* <pre>{JSON.stringify(selectedZone, null, 2)}</pre> */}
    </React.Fragment>
  );
};

export default Info;
