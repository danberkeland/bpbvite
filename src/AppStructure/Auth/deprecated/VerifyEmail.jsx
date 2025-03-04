// import React, { useState } from "react";
// import { CustomInputs } from "../../FormComponents/CustomInputs";

// import { validationSchema } from "./ValidationSchema";

// import { submitConfir_m } from "./restAPI_s";
// import { withFadeIn } from "../../hoc/withFadeIn";
// import { withBPBForm } from "../../hoc/withBPBForm";
// import { GroupBox } from "../../CommonStyles";
// import { compose } from "../../utils/_deprecated/utils";
// import { Title } from "../../CommonStyles";
// import "./Splash.css";
// import { useSettingsStore } from "../../Contexts/SettingsZustand";

// const BPB = new CustomInputs();

// const initialState = {
//   confirm: "",
// };


// export const VerifyEmail = () => {
//   const setFormType = useSettingsStore((state) => state.setFormType);
//   const setIsLoading = useSettingsStore((state) => state.setIsLoading);
//   const setIsEdit = useSettingsStore((state) => state.setIsEdit);
//   // const [showMessage, setShowMessage] = useState(false);



//   setIsEdit(true)

//   const BPBLocationForm = compose(
//     withBPBForm,
//     withFadeIn
//   )((props) => {
//     console.log("props", props);
//     return (
//       <React.Fragment>
//         <GroupBox>
//           <div className="flex justify-content-center">
//             <div className="card">
//               <Title>Sign In</Title>
              
//               <BPB.CustomTextInput label="Confirmation Code" name="confirm" converter={props} />
              
//             </div>
//           </div>
//         </GroupBox>
        
//       </React.Fragment>
//     );
//   });

//   return (
//     <BPBLocationForm
//       name="auth"
//       validationSchema={validationSchema}
//       initialState={initialState}
//       update={submitConfirm}
//       setIsLoading={setIsLoading}
//       setFormType={setFormType}
//     />
//   );
// }

