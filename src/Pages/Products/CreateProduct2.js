import React from "react";

import { Form, Formik } from "formik";

import { motion } from "framer-motion";
import CustomIDInput from "./CustomIDInput";
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
          packSize: 0,
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
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default CreateProduct;
