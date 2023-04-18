import React from "react";

import { InputText } from "primereact/inputtext";

import { setValue, fixValue } from "../../../helpers/formHelpers";

const Info = ({ selectedZone, setSelectedZone }) => {
  return (
    <React.Fragment>
      <h2>
        <i className="pi pi-map"></i> Zone Info
      </h2>

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneName"> Zone Name</label>
          <br />
        </span>

        <InputText
          id="zoneName"
          placeholder={selectedZone.zoneName}
          disabled
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedZone(setValue(e, selectedZone))
          }
          onBlur={(e) => setSelectedZone(fixValue(e, selectedZone))}
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneNum"> Zone Number</label>
          <br />
        </span>

        <InputText
          id="zoneNum"
          placeholder={selectedZone.zoneNum}
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedZone(setValue(e, selectedZone))
          }
          onBlur={(e) => setSelectedZone(fixValue(e, selectedZone))}
        />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneFee"> Zone Fee</label>
          <br />
        </span>

        <InputText
          id="zoneFee"
          placeholder={selectedZone.zoneFee}
          onKeyUp={(e) =>
            e.code === "Enter" && setSelectedZone(setValue(e, selectedZone))
          }
          onBlur={(e) => setSelectedZone(fixValue(e, selectedZone))}
        />
      </div>
      <br />
    </React.Fragment>
  );
};

export default Info;
