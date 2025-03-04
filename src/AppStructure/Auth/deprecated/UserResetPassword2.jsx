// import React, { useState } from "react";
// import { CustomInputs } from "../../FormComponents/CustomInputs";

// import { validationSchemaConfirm } from "./ValidationSchemaConfirm";

// import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";

// import { setNewPasswor_d } from "./restAPI_s";
// import { withFadeIn } from "../../hoc/withFadeIn";
// import { withBPBForm } from "../../hoc/withBPBForm";
// import { GroupBox } from "../../CommonStyles";
// import { compose } from "../../utils/_deprecated/utils";
// import { Title } from "../../CommonStyles";
// import "./Splash.css";
// import { useSettingsStore } from "../../Contexts/SettingsZustand";

// const BPB = new CustomInputs();

// const initialState = {
//   email: "",
//   password: "",
// };


// export const  UserResetPassword = () => {
//   const setFormType = useSettingsStore((state) => state.setFormType);
//   const setIsEdit = useSettingsStore((state) => state.setIsEdit);
//   const [showMessage, setShowMessage] = useState(false);

  

//   const dialogFooter = (
//     <div className="flex justify-content-center">
//       <Button
//         label="OK"
//         className="p-button-text"
//         autoFocus
//         onClick={() => setShowMessage(false)}
//       />
//     </div>
//   );

//   const handleApply = () => {
//     setFormType("Apply");
//   };

//   setIsEdit(true)

//   const BPBLocationForm = compose(
//     withBPBForm,
//     withFadeIn
//   )((props) => {
  
//     return (
//       <React.Fragment>
//         <GroupBox>
//           <div className="flex justify-content-center">
//             <div className="card">
//               <Title>Sign In</Title>
//               <div>
//                 Don't have an account?{" "}
//                 <Button
//                   className="p-button-text"
//                   onClick={handleApply}
//                   type="button"
//                 >
//                   APPLY NOW
//                 </Button>
//               </div>
//               <BPB.CustomTextInput label="Email" name="email" converter={props} />
              
//                <BPB.CustomPasswordInput
//                 label="New Password"
//                 name="passwordNew"
//                 converter={props}
//               />
//               <BPB.CustomPasswordInput
//                 label="Confirm New Password"
//                 name="passwordConfirm"
//                 converter={props}
//               />
//             </div>
//           </div>
//         </GroupBox>
//         <Dialog
//           visible={showMessage}
//           onHide={() => setShowMessage(false)}
//           position="top"
//           footer={dialogFooter}
//           showHeader={false}
//           breakpoints={{ "960px": "80vw" }}
//           style={{ width: "30vw" }}
//         >
//           <div className="flex align-items-center flex-column pt-6 px-3">
//             <i
//               className="pi pi-exclamation-circle"
//               style={{ fontSize: "5rem", color: "var(--red-500)" }}
//             ></i>
//             <h5>Invalid Email or Password</h5>
//             <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
//               Please check email and password to make sure they are correct.
//             </p>
//           </div>
//         </Dialog>
//       </React.Fragment>
//     );
//   });

//   return (
//     <BPBLocationForm
//       name="auth"
//       validationSchema={validationSchemaConfirm}
//       initialState={initialState}
//       update={setNewPassword}
//     />
//   );
// }
