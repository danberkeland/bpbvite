import { API } from "aws-amplify"

const gqlFetcher = async (query, variables) => {
  return (
    await API.graphql({
      query: query,
      variables: variables 
    })
  )
}

export default gqlFetcher