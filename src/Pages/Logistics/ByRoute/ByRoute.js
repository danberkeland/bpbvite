// import React, { useContext, useEffect, useState } from "react";

// import styled from "styled-components";

// import RouteGrid from "../ByRoute/Parts/RouteGrid";
// import RouteList from "../ByRoute/Parts/RouteList";
// import Toolbar from "../ByRoute/Parts/Toolbar";
// import { todayPlus } from "../../../helpers/dateTimeHelpers";
// import { useLegacyFormatDatabase } from "../../../data/legacyData";
// import { useSettingsStore } from "../../../Contexts/SettingsZustand";

// import ComposeProductGriXd from "./Parts/utils/composeProductGriXd";

// const MainWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 5fr;
//   //height: 100vh;
// `;

// const DescripWrapper = styled.div`
//   font-family: "Montserrat", sans-serif;
//   display: flex;
//   width: 95%;
//   margin: 10px auto;
//   flex-direction: column;
//   justify-items: start;
//   align-content: flex-start;

//   //background: #ffffff;
// `;

// const compose = new ComposeProductGriXd();

// function ByRoute() {
//   const [route, setRoute] = useState("AM Pastry");
//   const [delivDate, setDelivDate] = useState(todayPlus()[0]);
//   const [routeList, setRouteList] = useState();
//   const [orderList, setOrderList] = useState();
//   const [altPricing, setAltPricing] = useState();

//   const setIsLoading = useSettingsStore((state) => state.setIsLoading);
//   const { data: database } = useLegacyFormatDatabase();

//   useEffect(() => {
//     gatherProdGridInfo(database);
//     console.log('database', database)
//   }, [delivDate, database]); // eslint-disable-line react-hooks/exhaustive-deps

//   const gatherProdGridInfo = (data) => {
//     setIsLoading(true);
//     try {
//       let prodGridData = compose.returnProdGrid(data, delivDate);
//       setOrderList(prodGridData.prodGrid);
//       setIsLoading(false);
//     } catch(error) {

//       console.log('error', error)
//     }
//   };

//   return (
//     <React.Fragment>
//       <MainWrapper>
//         {database && <RouteList
//           orderList={orderList}
//           setRouteList={setRouteList}
//           setRoute={setRoute}
//           routeList={routeList}
//           database={database}
//         />}
//         <DescripWrapper>
//           <div style={{
//             width: "fit-content",
//             borderRadius: "3px",
//             marginBlock: ".5rem",
//             backgroundColor: "hsl(37, 100%, 80%)",
//           }}>
//             <Toolbar delivDate={delivDate} setDelivDate={setDelivDate} />
//           </div>
//           {database && <RouteGrid
//             route={route}
//             orderList={orderList}
//             database={database}
//             delivDate={delivDate}
//           />}
//         </DescripWrapper>
//       </MainWrapper>
//     </React.Fragment>
//   );
// }

// export default ByRoute;
