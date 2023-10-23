import React, { useState } from "react"

import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"

import TimeAgo from "timeago-react"
import { maxBy, sortBy, sumBy } from "lodash"
import { reformatProdName } from "../../../../Orders10/_utils/reformatProdName"

import { CartQtyInput } from "./CartQtyInput"
import { CartSubmitButton } from "./CartSubmitButton"
import { CartItemMessages } from "../CartItemMessages"
import { DateTime } from "luxon"


export const CartItemDisplay = ({ 
  cartOrder,
  cartHeader, 
  cartItems,
  cartMeta,
  setCartItems,
  dateProps,
  wSize,
  user,
  location,
  products,
  cartCache,
  setShowSidebar,
  orderHasChanges,
  disableInputs,
  deactivated,
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const { delivDateJS, delivDateDT } = dateProps

  const fulfillmentOption = cartHeader?.route ?? ''

  // Component props

  const submitButtonProps = {
    location,
    products,
    cartOrder,
    cartHeader,
    cartItems,
    cartMeta,
    cartCache,
    // delivDateJS,
    // delivDateDT,
    ...dateProps,
    user,
    disableInputs,
    deactivated,
    orderHasChanges,
    wSize,
  }

  const lastEditItem = maxBy(
    cartItems.filter(i => 
      i.orderType === 'C' && i.updatedBy !== "standing_order"
    ), 
    item => new Date(item.updatedOn).getTime()
  )
  const lastEdit = lastEditItem 
    ? DateTime.fromISO(lastEditItem.updatedOn)
      .setZone('America/Los_Angeles')
      .toFormat('EEE MMM dd, t')
    : undefined

  const productHeaderTemplate = () => {
    return (
      <div style={{
        fontSize: "1.25rem",
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"
      }}>
        <span onClick={() => {if (user.authClass === 'bpbfull') {
          console.log("Location details:", location)
          console.log("Base Data:", cartOrder)
          console.log("Order header:", cartHeader)
          console.log("Items:", cartItems)
        }}}>
          Products
        </span> 
        <Button
          size="large"
          icon={showDetails ? "pi pi-search-minus" : "pi pi-search-plus"}
          className="p-button-rounded p-button-text p-button-lg" 
          onClick={() => setShowDetails(!showDetails)}
        />
      </div>
    )
  }
  const productColumnTemplate = (rowData) => {
    const { 
      prodNick, 
      createdOn, 
      updatedOn, 
      qty, 
      baseQty, 
      qtyUpdatedOn, 
      orderType, 
      updatedBy 
    } = rowData
    const { 
      // timingStatus, 
      // sameDayUpdate, 
      // maxQty, 
      qtyChanged 
    } = cartMeta[prodNick]

    const product = products[prodNick]
    const { prodName, packSize } = products[prodNick]

    const lastAction = orderType === 'C' && !!createdOn
      ? baseQty === 0 && updatedBy !== 'standing_order' 
        ? "Deleted"
        : createdOn === updatedOn ? "Created" : "Updated"
      : ""

    const infoMessageProps = {
      product,
      cartItem: rowData,
      cartMeta,
      fulfillmentOption, 
      user,
      ...dateProps,
    }
        
    return (
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          opacity: qty === 0 ? ".70" : "",
          
        }}
      
      >
        {user.authClass === 'bpbfull' &&
          <ItemIcon 
            product={products[prodNick]} 
            shouldFade={qty === 0}
          />
        }
        <div>
          <div style={{
            fontStyle: qtyChanged && qty > 0 ? "italic" : "normal", 
            fontWeight: "bold"
          }}>
            {reformatProdName(prodName, packSize)}
          </div>

          <CartItemMessages 
            {...infoMessageProps} 
          />
      
          {showDetails && 
            <ProductColumnDetails 
              orderType={orderType}
              lastAction={lastAction}
              updatedBy={updatedBy}
              qtyUpdatedOn={qtyUpdatedOn}
              qty={qty}
            />
          }
        </div>

      </div>

    )
  } // end productColumnTemplate

  const qtyHeaderTemplate = () => {
    if (wSize === 'lg') return "Qty"
    else return (
      <Button label="Add"
        onClick={() => setShowSidebar(true)} 
        disabled={disableInputs || deactivated} 
        style={{width: "62px", fontSize: "1.1rem"}} 
      />
    )
  }

  const qtyColumnTemplate = (rowData) => {
    const { prodNick, qty, rate } = rowData
    const product = products[prodNick]
    const { packSize } = product
    const shouldDisableSample = (rate === 0 && user.authClass !== 'bpbfull')

    return (
      <div style={{display: "flex", flexDirection: "column"}}>
        <div>
        <CartQtyInput
          rowData={rowData}
          product={product}
          cartItems={cartItems}
          cartMeta={cartMeta}
          setCartItems={setCartItems}
          user={user}
          disableInputs={disableInputs || shouldDisableSample}
          deactivated={deactivated}
        />
        </div>
        {packSize > 1 &&
          <div style={{
            paddingBlock: "0px",
            fontSize: ".85rem", 
            textAlign: "center",
            opacity: qty === 0 ? ".70" : ""
          }}>
            ({qty * packSize} ea)
          </div>
        }
        {showDetails && 
          <QtyColumnDetails 
            qty={qty}
            rate={rate}
            packSize={packSize}
          />
        }
      </div>
    )
  }
  
  const footerTemplate = () => {
    const total = sumBy(cartItems, item => item.qty * item.rate).toFixed(2) 

    return (<>
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        color: "hsl(37, 100%, 10%)",
      }}>
        <span style={{fontSize: "1.1rem" }}>
          {`Total: $${total}`}
        </span>
        <CartSubmitButton {...submitButtonProps} />
      </div>
    </>)
  }

  return (<>
    <DataTable
      value={sortBy(cartItems, i => products[i.prodNick].prodName)} 
      responsiveLayout="scroll"
      footer={footerTemplate}
      scrollable={wSize === 'lg'}
      scrollHeight={wSize === 'lg' ? "40rem" : undefined}
      style={{
        border: "none",
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
          +" 0 1px 1px 0 rgba(0, 0, 0, 0.14), "
          +"0 1px 3px 0 rgba(0, 0, 0, 0.12)",
        borderRadius: "3px",
        overflow: "hidden",
      }}
    >
      <Column
        header={productHeaderTemplate}
        headerStyle={{
          color: "hsl(37, 100%, 10%)",
        }}
        headerClassName="header-split-content"
        body={productColumnTemplate}
      />
      <Column 
        header={qtyHeaderTemplate}
        headerStyle={wSize === 'lg' 
          ? {
            fontSize: "1.25rem",
            color: "hsl(37, 100%, 10%)",
            display: "flex", 
            alignItems: "center"
          } 
          : undefined
        }
        body={qtyColumnTemplate}
        style={{width: "90px", flex: "0 0 90px"}}
      />
    </DataTable>
    
    <div style={{display: "flex", alignItems: "flex-end", flexDirection:"column"}}>
      {!!lastEdit && lastEdit !== "Invalid DateTime" &&
        <LastEditMessage lastEdit={lastEdit} />
      }
      {orderHasChanges && <EditingMessage />}
    </div>
  </>)
}

const EditingMessage = () => {
  return (
    <div 
      style={{
        marginTop: ".5rem",
        padding: ".2rem 1rem .2rem 1rem",
        // background: "rgba(255, 221, 51, .9)",
        background: "#FFECB3",
        border: "solid #d9a300",
        borderRadius: "1rem",
        borderWidth: "0px",
        color: "#6d5100",
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
          +" 0 1px 1px 0 rgba(0, 0, 0, 0.14), "
          +"0 1px 3px 0 rgba(0, 0, 0, 0.12)",
        textAlign: "center"
      }}
    >
      <i className="pi pi-pencil" /> Editing …
    </div>
  )
}

const LastEditMessage = ({ lastEdit }) => {
  return (
    <div 
      style={{
        marginTop: ".5rem",
        padding: ".2rem 1rem .2rem 1rem",
        // background: "rgba(255, 221, 51, .9)",
        background: "#9af79d",
        //border: "solid #439446",
        borderRadius: "1rem",
        //borderWidth: "0px",
        color: "#224a23",
        boxShadow: "0 2px 1px -1px rgba(0, 0, 0, 0.2),"
          +" 0 1px 1px 0 rgba(0, 0, 0, 0.14), "
          +"0 1px 3px 0 rgba(0, 0, 0, 0.12)",
        textAlign: "center"
      }}
    >
      Last submitted {lastEdit} 
    </div>
  )
}



const ProductColumnDetails = ({ 
  orderType, 
  lastAction, 
  qtyUpdatedOn, 
  updatedBy,
  qty
}) => {

  return (
    <div style={{paddingTop: ".5rem", fontSize: ".9rem"}}>
      {orderType === 'C' && !!lastAction &&
        <div>{`${lastAction} `}<TimeAgo datetime={qtyUpdatedOn}/></div>
      }
      {orderType === 'C' && !!updatedBy && 
        <div>{`by ${updatedBy}`}</div>
      }
      {orderType === 'C' && !updatedBy && qty !== 0 &&
        <div><em>-- Pending submit</em></div>
      }
      {orderType === 'S' &&
        <div>-- Standing order</div>
      }
    </div>
  )
}


const QtyColumnDetails = ({ qty, rate, packSize }) => {
  const containerStyle = { 
    paddingTop: ".25rem", 
    fontSize: ".9rem", 
    textAlign: "center"
  }

  return (
    <div style={containerStyle}>
      <div>{`$${rate.toFixed(2)}/${packSize !== 1 ? "pk" : "ea"}.`}</div>
      <div style={{paddingTop: ".5rem"}}>Subtotal:</div>
      <div>{`$${(rate * qty).toFixed(2)}`}</div>
    </div>
  )
}



const ItemIcon = ({product, shouldFade}) => {

  return <div style={{ 
    width: "3rem", height: "3rem",
    fontSize: "1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: ".5rem",
    //borderStyle: "solid",
    // borderWidth: "3px",
    // borderColor: "rgba(0, 0, 0, .5)",
    border: "solid 3px rgba(0, 0, 0, .5)",
    borderRadius: "3px",
    ...iconStyleByDoughNick[product.doughNick],
    ...iconStyleByPackGroup[product.packGroup],
    opacity: shouldFade ? "0.7" : "1",

  }}>
    {/* <div> */}
      {prodNickEmoji[product.prodNick]}  
    {/* </div> */}
  </div>
  

}


const iconStyleByPackGroup = {
  "baked pastries": {border: "double 3px var(--bpb-orange-vibrant-600)"},
  "brioche products": {border: "solid 2px darkred", background: "var(--bpb-orange-vibrant-050)"},
  "cafe menu": {},
  "focaccia": {},
  "frozen pastries": {background: "rgba(173, 216, 230, .7)", border: "double 3px rgba(97, 180, 207, 0.9)"},
  "retail": {borderStyle: "dashed"},
  "rolls": {},
  "rustic breads": {},
  "sandwich breads": {},
}

const iconStyleByDoughNick = {
  "Baguette": {background: "rgb(240, 240, 220)", border: "solid 3px rgb(170, 170, 140)"},
  "Ciabatta": {background: "rgb(0, 255, 0)"},
  "Country": {background: "rgb(144, 238, 144)", borderColor: "green", borderStyle: "solid",},
  "Croissant": {background: ""},
  "French": {background: "rgb(255, 255, 125)", border: "solid 2px rgb(165, 165, 35)"},
  "Multi": {backgroundImage: "linear-gradient(165deg, green, gold, orangered)", border: "solid 1px brown"},
  "Pretzel Bun": {borderColor: "rgb(165, 42, 0)", borderStyle: "solid", background: "var(--bpb-orange-vibrant-200)"},
  "Rye": {background: "green",},
}

const prodNickEmoji = {
  al: <div>🥐</div>,
  azapp: <div></div>,
  azpec: <div></div>,
  azpkn: <div></div>,
  bag: <div style={{fontSize: "2rem"}}>🥖</div>,
  bb: <>
    <div style={{position: "absolute", transform: "translate(-.25rem, -.25rem)"}}>🧁</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.5rem, .5rem)"}}>🫐</div>
  </>,
  bcwal: <>
    <div style={{position: "absolute", transform: "translate(-.25rem, -.25rem)"}}>🍞</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.5rem, .5rem)"}}>🧀</div>
  </>,
  bd: <div></div>,
  bdrd: <div></div>,
  bri: <div>🍞</div>,
  brn: <>
    <div style={{position: "absolute", transform: "translate(-.25rem, -.25rem)"}}>🧁</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.5rem, .5rem)"}}>🍫</div>
  </>,
  brsl: <>
    <div style={{position: "absolute", fontSize: "1.25rem", transform: "translate(-.25rem, -.25rem)"}}>🍔</div>
    <div style={{position: "absolute", fontSize: "1.25rem", transform: "translate(.25rem, .25rem)"}}>🍔</div>
  </>,
  bz: <div>🍔</div>,
  ch: <>
    <div style={{position: "absolute", transform: "translate(-.12rem, -.12rem)"}}>🥐</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.45rem, .25rem)"}}>🍫</div>
  </>,
  chch: <div></div>,
  chip: <div></div>,
  cub: <>
    <div style={{position: "absolute", fontSize: "1.25rem", transform: "translate(-.25rem, -.25rem)"}}>🥖</div>
    <div style={{position: "absolute", fontSize: "1.25rem", transform: "translate(.25rem, .25rem)"}}>🥖</div>
  </>,
  dbag: <div>🥖</div>,
  dbfdg: <div></div>,
  dtbz: <div></div>,
  dtch: <div style={{fontSize: "2rem"}}>🥖</div>,
  epi: <div></div>,
  fic: <div style={{fontSize: "1.1rem"}}>🥖</div>,
  foc: <div></div>,
  fr: <div style={{fontSize: "2rem"}}>🥖</div>,
  fral: <div>🥐</div>,
  frch: <>
    <div style={{position: "absolute", transform: "translate(-.12rem, -.12rem)"}}>🥐</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.45rem, .25rem)"}}>🍫</div>
  </>,
  frfr: <div style={{fontSize: "2rem"}}>🥖</div>,
  frmb: <div>🥐</div>,
  frmni: <div style={{fontSize: "1.25rem"}}>🥐</div>,
  frpg: <>
    <div style={{position: "absolute", transform: "translate(-.12rem, -.12rem)"}}>🥐</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.45rem, .25rem)"}}>🧀</div>
  </>,
  frpl: <div>🥐</div>,
  frsf: <>
    <div style={{position: "absolute", transform: "translate(-.12rem, -.12rem)"}}>🥐</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.45rem, .25rem)"}}>🥬</div>
  </>,
  frsl: <div></div>,
  ftmuff: <div>🧁</div>,
  hfoc: <div>🌿</div>,
  hok: <div></div>,
  lev: <div>🍞</div>,
  lgbz: <div style={{fontSize: "2rem"}}>🍔</div>,
  lglv: <div style={{fontSize: "2rem"}}>🍞</div>,
  lgmt: <div style={{fontSize: "2rem"}}>🍞</div>,
  lgpz: <div style={{fontSize: "2rem"}}>🥨</div>,
  lgry: <div style={{fontSize: "2rem"}}>🍞</div>,
  mb: <div>🥐</div>,
  mbag: <>
    <div style={{position: "absolute", fontSize: "1.25rem", transform: "translate(-.25rem, -.25rem)"}}>🥖</div>
    <div style={{position: "absolute", fontSize: "1.25rem", transform: "translate(.25rem, .25rem)"}}>🥖</div>
  </>,
  mcub: <>
    <div style={{position: "absolute", fontSize: "1.1rem", transform: "translate(-.25rem, -.25rem)"}}>🥖</div>
    <div style={{position: "absolute", fontSize: "1.1rem", transform: "translate(.25rem, .25rem)"}}>🥖</div>
  </>,
  mdch: <div></div>,
  mini: <div style={{fontSize: "1.25rem"}}>🥐</div>,
  mlti: <div>🍞</div>,
  oat: <div></div>,
  oli: <>
    <div style={{position: "absolute", transform: "translate(-.25rem, -.25rem)"}}>🍞</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.5rem, .5rem)"}}>🫒</div>
  </>,
  pbck: <div></div>,
  pec: <div></div>,
  pg: <>
    <div style={{position: "absolute", transform: "translate(-.12rem, -.12rem)"}}>🥐</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.45rem, .25rem)"}}>🧀</div>
  </>,
  pknpie: <div></div>,
  pl: <div>🥐</div>,
  prodNick: <div></div>,
  ptz: <div>🥨</div>,
  pzb: <div>🌭</div>,
  pzsl: <div></div>,
  pzst: <div></div>,
  rbag: <div>🥖</div>,
  rdch: <div style={{fontSize: "2rem"}}>🥖</div>,
  rfr: <div style={{fontSize: "2rem"}}>🥖</div>,
  rlev: <div>🍞</div>,
  rmlti: <div>🍞</div>,
  roli: <>
    <div style={{position: "absolute", transform: "translate(-.25rem, -.25rem)"}}>🍞</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.5rem, .5rem)"}}>🫒</div>
  </>,
  rrye: <div>🍞</div>,
  rye: <div>🍞</div>,
  sco: <div></div>,
  scrd: <div></div>,
  ses: <div>🍔</div>,
  sf: <>
    <div style={{position: "absolute", transform: "translate(-.12rem, -.12rem)"}}>🥐</div>
    <div style={{position: "absolute", fontSize: "1rem", transform: "translate(.45rem, .25rem)"}}>🥬</div>
  </>,
  sic: <div></div>,
  smpz: <div style={{fontSize: "1.25rem"}}>🥨</div>,
  snik: <div></div>,
  unmb: <div>🥐</div>,
  unpz: <div>🥨</div>,
  wwbz: <div></div>,
  zcock: <div></div>,
  zdog: <div>🌭</div>,
}