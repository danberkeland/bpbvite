import { formatter } from "../../helpers/billingGridHelpers";

export const calcInvoiceTotal = (data) => {
  let sum = 0;
  try {
    for (let i of data) {
      sum = sum + Number(i.qty) * Number(i.rate);
    }
  } catch {
    console.log("No data to calc.");
  }
  sum = formatter.format(sum);

  return <div>{sum}</div>;
};
