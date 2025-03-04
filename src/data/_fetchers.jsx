import { API } from "aws-amplify"

/**
 * @template T
 * @returns {Promise<import("@aws-amplify/api-graphql").GraphQLResult<T>>}
 */
const gqlFetcher = async ([query, variables]) => {
 
  const data = await API.graphql({
    query: query,
    variables: variables,
  });
 
  return data;
};

export default gqlFetcher;



export const APIGatewayFetcher = async ([path, body]) => {
  return await API.post('bpbGateway', path, body)
}

export const gqlFetcherNoAwait = async ([query, variables]) => {
 
  return API.graphql({
    query: query,
    variables: variables,
  })
}
