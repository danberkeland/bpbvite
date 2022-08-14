import React, { useContext } from "react";

import { API, graphqlOperation } from "aws-amplify";

import { listProductBackups, getProduct } from "../../graphql/queries";
import { updateProduct, createProduct } from "../../graphql/mutations";

import { SettingsContext } from "../../Contexts/SettingsContext";

import { Button } from "primereact/button";

function Products() {
  const { setIsLoading } = useContext(SettingsContext);

  const grabOldProd = async () => {
    const userList = await API.graphql(
      graphqlOperation(listProductBackups, {
        limit: "1000",
      })
    );
    return userList.data.listProductBackups.items;
  };

  const checkExistsNewProd = async (old) => {
    try {
      let prod = await API.graphql(graphqlOperation(getProduct, { sub: old }));
      console.log("prod", prod);
      return prod ? true : false;
    } catch (error) {
      console.log("Product Does not exist", error);
      return false;
    }
  };

  const updateNewProd = async (old) => {
    delete old.createdAt;
    delete old.updatedAt;
    console.log("updateOld", old);
    try {
      await API.graphql(graphqlOperation(updateProduct, { input: { ...old } }));
    } catch (error) {
      console.log("error on updating products", error);
    }
  };

  const createNewProd = async (old) => {
    delete old.createdAt;
    delete old.updatedAt;
    console.log("createOld", old);
    try {
      await API.graphql(graphqlOperation(createProduct, { input: { ...old } }));
    } catch (error) {
      console.log("error on creating products", error);
    }
  };

  const remap = () => {
    setIsLoading(true);
    grabOldProd()
      .then((oldProd) => {
        for (let old of oldProd) {
          checkExistsNewProd(old.nickName).then((exists) => {
            if (exists) {
              updateNewProd(old);
            } else {
              createNewProd(old);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Product DB updated");
      });
  };

  return (
    <React.Fragment>
      <Button label="remap Products" onClick={remap} />
    </React.Fragment>
  );
}

export default Products;
