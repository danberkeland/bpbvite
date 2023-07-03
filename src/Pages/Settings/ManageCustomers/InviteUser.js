import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import * as Yup from 'yup';
import hashSum from 'hash-sum';

const locationOptions = [
  { locName: 'Location 1', locNick: 'loc1' },
  { locName: 'Location 2', locNick: 'loc2' },
  { locName: 'Location 3', locNick: 'loc3' },
];

const authTypeOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
];

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const InviteUser = () => {
  const [submittedValues, setSubmittedValues] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      location: null,
      authType: null,
    },
    validationSchema,
    onSubmit: values => {
      const hashCode = generateHashCode(values);
      setSubmittedValues({ ...values, hashCode });
    },
  });

  const handleFormReset = () => {
    formik.resetForm();
    setSubmittedValues(null);
  };

  const generateHashCode = values => {
    const { email, location, authType } = values;
    const dataToHash = email + location.locName + authType;
    const hashCode = hashSum(dataToHash).toString();
    return hashCode.substr(0, 6); // Truncate to 6 characters
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit} onReset={handleFormReset}>
        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={formik.errors.email && formik.touched.email ? 'p-invalid' : ''}
          />
          {formik.errors.email && formik.touched.email && (
            <small className="p-error">{formik.errors.email}</small>
          )}
        </div>

        <div className="p-field">
          <label htmlFor="location">Location</label>
          <Dropdown
            id="location"
            name="location"
            options={locationOptions}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.location}
            placeholder="Select a location"
            optionLabel="locName"
            optionValue="locNick"
            className={formik.errors.location && formik.touched.location ? 'p-invalid' : ''}
          />
          {formik.errors.location && formik.touched.location && (
            <small className="p-error">{formik.errors.location}</small>
          )}
        </div>

        <div className="p-field">
          <label htmlFor="authType">Auth Type</label>
          <Dropdown
            id="authType"
            name="authType"
            options={authTypeOptions}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.authType}
            placeholder="Select an auth type"
            className={formik.errors.authType && formik.touched.authType ? 'p-invalid' : ''}
          />
          {formik.errors.authType && formik.touched.authType && (
            <small className="p-error">{formik.errors.authType}</small>
          )}
        </div>

        <div>
          <Button type="submit" label="Submit" />
          <Button type="reset" label="Reset" className="p-button-secondary" />
        </div>
      </form>

      {submittedValues && (
        <div className="p-mt-3">
          <h5>Submitted Values:</h5>
          <p>Email: {submittedValues.email}</p>
          <p>Location: {submittedValues.location.locName}</p>
          <p>Auth Type: {submittedValues.authType}</p>
          <p>Hash Code: {submittedValues.hashCode}</p>
        </div>
      )}
    </div>
  );
};

export default InviteUser;
