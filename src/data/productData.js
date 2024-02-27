// MARKED FOR DEPRECATION

import useSWR, { mutate } from "swr"
import { defaultSwrOptions } from "./_constants"

import { useMemo } from "react"

// import dynamicSor_t from "../functions/dynamicSor_t"

import gqlFetcher from "./_fetchers"

// import * as mutations from "../customGraphQL/mutations/productMutations"

import { sortBy } from "lodash"

// import * as yup from "yup"

/** Get all primary attributes for a product. Does not include attributes of '@connected' types. */
// const getProductDetails = /* GraphQL */ `
//   query GetProduct($prodNick: String!) {
//     getProduct(prodNick: $prodNick) {
//       Type
//       prodName
//       prodNick
//       packGroup
//       packSize
//       doughNick
//       freezerThaw
//       packGroupOrder
//       shapeDay
//       shapeNick
//       bakeDay
//       bakeNick
//       guarantee
//       transferStage
//       readyTime
//       bakedWhere
//       wholePrice
//       retailPrice
//       isRetail
//       retailName
//       retailDescrip
//       isWhole
//       isEOD
//       weight
//       descrip
//       picURL
//       squareID
//       forBake
//       bakeExtra
//       batchSize
//       defaultInclude
//       leadTime
//       qbID
//       createdAt
//       updatedAt
//       inventoryProductId
//     }
//   }
// `;

const listProductsSimple = /* GraphQL */ `
  query ListProducts(
    $prodNick: String
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProducts(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        prodName
        prodNick
      }
    }
  }
`;

const listProductsFull = /* GraphQL */ `
  query ListProducts(
    $prodNick: String
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listProducts(
      prodNick: $prodNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        Type
        prodName
        prodNick
        packGroup
        packSize
        doughNick
        freezerThaw
        packGroupOrder
        shapeDay
        shapeNick
        bakeDay
        bakeNick
        guarantee
        transferStage
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        isRetail
        retailName
        retailDescrip
        isWhole
        isEOD
        weight
        descrip
        picURL
        squareID
        forBake
        bakeExtra
        batchSize
        defaultInclude
        leadTime
        daysAvailable
        qbID
        currentStock
        whoCountedLast
        freezerClosing
        freezerCount
        freezerNorth
        freezerNorthClosing
        freezerNorthFlag
        prepreshaped
        preshaped
        updatePreDate
        updateFreezerDate
        backporchbakerypre
        backporchbakery
        bpbextrapre
        bpbextra
        bpbssetoutpre
        bpbssetout
        sheetMake
        createdAt
        updatedAt
        inventoryProductId
      }
    }
  }
`;

/** Product list that returns extra attributes to assist with order selection. */
// const listProductsForOrders = /* GraphQL */ `
//   query ListProducts(
//     $prodNick: String
//     $filter: ModelProductFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listProducts(
//       prodNick: $prodNick
//       filter: $filter
//       limit: $limit
//       nextToken: $nextToken
//       sortDirection: $sortDirection
//     ) {
//       items {
//         prodName
//         prodNick
//         packSize
//         doughNick
//         guarantee
//         readyTime
//         bakedWhere
//         isWhole
//         descrip
//         wholePrice
//         isRetail
//         retailName
//         retailDescrip
//         retailPrice
//         weight
//         picURL
//         squareID
//         defaultInclude
//         leadTime
//         # retailLoc {    <-- may want to integrate these attributes in the future...
//         #   nextToken
//         # }
//         # altPricing {
//         #   nextToken
//         # }
//         # templateProd {
//         #   nextToken
//         # }
//         # prodsNotAllowed {
//         #   nextToken
//         # }
//         # productVendor {
//         #   nextToken
//         # }
//         # altLeadTimeByLocation {
//         #   nextToken
//         # }
//         createdAt
//         updatedAt
//       }
//       nextToken
//     }
//   }
// `;

const createProductMutation = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
      prodName
      prodNick
    }
  }
`;
const updateProductMutation = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
      prodName
      prodNick
    }
  }
`;
const deleteProductMutation = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
      prodName
      prodNick
    }
  }
`;



/******************
 * QUERIES/CACHES *
 ******************/

/**
 * Produces a full list of prodNick/prodName items.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: Array<{ locNick: string, locName: string }>, errors: object }} A list of locNick ID's and locName text labels.
 */
export const useProductListSimple = (shouldFetch) => {
  const { data, error } = useSWR(
    shouldFetch ? [listProductsSimple, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (!data) return undefined
    return sortBy(data.data.listProducts.items, ['prodName'])
  }
  const _data = useMemo(transformData, [data])

  return({
    data: _data,
    errors: error
  })

}

// /** 
//  * Can be called whenever productListSimple data is affected by a mutation.
//  * Revalidation can be called anywhere, even when useProductListSimple is not present.
//  */
// export const revalidateProductListSimple = () => {
//   mutate(
//     [queries.listProductsSimple, { limit: 1000 }], 
//     null, 
//     { revalidate: true}
//   )
// }

/**
 * Lists product objects with full attributes. Sorted by prodName.
 * @param {boolean} shouldFetch Fetches data only when true.
 * @returns {{ data: Array<{ locNick: string, locName: string }>, errors: object }} A list of locNick ID's and locName text labels.
 */
export const useProductListFull = (shouldFetch) => {
  const { data, ...otherReturns } = useSWR(
    shouldFetch ? [listProductsFull, { limit: 1000 }] : null, 
    gqlFetcher, 
    defaultSwrOptions
  )

  const transformData = () => {
    if (data) return sortBy(data.data.listProducts.items, ['prodName'])
  }

  return({
    data: useMemo(transformData, [data]),
    ...otherReturns
  })

}

/** 
 * Can be called whenever productListFull data is affected by a mutation.
 * Revalidation can be called anywhere, even when useProductListFull is not present.
 */
export const revalidateProductListFull = () => {
  mutate(
    [listProductsFull, { limit: 1000 }], 
    null, 
    { revalidate: true}
  )
}

// export const useProductListForOrders = (shouldFetch) => {
//   const { data, errors } = useSWR(
//     shouldFetch ? [queries.listProductsForOrders, { limit: 1000 }] : null, 
//     gqlFetcher, 
//     defaultSwrOptions
//   )

//   const transformData = () => {
//     if (!data) return undefined
//     return getNestedObjec_t(data, ['data', 'listProducts', 'items']).sort(dynamicSor_t("locName"))
//   }
//   const _data = useMemo(transformData, [data])

//   return({
//     data: _data,
//     errors: errors
//   })

// }

// /** 
//  * Can be called whenever associated cache is affected by a mutation.
//  * Revalidation can be called anywhere, even when the associated SWR hook is not present.
//  */
// export const revalidateProductListForOrders = () => {
//   mutate(
//     [queries.listProductsForOrders, { limit: 1000 }], 
//     null, 
//     { revalidate: true}
//   )
// }

// /**
//  * Produces a more extensive list of attributes for a single product.
//  * Does not produce info for '@connected' types.
//  * @param {string} prodNick ID value for the desired product.
//  * @param {boolean} shouldFetch Fetches data only when true.
//  * @returns {{ data: object, errors: object }} A single object representing the requested product.
//  */
// export const useProductDetails = (prodNick, shouldFetch) => {
//   const { data, errors } = useSWR(
//     shouldFetch ? [queries.getProductDetails, { prodNick: prodNick }] : null, 
//     gqlFetcher, 
//     defaultSwrOptions
//   )
  
//   const _data = getNestedObjec_t(data, ['data', 'getProduct'])

//   return({ 
//     data: _data,
//     errors: errors
//   })
// }

// /** 
//  * Can be called whenever productDetails data is affected by a mutation.
//  * Revalidation can be called anywhere, even when productDetails is not present.
//  */
// export const revalidateProductDetails = (prodNick) => {
//   mutate(
//     [queries.getProductDetails, { prodNick: prodNick }],
//     null,
//     { revalidate: true }
//   )
// }


/**
 * Compound data hook + transformation. Returns a detailed product list modified
 * with Location-specific settings. Intended to use for Ordering
// */
// export const useProductDataWithLocationCustomization = (locNick) => {
//   const { 
//     data:productData, 
//     errors:productErrors, 
//     isValidating:productsAreValidating 
//   } = useProductListFull(true)

//   const { 
//       altPrices, 
//       templateProds, 
//       prodsNotAllowed, 
//       altLeadTimes, 
//       errors:locationErrors, 
//       isValidating:locationIsValidating,
//     } = useLocationDetails(locNick, !!locNick)

//   const applyCustomizations = () => {
//     if (!productData || !altPrices || !templateProds || !prodsNotAllowed || !altLeadTimes) return undefined

//     return productData.filter(item => {
//       let override = prodsNotAllowed.find(i => i.prodNick === item.prodNick)
//       //return override ? override.isAllowed : item.defaultInclude // 'override rule'
//       return override ? !item.defaultInclude : item.defaultInclude // 'negate rule'

//     }).map(item => {
//       let override = altPrices.find(i => i.prodNick === item.prodNick)
//       return override ? { ...item, wholePrice: override.wholePrice } : { ...item }

//     }).map(item => {
//       let override = altLeadTimes.find(i => i.prodNick === item.prodNick)
//       return override ? { ...item, leadTime: override.leadTime } : { ...item }

//     }).map(item => {
//       let favorite = templateProds.find(i => i.prodNick === item.prodNick)
//       return { ...item, templateProd: (favorite ? favorite.id : null)}

//     }).sort(
//       dynamicSor_t("prodName")

//     ).sort( (a, b) => {
//       let _a = a.templateProd !== null ? 0 : 1
//       let _b = b.templateProd !== null ? 0 : 1
//       return _a - _b

//     })
  
//   }

//   const productsForLocation = useMemo(
//     applyCustomizations, 
//     [productData, altPrices, templateProds, prodsNotAllowed, altLeadTimes]
//   )

//   return ({
//     data: productsForLocation,
//     errors: {
//       product: productErrors,
//       location: locationErrors
//     },
//     isValidating: (productsAreValidating || locationIsValidating)
//   })

// }

// /*************
//  * MUTATIONS *
//  *************/

// const LOGGING = true

// export const createProduct = async (createProductInput) => {
//   if (LOGGING) console.log("Create product input: ", createProductInput)

//   const response = await gqlFetcher([
//     createProductMutation, 
//     { input: createProductInput }
//   ])
//   if (LOGGING) console.log("Create product response: ", response)

// }


// export const updateProduct = async (updateProductInput) => {
//   if (LOGGING) console.log("Update product nput: ", updateProductInput)

//   const response = await gqlFetcher([
//     updateProductMutation, 
//     { input: updateProductInput }
//   ])
//   if (LOGGING) console.log("Update product response: ", response)

// }


// export const deleteProduct = async (deleteProductInput) => {

//   if (LOGGING) console.log("Delete product input: ", deleteProductInput)
//   const response = await gqlFetcher([
//     deleteProductMutation,
//     { input: deleteProductInput }
//   ])
//   if (LOGGING) console.log("Delete product response: ", response)

// }


/***********
 * SCHEMAS *
 ***********/

// const createProductSchema = yup.object().shape({
  
// })

// const updateProductSchema = yup.object().shape({

// })

// const deleteProductSchema = yup.object().shape({
//   prodNick: yup.string().required()
// })