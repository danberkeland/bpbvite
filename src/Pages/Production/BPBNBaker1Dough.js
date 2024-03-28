// import React, { useState, useEffect, useCallback } from "react";


// import { InputText } from "primereact/inputtext";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// //import { confirmDialog } from "primereact/confirmdialog";


// import ComposeDough from "./Utils/composeDough";
// // import { todayPlus } from "../../helpers/dateTimeHelpers";

// import { getMixInfo } from "./BPBNBaker1Parts/GetMixInfo";
// import { binInfo } from "./BPBNBaker1Parts/BinInfo";
// import { panAmount } from "./BPBNBaker1Parts/PanAmount";
// import { bucketAmount } from "./BPBNBaker1Parts/BucketAmount";

// import { BagMixesScreen } from "./BPBNBaker1Parts/BagMixesScreen";
// import { useLegacyFormatDatabase } from "../../data/legacyData";

// // import styled from "styled-components";
// import { useSettingsStore } from "../../Contexts/SettingsZustand";

// import { TwoColumnGrid, WholeBox, WholeBoxPhone } from "./_styles"
// import { debounce } from "lodash";
// import { useListData } from "../../data/_listData";

// const compose = new ComposeDough();

// const labelContainerStyle = {
//   display:"flex", 
//   gap: "1rem", 
//   alignItems: "center", 
//   padding: ".25rem",
// }


// function BPBNBaker1Dough({
//   doughs,
//   setDoughs,
//   setDoughComponents,
//   infoWrap,
//   setBagAndEpiCount,
//   setOliveCount,
//   setBcCount,
//   setBagDoughTwoDays,
//   deliv
// }) {

//   const { data: database } = useLegacyFormatDatabase();
  
//   const [mixes, setMixes] = useState();
//   const [bin, setBin] = useState();
//   const [pans, setPans] = useState();
//   const [buckets, setBuckets] = useState();

//   const setIsLoading = useSettingsStore((state) => state.setIsLoading);

  

  
//   useEffect(() => {
//     gatherDoughInfo(database, deliv);
//   }, [deliv, database]); // eslint-disable-line react-hooks/exhaustive-deps


//   const gatherDoughInfo = (database,deliv) => {
//     setIsLoading(true)
//     try{
//       console.log("deliv1",deliv)
//       let doughData = compose.returnDoughBreakDown(database, "Carlton",deliv)
//       setDoughs(doughData.Baker1Dough);
//       setDoughComponents(doughData.Baker1DoughComponents);
//       setBagAndEpiCount(doughData.bagAndEpiCount);
//       setOliveCount(doughData.oliveCount);
//       setBcCount(doughData.bcCount);
//       setBagDoughTwoDays(doughData.bagDoughTwoDays);
//       setIsLoading(false)
//     } catch {}
//   };

//   useEffect(() => {
//     if (doughs[0] && infoWrap) {
//       setMixes(getMixInfo(doughs, infoWrap)[4]);
//       setBin(binInfo(doughs, infoWrap));
//       setPans(panAmount(doughs, infoWrap));
//       setBuckets(bucketAmount(doughs, infoWrap));
//     }
//   }, [doughs, infoWrap]);

  



//   const innards = (
//     <React.Fragment>
//       <h1>BPBN Baguette Mix</h1>
//       <DoughMixList dough={doughs[0]} />
//       {infoWrap && doughs && mixes &&
//         <BagMixesScreen 
//           mixes={mixes} 
//           doughs={doughs} 
//           infoWrap={infoWrap} 
//           deliv={deliv} 
//         />
//       }

//       <h2>Bins</h2>
//       <DataTable value={bin} className="p-datatable-sm">
//         <Column field="title" header="Product"></Column>
//         <Column field="amount" header="Amount"></Column>
//       </DataTable>

//       <h2>Pocket Pans</h2>
//       <DataTable value={pans} className="p-datatable-sm">
//         <Column field="title" header="Pan"></Column>
//         <Column field="amount" header="Amount"></Column>
//       </DataTable>

//       <h2>Bucket Sets</h2>
//       <DataTable value={buckets} className="p-datatable-sm">
//         <Column field="title" header="Bucket Sets"></Column>
//         <Column field="amount" header="Amount"></Column>
//       </DataTable>
//     </React.Fragment>
//   );
//   return (
//     <React.Fragment>
//       {/* {width > breakpoint ? ( */}
//         <WholeBox>{innards}</WholeBox>
//       {/* ) : ( */}
//         {/* <WholeBoxPhone>{innards}</WholeBoxPhone> */}
//       {/* )} */}
//     </React.Fragment>
//   );
// }

// export default BPBNBaker1Dough;



// // The input 'dough' is a baguette dough object enhanced with 'short' and
// // 'needed' attributes which we will use for display purposes. We call in 
// // another baguette dough object 'doughItem' straight from the cache. We
// // use this to handle DB updates and revalidation of the doughList hook.
// const DoughMixList = ({ dough }) => {

//   const [doughItem, setDoughItem] = useState()
//   const doughCache = useListData({ 
//     tableName: "DoughBackup", 
//     shouldFetch: true 
//   })

//   useEffect(() => {
//     if (doughCache.data) setDoughItem(
//       doughCache.data.find(D => D.doughName === "Baguette")
//     )
//   }, [doughCache.data])

//   const [rollbackQty, setRollbackQty] = useState()

//   const submitDough = async (doughItem) => {
//     console.log(dough)
//     const { oldDough:_o, buffer:_b, bucketSets:_bs } = dough
//     const { id, oldDough, buffer, bucketSets } = doughItem
//     if (oldDough === _o && buffer === _b && bucketSets === _bs) {
//       console.log("no changes detected")
//       return
//     }

//     const updateItem = {
//       id: id,
//       oldDough: Number(oldDough || "0"), 
//       buffer: Number(buffer || "0"), 
//       bucketSets: Number(bucketSets || "0")
//     }
//     console.log(`Submitting ${JSON.stringify(updateItem, null, 2)}`)
//     doughCache.updateLocalData(
//       await doughCache.submitMutations({ updateInputs: [updateItem]})
//     )
//   }

//   // without 'dough' in dependency array, the debounce/submit function gets 
//   // memoized before dough loads and becomes uable to 'see' it on the initial
//   // render, causing the submit function to fail.
//   const debouncedSubmit = useCallback(
//     debounce(doughItem => 
//       submitDough(doughItem, dough), 
//       5000
//     ), 
//     [dough]
//   )


//   const totalDoughNeeded = (Number(dough?.needed) 
//     + Number(doughItem?.buffer) 
//     + Number(dough?.short)
//   ).toFixed(1)

//   return(
//     <div style={{
//       paddingInline: "1rem",
//       backgroundColor: "hsl(37, 100%, 80%)",
//       paddingBlock: ".5rem",
//       border: "solid 1px hsl(37, 67%, 60%)",
//       borderRadius: "3px",
//     }}>
//       {!(doughItem && dough) && <div>loading...</div>}

//       {doughItem && dough && <>
//         <h3>{doughItem.doughName}: (need {dough.needed} lb.)</h3>
//         <h3>TOTAL: {totalDoughNeeded}</h3>
//         <h3>SHORT: {dough.short}</h3>

//         <InputGroupLabel label="Old Dough: " addOnLabel="lb.">
//           <InputText 
//             value={doughItem.oldDough}
//             inputMode="numeric"
//             onFocus={e => {
//               e.target.select()
//               setRollbackQty(doughItem.oldDough)
//             }}
//             onKeyDown={e => {
//               if (e.code === "Enter") e.target.blur()
//               if (e.code === "Escape") {
//                 const newItem = {
//                   ...doughItem,
//                   oldDough: rollbackQty
//                 }
//                 debouncedSubmit.cancel()
//                 setDoughItem(newItem)
//                 setRollbackQty()
//               }
//             }}
//             onChange={e => {
//               if (/^\d{0,4}$|^\d{0,4}\.\d{0,1}$/.test(e.target.value)) {
//                 const newItem = {
//                   ...doughItem,
//                   oldDough: parseInt(e.target.value || "0")
//                 }
//                 setDoughItem(newItem)
//                 debouncedSubmit(newItem)
//               }
//             }}
//             onBlur={() => debouncedSubmit.flush()}
//           />
//         </InputGroupLabel>

//         <InputGroupLabel label="Buffer Dough: "addOnLabel="lb.">
//           <InputText 
//             value={doughItem.buffer}
//             inputMode="numeric"
//             onFocus={e => {
//               e.target.select()
//               setRollbackQty(doughItem.buffer)
//             }}
//             onKeyDown={e => {
//               if (e.code === "Enter") e.target.blur()
//               if (e.code === "Escape") {
//                 const newItem = {
//                   ...doughItem,
//                   buffer: rollbackQty
//                 }
//                 debouncedSubmit.cancel()
//                 setDoughItem(newItem)
//                 setRollbackQty()
//               }
//             }}
//             onChange={e => {
//               if (/^\d{0,4}$|^\d{0,4}\.\d{0,1}$/.test(e.target.value)) {
//                 const newItem = {
//                   ...doughItem,
//                   buffer: parseInt(e.target.value || "0")
//                 }
//                 setDoughItem(newItem)
//                 debouncedSubmit(newItem)
//               }
//             }}
//             onBlur={() => debouncedSubmit.flush()}
//           />
//         </InputGroupLabel>

//         <InputGroupLabel label="Actual Bucket Sets: " addOnLabel="sets">
//           <InputText 
//             value={doughItem.bucketSets}
//             inputMode="numeric"
//             onFocus={e => {
//               e.target.select()
//               setRollbackQty(doughItem.bucketSets)
//             }}
//             onKeyDown={e => {
//               if (e.code === "Enter") e.target.blur()
//               if (e.code === "Escape") {
//                 const newItem = {
//                   ...doughItem,
//                   bucketSets: rollbackQty
//                 }
//                 debouncedSubmit.cancel()
//                 setDoughItem(newItem)
//                 setRollbackQty()
//               }
//             }}
//             onChange={e => {
//               if (/^\d?$|^0\d?$/.test(e.target.value)) {
//                 const newItem = {
//                   ...doughItem,
//                   bucketSets: parseInt(e.target.value || "0")
//                 }
//                 setDoughItem(newItem)
//                 debouncedSubmit(newItem)
//               }
//             }}
//             onBlur={() => debouncedSubmit.flush()}
//           />
//         </InputGroupLabel>

//         {/* <pre>From dough list: {JSON.stringify(doughItem, null, 2)}</pre> */}
//         {/* <pre>From Legacy DB: {JSON.stringify(dough, null, 2)}</pre> */}
//       </>}
//     </div>
//   )

// }

// const InputGroupLabel = ({label, addOnLabel, children}) => {
//   return (
//     <div style={labelContainerStyle}>
//       <span style={{minWidth: "9rem"}}>{label}</span>
//       <div style={{width: "7.5rem"}} className="p-inputgroup">
//         {children}
//         <span style={{width: "3rem"}} className="p-inputgroup-addon">
//           {addOnLabel}
//         </span>
//       </div>
//     </div>
//   )
// }

//   // const updateDoughDB = async (e) => {
//   //   let id = e.target.id.split("_")[0];
//   //   let attr = e.target.id.split("_")[1];
//   //   let qty = e.target.value;

//   //   let doughsToMod = clonedeep(doughs);
//   //   doughsToMod[doughsToMod.findIndex((dgh) => dgh.id === id)][attr] = qty;
//   //   setDoughs(doughsToMod);

//   //   let updateDetails = {
//   //     id: id,
//   //     [attr]: qty,
//   //   };
    
//   //   try {
//   //     await API.graphql(
//   //       graphqlOperation(updateDoughBackup, { input: { ...updateDetails } })
//   //     );
//   //     mutateDoughs()
//   //   } catch (error) {
//   //     console.log("error on fetching Dough List", error);
//   //   }
    
//   // };

//   // const doughMixList = (dough) => {
//   //   console.log("myDough",dough)
//   //   let doughTotal = (
//   //     Number(dough.needed) +
//   //     Number(dough.buffer) +
//   //     Number(dough.short)
//   //   ).toFixed(2);

//   //   let doughName = dough.doughName;
//   //   let doughNeeded = dough.needed;
//   //   let doughShort = Number(dough.short);

//   //   return (
//   //     <React.Fragment key={dough.id + "_firstFrag"}>
//   //       <div style={{
//   //         paddingInline: "1rem",
//   //         backgroundColor: "hsl(37, 100%, 80%)",
//   //         paddingBlock: ".5rem",
//   //         border: "solid 1px hsl(37, 67%, 60%)",
//   //         borderRadius: "3px",
//   //       }}>
//   //       <h3>
//   //         {doughName}: (need {doughNeeded} lb.) TOTAL:
//   //         {doughTotal} SHORT: {doughShort}
//   //       </h3>
//   //       <TwoColumnGrid key={dough.id + "_first2Col"}>
//   //         <div>
//   //           <TwoColumnGrid key={dough.id + "_second2Col"}>
//   //             <span>Old Dough:</span>
//   //             <div className="p-inputgroup">
//   //               <InputText
//   //                 key={dough.id + "_oldDough"}
//   //                 id={dough.id + "_oldDough"}
//   //                 placeholder={dough.oldDough}
//   //                 onChange={updateDoughDB}
//   //                 onBlur={updateDoughDB}
//   //               />
//   //               <span className="p-inputgroup-addon">lb.</span>
//   //             </div>
//   //           </TwoColumnGrid>
//   //           <TwoColumnGrid key={dough.id + "_third2Col"}>
//   //             <span>Buffer Dough:</span>
//   //             <div className="p-inputgroup">
//   //               <InputText
//   //                 key={dough.id + "_buffer"}
//   //                 id={dough.id + "_buffer"}
//   //                 placeholder={dough.buffer}
//   //                 onChange={updateDoughDB}
//   //                 onBlur={updateDoughDB}
//   //               />
//   //               <span className="p-inputgroup-addon">lb.</span>
//   //             </div>
//   //           </TwoColumnGrid>
//   //           <TwoColumnGrid key={dough.id + "_third2Col"}>
//   //             <span>Actual Bucket Sets:</span>
//   //             <div className="p-inputgroup">
//   //               <InputText
//   //                 key={dough.id + "_bucketSets"}
//   //                 id={dough.id + "_bucketSets"}
//   //                 placeholder={dough.bucketSets}
//   //                 onChange={updateDoughDB}
//   //                 onBlur={updateDoughDB}
//   //               />
//   //               <span className="p-inputgroup-addon">sets</span>
//   //             </div>
//   //           </TwoColumnGrid>
//   //         </div>
//   //       </TwoColumnGrid>
//   //       </div>

//   //       <BagMixesScreen mixes={mixes} doughs={doughs} infoWrap={infoWrap} deliv={deliv}/>
//   //     </React.Fragment>
//   //   );
//   // };


// //   <InputText 
// //   value={doughItem.oldDough}
// //   inputMode="numeric"
// //   onFocus={e => {
// //     e.target.select()
// //     setRollbackQty(doughItem.oldDough)
// //   }}
// //   onKeyDown={e => {
// //     if (e.code === "Enter") e.target.blur()
// //     if (e.code === "Escape") {
// //       const newItem = {
// //         ...doughItem,
// //         oldDough: rollbackQty
// //       }
// //       debouncedSubmit.cancel()
// //       setDoughItem(newItem)
// //       setRollbackQty()
// //     }
// //   }}
// //   onChange={e => {
// //     if (/^\d{0,4}$|^\d{0,4}\.\d{0,1}$/.test(e.target.value)) {
// //       const newItem = {
// //         ...doughItem,
// //         oldDough: parseInt(e.target.value || "0")
// //       }
// //       setDoughItem(newItem)
// //       debouncedSubmit(newItem)
// //     }
// //   }}
// //   onBlur={() => debouncedSubmit.flush()}
// // />