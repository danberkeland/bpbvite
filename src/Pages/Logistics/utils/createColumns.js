
import { compareBy } from "../../../utils/collectionFns/compareBy";

export const createColumns = (listOfProducts) => {
  const sortedProducts = listOfProducts.sort(compareBy(item => item[2]))
  let columns = [
    {
      field: "customerShort",
      header: "customer",
      dataKey: "customerShort",
      width: { width: "70px" },
    },
  ];
  for (let prod of sortedProducts) {
    let newCol = {
      field: prod,
      header: prod,
      dataKey: prod,
      width: { width: "30px" },
    };
    columns.push(newCol);
  }
  return columns;
};