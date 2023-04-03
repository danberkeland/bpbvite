import { API } from "aws-amplify"

const gqlFetcher = async (query, variables) => {
 
  const data = await API.graphql({
    query: query,
    variables: variables,
  });
 
  return data;
};

export default gqlFetcher;



export const APIGatewayFetcher = async (path, body) => {
  return await API.post('bpbGateway', path, body)
}



