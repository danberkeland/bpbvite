import React, { useRef, useState } from "react";

import styled from "styled-components";
//import swal from "@sweetalert/with-react";
import "primereact/resources/themes/saga-blue/theme.css";

import {
  updateRoute,
  deleteRoute,
  createRoute,
} from "../../../graphql/mutations";

import { Button } from "primereact/button";

import { API, graphqlOperation } from "aws-amplify";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

const Buttons = ({ selectedRoute, setSelectedRoute }) => {
  const [value, setValue] = useState();
  const toast = useRef(null);

  const handleAddRoute = () => {
    let zoneName;

    zoneName = value;
    const addDetails = {
      routeNick: zoneName,
      routeName: zoneName,
      routeStart: 0,
      routeTime: 0,
      RouteDepart: "",
      RouteArrive: "",
      RouteSched: [],
    };
    createRte(addDetails);
  };

  const createRte = async (addDetails) => {
    try {
      await API.graphql(
        graphqlOperation(createRoute, { input: { ...addDetails } })
      );
      setSelectedRoute();
    } catch (error) {
      console.log("error on fetching Route List", error);
    }
  };

  const updateRte = async () => {
    const updateDetails = {
      routeNick: selectedRoute["routeNick"],
      routeName: selectedRoute["routeName"],
      routeStart: selectedRoute["routeStart"],
      routeTime: selectedRoute["routeTime"],
      RouteDepart: selectedRoute["RouteDepart"],
      RouteArrive: selectedRoute["RouteArrive"],
      RouteServe: selectedRoute["RouteServe"],
      RouteSched: selectedRoute["RouteSched"],
      _version: selectedRoute["_version"],
    };

    updateRteBatch(
      selectedRoute["routeName"],
      updateDetails,
      selectedRoute["RouteServe"]
    );
  };

  const updateRteBatch = async (routeNick, updateDetails, routeServeData) => {
    try {
      const mutations = [];

      // Remove the RouteServe attribute from the updateDetails object
      const { RouteServe, ...updateDetailsWithoutRouteServe } = updateDetails;
      const {
        routeNick,
        routeName,
        routeStart,
        routeTime,
        RouteDepart,
        RouteArrive,
        RouteSched,
        _version,
      } = updateDetails;

      // Add a mutation for updating the item in Route table
      const updateRouteMutation = graphqlOperation(
        `
        mutation updateRoute(
          $routeNick: String!
          $routeName: String,
            $routeStart: Float,
            $routeTime: Float,
            $RouteDepart: String,
            $RouteArrive: String,
            $RouteSched: [String]
          ) {
          updateRoute(input: { 
            routeNick: $routeNick, 
            routeName: $routeName,
            routeStart: $routeStart,
            routeTime: $routeTime,
            RouteDepart: $RouteDepart,
            RouteArrive: $RouteArrive,
            RouteSched: $RouteSched
           }) {
            routeNick
            routeName
            routeStart
            routeTime
            RouteDepart
            RouteArrive
            RouteSched
          }
        }
      `,
        {
          routeNick,
          routeName,
          routeStart,
          routeTime,
          RouteDepart,
          RouteArrive,
          RouteSched,
        }
      );
      mutations.push(updateRouteMutation);

      // Get all items from ZoneRoute table that are associated with the item we are updating in Route table
      const queryZoneRouteItems = graphqlOperation(
        `
        query listZoneRoutes($routeNick: String!) {
          listZoneRoutes(filter: { routeNick: { eq: $routeNick } }) {
            items {
              id
            }
          }
        }
      `,
        { routeNick }
      );
      const queryZoneRouteResult = await API.graphql(queryZoneRouteItems);

      // Loop through all associated items in ZoneRoute table and add mutations for deleting them
      queryZoneRouteResult.data.listZoneRoutes.items.forEach((item) => {
        const deleteZoneRouteMutation = graphqlOperation(
          `
          mutation deleteZoneRoute($id: ID!) {
            deleteZoneRoute(input: { id: $id }) {
              id
            }
          }
        `,
          { id: item.id }
        );
        mutations.push(deleteZoneRouteMutation);
      });

      // Loop through all items in the RouteServe array and add mutations for creating them in ZoneRoute table
      routeServeData.forEach((data) => {
        
        const createZoneRouteMutation = graphqlOperation(
          `
          mutation createZoneRoute($data: String, $routeNick: String!) {
            createZoneRoute(input: { zoneNick: $data, routeNick: $routeNick }) {
              id
              zoneNick
              routeNick
            }
          }
        `,
          { data, routeNick }
        );
        mutations.push(createZoneRouteMutation);
      });

      // Execute the mutations
      await Promise.all(mutations.map((mutation) => API.graphql(mutation)));

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const deleteRouteWarn = async () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteRte(),
    });
  };

  const deleteRte = async () => {
    try {
      // Delete the Route
      const deleteRouteItem = graphqlOperation(
        `
        mutation deleteRoute($routeNick: String!) {
          deleteRoute(input: { routeNick: $routeNick }) {
            routeNick
          }
        }
      `,
        { routeNick: selectedRoute.routeNick }
      );
      await API.graphql(deleteRouteItem);

      // Get all items from ZoneRoute that are associated with the item we just deleted from Routes
      const queryZoneRoutes = graphqlOperation(
        `
        query listZoneRoutes($routeNick: String!) {
          listZoneRoutes(filter: { routeNick: { eq: $routeNick } }) {
            items {
              id
            }
          }
        }
      `,
        selectedRoute.routeNick
      );
      const queryZoneRouteResult = await API.graphql(queryZoneRoutes);

      // Delete all associated items from ZoneRoute
      const deleteZoneRouteItems = graphqlOperation(
        `
        mutation deleteZoneRouteItems($ids: [ID!]!) {
          batchDeleteZoneRouteItems(input: { ids: $ids }) {
            ids
          }
        }
      `,
        {
          ids: queryZoneRouteResult.data.listZoneRoutes.items.map(
            (item) => item.id
          ),
        }
      );
      await API.graphql(deleteZoneRouteItems);

      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error };
    }
  };

  return (
    <React.Fragment>
      <Toast ref={toast} />
      <ConfirmDialog />
      <ButtonBox>
        <InputText value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          label="Add a Route"
          icon="pi pi-plus"
          onClick={handleAddRoute}
          className={"p-button-raised p-button-rounded"}
        />
        <br />
        {selectedRoute && (
          <React.Fragment>
            <Button
              label="Update Route"
              icon="pi pi-user-edit"
              onClick={updateRte}
              className={"p-button-raised p-button-rounded p-button-success"}
            />
            <br />
          </React.Fragment>
        )}
        {selectedRoute && (
          <React.Fragment>
            <Button
              label="Delete Route"
              icon="pi pi-user-minus"
              onClick={deleteRouteWarn}
              className={"p-button-raised p-button-rounded p-button-warning"}
            />
            <br />
            <br />
          </React.Fragment>
        )}
      </ButtonBox>
    </React.Fragment>
  );
};

export default Buttons;
