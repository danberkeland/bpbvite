import React, { useRef, useState } from "react"

import { useListData } from "../../../data/_listData"

import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { Toast } from "primereact/toast"
import { InputText } from "primereact/inputtext"

import { isEqual } from "lodash"

import styled from "styled-components"

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 1rem;
  padding: 5px 20px;
`

const Buttons = ({ baseRoute, selectedRoute, setSelectedRoute }) => {
  const [newRouteNick, setNewRouteNick] = useState('')
  const { 
    submitMutations:submitRoutes,
    updateLocalData:updateRouteCache
  } = useListData({ tableName: "Route", shouldFetch: true })

  const { 
    data:zoneRouteData,
    submitMutations:submitZoneRoutes,
    updateLocalData:updateZoneRouteCache
  } = useListData({ tableName: "ZoneRoute", shouldFetch: true })
  
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const toast = useRef(null)
  const showUpdateSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Route Updated",
      detail: `Route has been updated.`,
      life: 3000,
    })
  }

  const handleCreate = async () => {
    const addDetails = {
      routeNick: newRouteNick,
      routeName: newRouteNick,
      routeStart: 0,
      routeTime: 0,
      RouteDepart: "",
      RouteArrive: "",
      RouteSched: [],
    }
    
    const select = {
      ...addDetails,
      zones: []
    }

    if (newRouteNick.length > 0) {
      updateRouteCache(await submitRoutes({ createInputs: [addDetails] }))
      setSelectedRoute(select)
      setNewRouteNick('')
      setShowCreateDialog(false)
    }

  } // end handleCreate

  const handleUpdate = async () => {
    if (!selectedRoute) {console.log("no route"); return}

    const { 
      createdAt:_createdAt, 
      updatedAt:_updatedAt, 
      zones:_zones, 
      ..._routeUpdateAtts 
    } = baseRoute // 'original' item from the cache

    const { 
      createdAt,            
      updatedAt,            
      zones,         
      ...routeUpdateAtts 
    } = selectedRoute // useState item with possible changes
    
    const { routeNick } = selectedRoute
    const createZoneRouteItems = zones.filter(z => !_zones.includes(z))
      .map(zoneNick => ({ routeNick, zoneNick }))
    
    const deletedZones = _zones.filter(z => !zones.includes(z))
    const deleteZoneRouteItems = zoneRouteData.filter(zr => 
      deletedZones.includes(zr.zoneNick) && zr.routeNick === routeNick
    ).map(zr => ({ id: zr.id }))

    const mutatedRoutes = !isEqual(_routeUpdateAtts, routeUpdateAtts)
      ? await submitRoutes({ updateInputs: [routeUpdateAtts] })
      : []

    const mutatedZoneRoutes = await submitZoneRoutes({ 
      createInputs: createZoneRouteItems, 
      deleteInputs: deleteZoneRouteItems
    })

    if (mutatedRoutes && mutatedZoneRoutes) {
      updateRouteCache(mutatedRoutes)
      updateZoneRouteCache(mutatedZoneRoutes)
    }

    showUpdateSuccess()
    setSelectedRoute(selectedRoute)

  } // end handleUpdate

  

  const deleteRouteWarn = async (routeNick) => {
    confirmDialog({
      message: `Delete ${routeNick}?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleDelete(),
    })
  }

  const handleDelete = async () => {
    const { routeNick, zones } = baseRoute

    const deleteZoneRouteInputs = zoneRouteData.filter(zr => 
      zones.includes(zr.zoneNick) && zr.routeNick === routeNick
    ).map(zr => ({ id: zr.id }))

    const mutatedZoneRoutes = await submitZoneRoutes({ 
      deleteInputs: deleteZoneRouteInputs 
    })

    const mutatedRoutes = await submitRoutes({ 
      deleteInputs: [{ routeNick: routeNick }] 
    })

    if (mutatedRoutes && mutatedZoneRoutes) {
      updateRouteCache(mutatedRoutes)
      updateZoneRouteCache(mutatedZoneRoutes)
    }
    
    setSelectedRoute()

  } // end handleDelete

  return (
    <React.Fragment>
      <Toast ref={toast} />
      <ConfirmDialog />
      <ButtonBox style={{gap: "1rem"}}>
        <Button
          label="Add a Route"
          icon="pi pi-plus"
          onClick={() => setShowCreateDialog(true)}
          className={"p-button-raised p-button-rounded"}
        />
        <Dialog
          visible={showCreateDialog}
          onHide={()=> setShowCreateDialog(false)}
          header="Enter Route Name"
          footer={
            <div>
              <Button label="Cancel" 
                onClick={() => setShowCreateDialog(false)} 
              />
              <Button label="Add" 
                onClick={handleCreate} 
              />
            </div>
          }
        >
          <InputText value={newRouteNick} 
            onChange={(e) => setNewRouteNick(e.target.value)}
          />
        </Dialog>
        {selectedRoute && (
          <Button
            label="Update Route"
            icon="pi pi-user-edit"
            onClick={handleUpdate}
            className={"p-button-raised p-button-rounded p-button-success"}
            disabled={selectedRoute && isEqual(selectedRoute, baseRoute)}
          />
        )}
        {selectedRoute && (
          <Button
            label="Delete Route"
            icon="pi pi-user-minus"
            onClick={() => deleteRouteWarn(selectedRoute.routeNick)}
            className={"p-button-raised p-button-rounded p-button-warning"}
          />
        )}
      </ButtonBox>
    </React.Fragment>
  )
}

export default Buttons






  // const createRte = async (addDetails) => {
  //   try {
  //     await API.graphql(
  //       graphqlOperation(createRoute, { input: { ...addDetails } })
  //     );
  //     setSelectedRoute();
  //     revalidateRouteList();
  //   } catch (error) {
  //     console.log("error on fetching Route List", error);
  //   }
  // };



  // const updateRteBatch = async (routeNick, updateDetails, routeServeData) => {
  //   try {
  //     const mutations = [];

  //     // Remove the RouteServe attribute from the updateDetails object
  //     const { RouteServe, ...updateDetailsWithoutRouteServe } = updateDetails;

  //     // Add a mutation for updating the item in Route table
  //     const updateRouteMutation = graphqlOperation(
  //       `
  //       mutation updateRoute(
  //         $routeNick: String!,
  //         $routeName: String,
  //         $routeStart: Float,
  //         $routeTime: Float,
  //         $RouteDepart: String,
  //         $RouteArrive: String,
  //         $RouteSched: [String]
  //       ) {
  //         updateRoute(input: { 
  //           routeNick: $routeNick, 
  //           routeName: $routeName,
  //           routeStart: $routeStart,
  //           routeTime: $routeTime,
  //           RouteDepart: $RouteDepart,
  //           RouteArrive: $RouteArrive,
  //           RouteSched: $RouteSched
  //         }) {
  //           routeNick
  //           routeName
  //           routeStart
  //           routeTime
  //           RouteDepart
  //           RouteArrive
  //           RouteSched
  //         }
  //       }
  //     `,
  //       {
  //         routeNick,
  //         routeName: updateDetails.routeName,
  //         routeStart: updateDetails.routeStart,
  //         routeTime: updateDetails.routeTime,
  //         RouteDepart: updateDetails.RouteDepart,
  //         RouteArrive: updateDetails.RouteArrive,
  //         RouteSched: updateDetails.RouteSched,
  //       }
  //     );

  //     mutations.push(updateRouteMutation);

  //     // Get all items from ZoneRoute table that are associated with the item we are updating in Route table
  //     const queryZoneRouteItems = graphqlOperation(
  //       `
  //       query listZoneRoutes($routeNick: String!) {
  //         listZoneRoutes(filter: { routeNick: { eq: $routeNick } }) {
  //           items {
  //             id
  //           }
  //         }
  //       }
  //     `,
  //       { routeNick }
  //     );
  //     const queryZoneRouteResult = await API.graphql(queryZoneRouteItems);

  //     // Loop through all associated items in ZoneRoute table and add mutations for deleting them
  //     queryZoneRouteResult.data.listZoneRoutes.items.forEach((item) => {
  //       const deleteZoneRouteMutation = graphqlOperation(
  //         `
  //         mutation deleteZoneRoute($id: ID!) {
  //           deleteZoneRoute(input: { id: $id }) {
  //             id
  //           }
  //         }
  //       `,
  //         { id: item.id }
  //       );
  //       mutations.push(deleteZoneRouteMutation);
  //     });

  //     // Loop through all items in the RouteServe array and add mutations for creating them in ZoneRoute table
  //     routeServeData.forEach((data) => {
  //       const createZoneRouteMutation = graphqlOperation(
  //         `
  //         mutation createZoneRoute($data: String, $routeNick: String!) {
  //           createZoneRoute(input: { zoneNick: $data, routeNick: $routeNick }) {
  //             id
  //             zoneNick
  //             routeNick
  //           }
  //         }
  //       `,
  //         { data, routeNick }
  //       );
  //       mutations.push(createZoneRouteMutation);
  //     });

  //     // Execute the mutations
  //     await Promise.all(mutations.map((mutation) => API.graphql(mutation)));
  //     const showSuccess = () => {
  //       toast.current.show({
  //         severity: "success",
  //         summary: "Route Updated",
  //         detail: `Route has been updated.`,
  //         life: 3000,
  //       });
  //     };
  //     showSuccess();
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };




  // const deleteRte = async (routeNick) => {
  //   try {
  //     // Delete the Route
  //     const deleteRouteItem = graphqlOperation(
  //       `
  //       mutation deleteRoute($routeNick: String!) {
  //         deleteRoute(input: { routeNick: $routeNick }) {
  //           routeNick
  //         }
  //       }
  //     `,
  //       { routeNick: selectedRoute.routeNick }
  //     );
  //     await API.graphql(deleteRouteItem);
  //     revalidateRouteList();
  //     setSelectedRoute()

  //     // Get all items from ZoneRoute that are associated with the item we just deleted from Routes
  //     const queryZoneRoutes = graphqlOperation(
  //       `
  //       query listZoneRoutes($routeNick: String!) {
  //         listZoneRoutes(filter: { routeNick: { eq: $routeNick } }) {
  //           items {
  //             id
  //           }
  //         }
  //       }
  //     `,
  //       { routeNick }
  //     );
  //     const queryZoneRouteResult = await API.graphql(queryZoneRoutes);
  //     console.log("queryZoneRouteResult", queryZoneRouteResult);

  //     // Delete each associated item from ZoneRoute
  //     for (const item of queryZoneRouteResult.data.listZoneRoutes.items) {
  //       const deleteZoneRoute = graphqlOperation(
  //         `
  //         mutation deleteZoneRoute($id: ID!) {
  //           deleteZoneRoute(input: { id: $id }) {
  //             id
  //           }
  //         }
  //       `,
  //         { id: item.id }
  //       );
  //       console.log("Deleting ZoneRoute item with id:", item.id);
  //       await API.graphql(deleteZoneRoute);
  //     }

  //     return { success: true };
  //   } catch (error) {
  //     console.error(error);
  //     return { success: false, error: error };
  //   }
  // };