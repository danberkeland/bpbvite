import React, { useEffect, useState } from "react"
import { QB } from "../../data/qbApiFunctions"


export const PageQbAuthCallback = () => {

  const [response, setResponse] = useState()
  useEffect(() => {
    const doTheThing = async () => {
      const r = await QB.completeAuthFlow({ authUri: window.location.href })
      console.log("RESP:", r)
      return r
    }
    
    const r = doTheThing()
    setResponse(r)
    
  }, [])

  return (
    <div style={{margin: "4rem"}}>
      <h1>Refreshing Tokens...</h1>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  )

}