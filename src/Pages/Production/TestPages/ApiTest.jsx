import axios from "axios";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { QB2 } from "../../../data/qbApiFunctions";



export function ApiTest() {

  const invokeUrl = "https://hh4pyky7ph.execute-api.us-east-2.amazonaws.com"
  const routes = [
    "/invoices/get",
    "/invoices/get-pdf",
    "/invoices/create",
    "/invoices/delete",
    "/invoices/query/by-date",
    "/invoices/query/by-doc-number",
  ]

  const [response, setResponse] = useState("") 
  const handleClick1 = async () => {
    // const r = await axios.post(invokeUrl + "/invoices/query/by-doc-number", { DocNumber: "10252024high" })

    const DocNumber = "10252024high"
    const r = await QB2.invoice.query.byDocNumber(DocNumber)
    setResponse(r)
  }

  const handleClick2 = async () => {
    // const r = await axios.post(invokeUrl + "/invoices/query/by-date", { TxnDate: "2024-10-28" })

    const TxnDate = "2024-10-28"
    const r = await QB2.invoice.query.byTxnDate(TxnDate)
    console.log(r)
    setResponse(r)
  }

  const handleClick3 = async () => {
    const r = await QB2.getToken()
    console.log(r)
    setResponse(r)
  }

  const handleClick4 = async () => {
    const r = await QB2.invoice.getPdf("241565")
    console.log(r)
    setResponse(r)
  }

  return (
    <div>
      <Button style={{ display: "block", margin: "1rem"}} onClick={handleClick1}>
        Test Query By DocNumber
      </Button>
      <Button style={{ display: "block", margin: "1rem"}} onClick={handleClick2}>
        Test Query By Date
      </Button>
      <Button style={{ display: "block", margin: "1rem"}} onClick={handleClick3}>
        Test token
      </Button>
      <Button style={{ display: "block", margin: "1rem"}} onClick={handleClick4}>
        Test PDF
      </Button>
      <div>
        <pre>
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  )
}