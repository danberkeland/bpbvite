import useSWR from "swr"
import dynamicSort from "../Functions/dynamicSort"
import { dateToMmddyyyy } from "../Functions/dateAndTime"
import { getNestedObject } from "../Functions/getNestedObject"
import { gqlFetcher } from "./fetchers"
import * as queries from "./gqlQueries"

const usualOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
}

export const useProductData = () => {
  const { data, errors } = useSWR([queries.listProducts, {limit: 1000}], gqlFetcher, usualOptions)

  const _data = getNestedObject(data, ['data', 'listProducts', 'items'])
  _data?.sort(dynamicSort("prodName"))

  //if (_data) console.log(_data.slice(0,6))

  return({
    data: _data,
    errors: errors
  })
}