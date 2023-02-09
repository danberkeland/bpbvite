import React, { useState } from "react"
import Orders9 from "./Archive/Orders9/Orders9"
import Orders10 from "./Orders10/Orders10"

const Ordering2 = () => {
  const [page, setPage] = useState('Orders9')

  return(
    <div>
      <button style={{padding: '0.5rem'}} onClick={()=> setPage(page === 'Orders9' ? 'Orders10' : 'Orders9')}>page toggle</button>

      {page === 'Orders9' && 
        <Orders9 />
      }
      {page === 'Orders10' && 
        <Orders10 />
      }
    </div>
  )
}

export default Ordering2

// Ordering2 exists for convenience so that we can swap/iterate work 
// more easily without leaving the Ordering folder.
