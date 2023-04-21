import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";

import { setValue, fixValue } from "../../../helpers/formHelpers";

const Info = ({ selectedZone, setSelectedZone }) => {
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();

  useEffect(() => {
    setValue1(selectedZone.Num);
    setValue2(selectedZone.zoneFee);
  }, [selectedZone]);

  const handleChange1 = (event) => {
    setValue1(event.target.value);
  };

  const handleChange2 = (event) => {
    setValue2(event.target.value);
  };

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

        <InputText id="zoneName" value={selectedZone.zoneName} disabled />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneNum"> Zone Number</label>
          <br />
        </span>

        <InputText id="zoneNum" value={value1} onChange={handleChange1} />
      </div>
      <br />

      <div className="p-inputgroup">
        <span className="p-inputgroup-addon">
          <label htmlFor="zoneFee"> Zone Fee</label>
          <br />
        </span>

        <InputText id="zoneFee" value={value2} onChange={handleChange2} />
      </div>
      <br />
    </React.Fragment>
  );
};

export default Info;
