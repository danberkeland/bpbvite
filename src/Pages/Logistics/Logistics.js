import React, {useEffect} from "react";
import Loader from "../../AppStructure/Loader";

// State Management
import { useLocUserList } from "../../swr";

// Components
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function Logistics() {
  const { locationList } = useLocUserList();

  useEffect(() => {
    console.log('locationList', locationList)
  })
  

  // Render
  
  return (
    <React.Fragment>
      {locationList.isLoading && <Loader />}
      {locationList.isError && <div>Table Failed to load</div>}
      {locationList.data && (
        <DataTable
          value={locationList.data}
          selectionMode="single"
          metaKeySelection={false}
          responsiveLayout="scroll"
          size="small"
          showGridlines
        >
          <Column field="locName" header="Locations" />
        </DataTable>
      )}
    </React.Fragment>
  );
}

export default Logistics;
