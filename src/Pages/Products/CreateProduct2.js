import React from "react";

import { Form, Formik } from "formik";

import { motion } from "framer-motion";
import {
  CustomIDInput,
  CustomInput,
  CustomFloatInput,
  CustomIntInput,
} from "../../FormComponents/CustomIDInput";
import { validationSchema } from "./ValidationSchema";

function CreateProduct() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Formik
        initialValues={{
          prodNick: "",
          prodName: "",
          wholePrice: 0,
          packSize: 1,
        }}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form>
            <CustomIDInput
              label="Product ID"
              name="prodNick"
              type="text"
              placeholder="Enter product ID"
            />
            <CustomInput
              label="Product Name"
              name="prodName"
              type="text"
              placeholder="Enter product name"
            />
            <CustomFloatInput
              label="Wholesale Price"
              name="wholePrice"
              type="tel"
              converter={props}
            />
            <CustomIntInput
              label="Pack Size"
              name="packSize"
              type="tel"
              converter={props}
            />
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default CreateProduct;
