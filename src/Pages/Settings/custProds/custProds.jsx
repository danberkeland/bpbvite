import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

import "./styles.css";

import {
  deleteProdsNotAllowed,
  createProdsNotAllowed,
  deleteTemplateProd,
  createTemplateProd,
  deleteAltPricing,
  createAltPricing,
  updateAltPricing,
} from "../../../graphql/mutations";

import { API, graphqlOperation } from "aws-amplify";

import { useSettingsStore } from "../../../Contexts/SettingsZustand";
// import {
//   revalidateProductListFul_l,
//   useProductListFul_l,
// } from "../../../data/productDat_a";

// import {
//   revalidateLocationListFul_l,
//   useLocationListFul_l,
// } from "../../../data/locationDat_a";
import { useLocations } from "../../../data/location/useLocations";
import { useListData } from "../../../data/_listData";
import { compareBy, groupByObject, keyBy } from "../../../utils/collectionFns";
import { useProducts } from "../../../data/product/useProducts";

const clonedeep = require("lodash.clonedeep");

const CustProds = () => {
  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const modifications = useSettingsStore((state) => state.isChange);
  const setModifications = useSettingsStore((state) => state.setIsChange);
  // const chosen = useSettingsStore((state) => state.chosen);
  // const setChosen = useSettingsStore((state) => state.setChosen);

  // const { data: products } = useProductListFul_l(true);
  // const { data: customers } = useLocationListFul_l(true);

  const { data: products, mutate:revalidateProductListFull } = useProducts({ shouldFetch: true })

  const { data: LOC, mutate:revalidateLocationListFull } = useLocations({ shouldFetch: true })
  const { data: TMP } = useListData({ tableName: "TemplateProd", shouldFetch: true })
  const { data: PNA } = useListData({ tableName: "ProdsNotAllowed", shouldFetch: true })
  const { data: ALT } = useListData({ tableName: "AltPricing", shouldFetch: true })

  const customers = useMemo(() => {
    if (!LOC || !TMP || !PNA || !ALT) return undefined

    const productDict = keyBy(products, P => P.prodNick)

    const pnaByLocNick = groupByObject(PNA, pna => pna.locNick)
    const tmpByLocNick = groupByObject(TMP, tmp => tmp.locNick)
    const altByLocNick = groupByObject(ALT, alt => alt.locNick)

    return LOC.map(L => ({
      ...L,
      prodsNotAllowed: { 
        items: (pnaByLocNick[L.locNick] ?? []).map(pna => ({ 
          ...pna,
          product: {
            prodNick: pna.prodNick,
            prodName: productDict[pna.prodNick].prodName
          }
        })) 
      },
      customProd: { 
        items: (altByLocNick[L.locNick] ?? []).map(alt => ({
          ...alt,
          product: {
            prodNick: alt.prodNick,
            prodName: productDict[alt.prodNick].prodName
          }
        }))
      },
      templateProd: {
        items: (tmpByLocNick[L.locNick] ?? []).map(tmp => ({
          ...tmp,
          product: {
            prodName: productDict[tmp.prodNick].prodName
          }
        }))
      }
    }))
    .sort(compareBy(L => L.locName))
  }, [LOC, TMP, PNA, ALT])

  const [productList, setProductList] = useState(products);

  console.log("products", products);
  console.log("customers", customers);

  const [
    altPricing, 
    // setAltPricing
  ] = useState([]);

  const customerGroup = customers;
  // useEffect(() => {
  //   setChosen("");
  // }, []);
  const [chosen, setChosen] = useState("")

  useEffect(() => {
    console.log("productLst", productList);
  }, [productList]);

  useEffect(() => {
    if (!!customers && !!products && !!chosen) {
    try {
      let newProdList = clonedeep(products);
      for (let prod of newProdList) {
        let custId = customers.findIndex((custo) => chosen === custo.locName);
        let prodId = products.findIndex((up) => up.prodName === prod.prodName);
        prod.updatedRate = products[prodId].wholePrice;

        let includeChecks = customers[custId].prodsNotAllowed;

        console.log("includeChecks", includeChecks);

        let customChecks = customers[custId].customProd;
        console.log("customChecks", customChecks);

        let templateChecks = customers[custId].templateProd;
        console.log("templateChecks", templateChecks);

        prod.prePop = false;

        for (let check of customChecks.items) {
          console.log("check1", check);
          if (prod.prodName === check.product.prodName) {
            prod.updatedRate = check.wholePrice;
          }
        }

        for (let check of templateChecks.items) {
          console.log("check2", check.product.prodName);
          if (prod.prodName === check.product.prodName) {
            prod.prePop = true;
          }
        }

        for (let check of includeChecks.items) {
          console.log("check3", check);
          if (prod.prodName === check.product.prodName) {
            prod.defaultInclude = check.isAllowed;
          }
        }

        prod.prev = prod.updatedRate;
        prod.includeClicks = false;
        prod.defaultClicks = false;
        prod.inc = includeChecks;
        prod.temp = templateChecks;
        prod.alt = customChecks;
      }

      setProductList(newProdList);
    } catch {
      console.log("not ready yet");
    }
    }
  }, [customers, products, chosen]);

  const isIncluded = (data) => {
    return (
      <React.Fragment>
        <Checkbox
          inputId="binary"
          checked={data.defaultInclude}
          onChange={(e) => handleCheck(e, data.prodName)}
        />
      </React.Fragment>
    );
  };

  const prePop = (data) => {
    return (
      <React.Fragment>
        <Checkbox
          inputId="binary"
          checked={data.prePop}
          onChange={(e) => handlePrePopCheck(e, data.prodName)}
        />
      </React.Fragment>
    );
  };

  const handleCheck = (e, prodName) => {
    let prodListToUpdate = clonedeep(productList);
    let ind = productList.findIndex((prod) => prod.prodName === prodName);
    prodListToUpdate[ind].defaultInclude = e.target.checked;
    prodListToUpdate[ind].includeClicks = !prodListToUpdate[ind].includeClicks;
    setProductList(prodListToUpdate);
    setModifications(true);
  };

  const handlePrePopCheck = (e, prodName) => {
    let prodListToUpdate = clonedeep(productList);
    let ind = productList.findIndex((prod) => prod.prodName === prodName);
    prodListToUpdate[ind].prePop = e.target.checked;
    prodListToUpdate[ind].defaultClicks = !prodListToUpdate[ind].defaultClicks;
    setProductList(prodListToUpdate);
    setModifications(true);
  };

  const handleRateChange = (e, prodName) => {
    if (e.code === "Enter") {
      setModifications(true);

      let prodListToUpdate = clonedeep(productList);
      prodListToUpdate[
        productList.findIndex((prod) => prod.prodName === prodName)
      ].updatedRate = e.target.value;
      setProductList(prodListToUpdate);
    }
  };

  const handleRateBlurChange = (e, prodName) => {
    setModifications(true);

    let prodListToUpdate = clonedeep(productList);
    prodListToUpdate[
      productList.findIndex((prod) => prod.prodName === prodName)
    ].updatedRate = Number(e.target.value).toFixed(2);
    setProductList(prodListToUpdate);
  };

  const changeRate = (data) => {
    return (
      <InputNumber
        placeholder={data.updatedRate}
        value={data.updatedRate}
        size="4"
        mode="decimal"
        locale="en-US"
        minFractionDigits={2}
        onKeyDown={(e) => handleRateChange(e, data.prodName)}
        onBlur={(e) => handleRateBlurChange(e, data.prodName)}
      />
    );
  };

  const wholeData = (data) => {
    let stockClassName = data.wholePrice !== data.updatedRate ? "instock" : "";
    return <div className={stockClassName}>{data.wholePrice}</div>;
  };

  const setPrev = (data) => {
    if (data.prev === data.updatedRate) {
      return "";
    } else {
      return <div>{Number(data.prev).toFixed(2)}</div>;
    }
  };

  const handleChosen = (chose) => {
    let newProdList = clonedeep(products);
    for (let prod of newProdList) {
      prod.updatedRate =
        products[
          products.findIndex((up) => up.prodName === prod.prodName)
        ].wholePrice;
      for (let alt of altPricing) {
        if (alt.custName === chosen && alt.prodName === prod.prodName) {
          prod.updatedRate = alt.wholePrice;
        }
      }

      // find chosen customer
      // for cust of customProd, invert check

      prod.prev = prod.updatedRate;
    }
    setProductList(newProdList);
    setChosen(chose);
  };

  const rowClass = (data) => {
    return {
      "not-included": data.defaultInclude === false,
      "price-differ": data.wholePrice !== data.updatedRate,
    };
  };

  const updateCustProd = async () => {
    setIsLoading(true);
    console.log("chosen", chosen);
    let custId = customers.findIndex((custo) => chosen === custo.locName);
    let locNick = customers[custId].locNick;
    for (let prod of productList) {
      let incFlag = false;
      if (prod.includeClicks === true) {
        for (let inc of prod.inc.items) {
          if (prod.prodName === inc.product.prodName) {
            console.log(
              "Delete from includes",
              inc.product.prodName + " " + inc.id
            );
            let updateDetails = {
              id: inc.id,
            };

            try {
              let update = await API.graphql(
                graphqlOperation(deleteProdsNotAllowed, {
                  input: { ...updateDetails },
                })
              );
              console.log("Successful", update);
            } catch (error) {
              console.log("error on deleting prodsNotAllowed", error);
            }

            incFlag = true;
          }
        }
        if (!incFlag) {
          console.log("add to includes", prod.prodName);
          let updateDetails = {
            prodNick: prod.prodNick,
            locNick: locNick,
            isAllowed: prod.defaultInclude,
          };

          try {
            let update = await API.graphql(
              graphqlOperation(createProdsNotAllowed, {
                input: { ...updateDetails },
              })
            );
            console.log("Successful", update);
          } catch (error) {
            console.log("error on creating prodsNotAllowed", error);
          }
        }
      }
      let tempFlag = false;
      if (prod.defaultClicks === true) {
        for (let temp of prod.temp.items) {
          if (prod.prodName === temp.product.prodName) {
            console.log(
              "Delete from temp",
              temp.product.prodName + " " + temp.id
            );
            let updateDetails = {
              id: temp.id,
            };

            try {
              let update = await API.graphql(
                graphqlOperation(deleteTemplateProd, {
                  input: { ...updateDetails },
                })
              );
              console.log("Successful", update);
            } catch (error) {
              console.log("error on deleting tempProd", error);
            }
            tempFlag = true;
          }
        }
        if (!tempFlag) {
          console.log("add to temp", prod.prodName);
          let updateDetails = {
            prodNick: prod.prodNick,
            locNick: locNick,
          };

          try {
            let update = await API.graphql(
              graphqlOperation(createTemplateProd, {
                input: { ...updateDetails },
              })
            );
            console.log("Successful", update);
          } catch (error) {
            console.log("error on creating templateProd", error);
          }
        }
      }

      let altFlag = false;
      if (Number(prod.prev) !== Number(prod.updatedRate)) {
        for (let alt of prod.alt.items) {
          if (prod.prodName === alt.product.prodName) {
            if (prod.wholePrice === Number(prod.updatedRate)) {
              console.log(
                "Delete from alt",
                alt.product.prodName + " " + alt.id
              );

              let updateDetails = {
                id: alt.id,
              };

              try {
                let update = await API.graphql(
                  graphqlOperation(deleteAltPricing, {
                    input: { ...updateDetails },
                  })
                );
                console.log("Successful", update);
              } catch (error) {
                console.log("error on deleting altPricing", error);
              }

              altFlag = true;
            } else {
              console.log(
                "Update from alt",
                alt.product.prodName + " " + alt.id
              );

              let updateDetails = {
                id: alt.id,
                prodNick: prod.prodNick,
                locNick: locNick,
                wholePrice: Number(prod.updatedRate),
              };

              try {
                let update = await API.graphql(
                  graphqlOperation(updateAltPricing, {
                    input: { ...updateDetails },
                  })
                );
                console.log("Successful", update);
              } catch (error) {
                console.log("error on updating altPricing", error);
              }

              altFlag = true;
            }
          }
        }
        if (!altFlag) {
          console.log("add to alt", prod.prodName);

          let updateDetails = {
            prodNick: prod.prodNick,
            locNick: locNick,
            wholePrice: Number(prod.updatedRate),
          };

          try {
            let update = await API.graphql(
              graphqlOperation(createAltPricing, {
                input: { ...updateDetails },
              })
            );
            console.log("Successful", update);
          } catch (error) {
            console.log("error on creating altPricing", error);
          }
        }
      }
    }
    setIsLoading(false);
    setModifications(false);
    revalidateProductListFull();
    revalidateLocationListFull();
  };

  return (
    <React.Fragment>
      <Dropdown
        id="customers"
        value={chosen}
        options={customerGroup}
        optionLabel="locName"
        placeholder={chosen === "  " ? "Select a Customer ..." : chosen}
        onChange={(e) => handleChosen(e.value.locName)}
      />
      <Button
        label="Update Customer Products"
        icon="pi pi-plus"
        onClick={updateCustProd}
        className={
          modifications
            ? "p-button-raised p-button-rounded p-button-danger"
            : "p-button-raised p-button-rounded p-button-success"
        }
      />
      {chosen !== "" ? (
        <div className="orders-subtable">
          <h2>Product Availability for {chosen}</h2>
          <DataTable
            value={productList}
            className="p-datatable-sm"
            rowClassName={rowClass}
          >
            <Column
              field="included"
              header="Included"
              body={(e) => isIncluded(e, productList)}
            ></Column>
            <Column
              field="prePop"
              header="Default Items"
              body={(e) => prePop(e, productList)}
            ></Column>
            <Column field="prodName" header="Product"></Column>
            <Column></Column>
            <Column
              field="updatedRate"
              header="Customer Rate"
              body={(e) => changeRate(e)}
            >
              {" "}
            </Column>
            <Column
              field="prev"
              header="Prev"
              className="instock"
              body={(e) => setPrev(e)}
            ></Column>
            <Column
              field="wholePrice"
              header="Default Rate"
              body={wholeData}
            ></Column>
          </DataTable>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default CustProds;
