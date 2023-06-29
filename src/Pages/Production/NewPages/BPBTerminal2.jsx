// not sure why useState variables get "stuck" in the Terminal.
// Initial values will display correctly, but updates (at least ones made thru terminal commands)
// do not show, even while components outside the terminal update correctly.
// holding/updating a value seems to work with useRef, however.
//
// a simple add function in the cli can update/modify a state variable
// for interacting with other components, and also hold that value with a ref
// for CLI responses, and for providing the state setter with the correct
// value to update.

import React, { useEffect, useRef, useState } from "react"
import { Terminal } from "primereact/terminal"
import { TerminalService } from 'primereact/terminalservice'
import { useListData } from "../../../data/_listData"

export const BPBTerminal = () => {
  const [prompt, setPrompt] = useState("bpb $")
  const [module, setModule] = useState({ number: 0 , total: 0 })
  const [date, setDate] = useState(new Date().toISOString())

  const [state, setState] = useState(null)
  const ref = useRef(null)


  const [commandQueue, setCommandQueue] = useState([])
  const [isExecuting, setIsExecuting] = useState(false)

  const [tResponse, setTResponse] = useState('')

  const {data:locationList} = useListData({ shouldFetch: true, tableName: "Location" })

  console.log("locationList", locationList)


  const executeCommand = (commandObj) => {
    return 
  }

  useEffect(() => {
    if (!commandQueue.length || isExecuting) return

    setIsExecuting(true)
    const commandObj = commandQueue[0]

    try{ 
      tResponse = tResponse.push(executeCommand(commandObj))
    } catch { console.log("ERROR") }
    setIsExecuting(false)

    TerminalService.emit('response', tResponse)

  }, [commandQueue])






  const addToTotal = (input) => {
    ref.current += input
    setState(ref.current)
    console.log("state", state)

    return ref.current

  }


  const addHandler = (input, module) => {
    console.log(input)
    if (input === 'exit') {
      setModule()
      setPrompt("bpb $")

      //TerminalService.off('command', addHandler)
      TerminalService.on('command', commandHandler)
    }
    // if (isNumeric(input)) {
      
    //   setModule(module + Number(input))
    //   terminalRef.current += Number(input)
    //   const resp = <div>{`Total: ${terminalRef.current}`}</div>
    //   TerminalService.emit('response', resp)
    // }
    if (isNumeric(input)) {
      
      const resp = addToTotal(Number(input))

      TerminalService.emit('response', "total: " + resp)
    }
  }


  const commandHandler = (text) => {
    let response;

    if (text === 'add') {
      
      setModule({number: 0, total: 0})

      ref.current = 0
      setState(0)
      //TerminalService.off('command', commandHandler)
      TerminalService.emit('clear');
      TerminalService.on('command', addHandler)
      TerminalService.emit('response', "enter numbers for running total")
      setPrompt("bpb/add $")
    }


    if (text === 'date') {
      TerminalService.emit('response', date)
    }

    if (text === 'setdate') {
      setDate(new Date().toISOString())
      TerminalService.emit('response', date)
    }


    if (text === "clear") {
      TerminalService.emit('clear');
    }




    // if (response)
    //     TerminalService.emit('response', response);
    // else
    //     TerminalService.emit('clear');
  };

  useEffect(() => {
    TerminalService.on('command', commandHandler)

    return () => {
        TerminalService.off('command', commandHandler)
    }
  }, [date, module])

  return(
    <div className="bpb-terminal-container"
      style={{}}
    >

      <Terminal 
        welcomeMessage="Welcome to the BPB Terminal. Type 'help' or '?' for help." 
        prompt={prompt}
      />
      <pre>{JSON.stringify(module)}</pre>
      <pre>{JSON.stringify(state)}</pre>

    </div>
  )
}






function isNumeric(value) {
  return /^-?\d+$/.test(value);
}



// const bpbRoutes = {
//   ordering: {
//     cart: () => cartHandler(),
//     standing: () => standingHandler()
//   }
//   locations: () => locHandler()
// }

