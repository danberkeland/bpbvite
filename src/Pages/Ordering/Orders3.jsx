import { API } from "aws-amplify"
import React from "react"



/*********************
 * FETCHERS & STORES *
 *********************/

const gqlFetcher = async (query, variables) => {
  return (
    await API.graphql({
      query: queries.getTodo,
      variables: { variables }
    })
  )
}
    