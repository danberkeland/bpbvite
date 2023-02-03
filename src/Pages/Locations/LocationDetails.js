import React from "react";
import { CustomInputs } from "../../FormComponents/CustomInputs";

import { validationSchema } from "./ValidationSchema";

import { deleteLocation, updateLocation } from "../../restAPIs";
import { createLocation } from "../../data/locationData";
import { withFadeIn } from "../../hoc/withFadeIn";
import { withBPBForm } from "../../hoc/withBPBForm";
import { GroupBox } from "../../CommonStyles";
import { compose } from "../../utils";
import { useZoneListFull } from "../../data/zoneData";
// import { useSimpleZoneList } from "../../swr";

const BPB = new CustomInputs();

function LocationDetails({ initialState }) {
  //const { simpleZoneList } = useSimpleZoneList();
  const { data:simpleZoneList } = useZoneListFull(true)

  const terms = [
    { label: "0", value: "0" },
    { label: "15", value: "15" },
    { label: "30", value: "30" },
  ];

  const invoicing = [
    { label: "daily", value: "daily" },
    { label: "weekly", value: "weekly" },
  ];

  const zones = simpleZoneList ? simpleZoneList : [];

  const BPBLocationForm = compose(
    withBPBForm,
    withFadeIn
  )((props) => {
    console.log("props", props)
    return (
      <React.Fragment>
        <div className="bpbSimpleForm">
        <GroupBox>
          <h2>
            <i className="pi pi-user"></i> Location Name
          </h2>
          <BPB.CustomIDInput
            label="Location ID"
            name="locNick"
            dontedit="true"
            converter={props}
          />
          <BPB.CustomTextInput
            label="Location Name"
            name="locName"
            converter={props}
          />
        </GroupBox>

        <GroupBox>
          <h2>
            <i className="pi pi-map"></i> Location
          </h2>
          <BPB.CustomDropdownInput
            label="Zone"
            name="zoneNick"
            options={zones}
            optionLabel="zoneName"
            optionValue="zoneNick"
            converter={props}
          />
          <BPB.CustomTextInput label="Address" name="addr1" converter={props} />
          <BPB.CustomTextInput label="Address" name="addr2" converter={props} />
          <BPB.CustomTextInput label="City" name="city" converter={props} />
          <BPB.CustomTextInput label="Zip" name="zip" converter={props} />
        </GroupBox>

        <GroupBox>
          <h2>
            <i className="pi pi-phone"></i> Contact
          </h2>
          <BPB.CustomTextInput
            label="First Name"
            name="firstName"
            converter={props}
          />
          <BPB.CustomTextInput
            label="Last Name"
            name="lastName"
            converter={props}
          />
          <BPB.CustomTextInput label="Email" name="email" converter={props} />
          <BPB.CustomTextInput label="Phone" name="phone" converter={props} />
        </GroupBox>

        <GroupBox>
          <h2>
            <i className="pi pi-dollar"></i> Billing
          </h2>
          <BPB.CustomYesNoInput
            label="Paper Invoice"
            name="toBePrinted"
            converter={props}
          />
          <BPB.CustomYesNoInput
            label="Email Invoice"
            name="toBeEmailed"
            converter={props}
          />
          <BPB.CustomYesNoInput
            label="Print Duplicate"
            name="printDuplicate"
            converter={props}
          />
          <BPB.CustomDropdownInput
            label="Terms"
            name="terms"
            options={terms}
            converter={props}
          />
          <BPB.CustomDropdownInput
            label="Invoicing"
            name="invoicing"
            options={invoicing}
            converter={props}
          />
        </GroupBox>
        </div>
      </React.Fragment>
    );
  });

  return (
    <BPBLocationForm
      name="location"
      validationSchema={validationSchema}
      initialState={initialState}
      create={createLocation}
      delete={deleteLocation}
      update={updateLocation}
    />
  );
}

export default LocationDetails;
