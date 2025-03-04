// import React, { useEffect, useState } from "react";
// import { CustomInputs } from "../../FormComponents/CustomInputs";


// import { validationSchema } from "./ValidationSchema";

// import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";

// import { Auth } from "aws-amplify";
// // import { submitAut_h, sendForgottenPasswordEmai_l } from "../../restAP_Is";
// import { withFadeIn } from "../../hoc/withFadeIn";
// import { withBPBForm } from "../../hoc/withBPBForm";
// import { GroupBox, Title } from "../../CommonStyles";
// import { compose } from "../../utils/_deprecated/utils";
// import "./Splash.css";
// import { useSettingsStore } from "../../Contexts/SettingsZustand";

// const sendForgottenPasswordEmail = async (email) => {
//   Auth.forgotPassword(email)
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));
// }; 


// const BPB = new CustomInputs();

// const initialState = {
//   email: "",
//   password: "",
// };

// const testPush = null

// export const Splash = () => {
//   const setFormType = useSettingsStore((state) => state.setFormType);
//   const setIsEdit = useSettingsStore((state) => state.setIsEdit);
//   const setIsLoading = useSettingsStore((state) => state.setIsLoading);
//   const [showMessage, setShowMessage] = useState(false);
//   const [resetPassword, setResetPassword] = useState(false);

//   const dialogFooter = (
//     <div className="flex justify-content-center">
//       <Button
//         label="OK"
//         className="p-button-text"
//         autoFocus
//         onClick={() => {
//           setShowMessage(false)
//           setResetPassword(false)
//           setIsLoading(false)}
//         }
//       />
//     </div>
//   );

//   const handleApply = () => {
//     //setFormType("Apply");
//   };

//   const handleForgotPassword = async (props) => {
//     await sendForgottenPasswordEmail(props.values.email).then(() => setFormType("forgotPassword"))
    
//   }

//   useEffect(() => {
//     setIsEdit(true);
//   });

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
//               {/*<div>
//                 Don't have an account?{" "}
//                 <Button
//                   className="p-button-text"
//                   onClick={handleApply}
//                   type="button"
//                 >
//                   APPLY NOW
//                 </Button>
//     </div>*/}
//               <BPB.CustomTextInput
//                 label="Email"
//                 name="email"
//                 converter={props}
//               />
//               <BPB.CustomPasswordInput
//                 label="Password"
//                 name="password"
//                 converter={props}
//               />
//             </div>
//           </div>
//         </GroupBox>
//         <Button
//           label="Forgot your password?"
//           type="button"
//           className="p-button-outlined p-button-primary"
//           onClick={e => handleForgotPassword(props)}
//         />
//         <Dialog
//           visible={resetPassword}
//           onHide={() => setResetPassword(false)}
//           position="top"
//           footer={dialogFooter}
//           showHeader={false}
//           breakpoints={{ "960px": "80vw" }}
          
//         >
//           <div className="flex align-items-center flex-column pt-6 px-3">
//             <i
//               className="pi pi-exclamation-circle"
//               style={{ fontSize: "5rem", color: "var(--red-500)" }}
//             ></i>
//             <h5>Please reset password</h5>
//             <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
//               We have made some changes to our authentication process and need you to please reset your password.
//             </p>
//             <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
//               Please login with the temporary password:
//             </p>
//             <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
//               admin123!
//             </p>
//             <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
//               and then reset your password to what it was, or use a new one if you want.  Sorry for the inconvenience.  Thanks!
//             </p>
//           </div>
//         </Dialog>
//         <Dialog
//           visible={showMessage}
//           onHide={() => setShowMessage(false)}
//           position="top"
//           footer={dialogFooter}
//           showHeader={false}
//           breakpoints={{ "960px": "80vw" }}
          
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
//       validationSchema={validationSchema}
//       initialState={initialState}
//       update={submitAuth}
//       setShowMessage={setShowMessage}
//       setResetPassword={setResetPassword}
//     />
//   );
// };
