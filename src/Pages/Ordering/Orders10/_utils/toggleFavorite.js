import gqlFetcher from "../../../../data/fetchers"
import { createTemplateProd, deleteTemplateProd } from "../../../../customGraphQL/mutations/locationMutations"

export const toggleFav = async (locNick, prodNick, id, mutateLocation) => {
  console.log(id)

  if (!!id) await deleteFav(id)
  else await createFav(locNick, prodNick)

  mutateLocation()
}

const createFav = async (locNick, prodNick) => {
  let query = createTemplateProd
  let variables = { 
    input: {
      locNick: locNick,
      prodNick: prodNick
    }
  }

  let response = await gqlFetcher(query, variables)
  console.log("createFav", response)
}

const deleteFav = async (id) => {
  let query = deleteTemplateProd
  let variables = { 
    input: {
      id: id
    }
  }

  let response = await gqlFetcher(query, variables)
  console.log("deleteFav", response)
}
