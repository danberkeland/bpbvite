import React from "react";

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
import { confirmDialog } from "primereact/confirmdialog";

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  width: 80%;
  margin: 5px 10px;
  padding: 5px 20px;
`;

const Buttons = ({ selectedRoute, setSelectedRoute }) => {
  const handleAddRoute = () => {
    let routeName;
    /*
    swal("Enter Route Name:", {
      content: "input",
    }).then((value) => {
      routeName = value;
      const addDetails = {
        routeName: routeName,
        routeStart: 0,
        routeTime: 0,
        RouteDepart: "",
        RouteArrive: "",
        RouteServe: [],
        RouteSched: [],
      };
      createRte(addDetails, routeName);
    });*/
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
      id: selectedRoute["id"],
      routeName: selectedRoute["routeName"],
      routeStart: selectedRoute["routeStart"],
      routeTime: selectedRoute["routeTime"],
      RouteDepart: selectedRoute["RouteDepart"],
      RouteArrive: selectedRoute["RouteArrive"],
      RouteServe: selectedRoute["RouteServe"],
      RouteSched: selectedRoute["RouteSched"],
      _version: selectedRoute["_version"],
    };

    try {
      const routeData = await API.graphql(
        graphqlOperation(updateRoute, { input: { ...updateDetails } })
      );
      /*
      swal({
        text: `${routeData.data.updateRoute.routeName} has been updated.`,
        icon: "success",
        buttons: false,
        timer: 2000,
      });*/
    } catch (error) {
      console.log("error on fetching Route List", error);
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
    <ButtonBox>
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
  );
};

export default Buttons;
