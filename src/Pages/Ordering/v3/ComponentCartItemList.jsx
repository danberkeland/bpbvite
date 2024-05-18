import { InputText } from "primereact/inputtext"
import { ScrollPanel } from "primereact/scrollpanel"

/** @type {React.CSSProperties} */
const containerStyle = {
  overflowY: "scroll", 
  height: "40rem",
  width: "100%", 
  background: "var(--bpb-orange-vibrant-100)", 
}

/** @type {React.CSSProperties} */
const containerStyleMobile = {
  height: "fit-content",
  width: "100%", 
  background: "var(--bpb-orange-vibrant-100)", 
  // marginBottom: "40rem",
}

export const CartItemList = ({
  cartOrder, cartChanges, setCartChanges, products, isMobile
}) => {

  const itemTemplate = (item, idx) => {
    const product = products.find(P => P.prodNick === item.prodNick)
    const { prodName, wholePrice } = (product ?? {})

    const baseItem = cartOrder.find(order => order.prodNick === item.prodNick)
    const { qty:baseQty } = (baseItem ?? {})

    return (
      <div
        key={`cart-${idx}`} 
        style={{
          display: "grid", 
          gridTemplateColumns: "1fr 3.5rem", 
          columnGap: "1rem", 
          padding: "1rem",
        }}
      >
        <div style={{color: "var(--bpb-text-color)"}}>
          {prodName}
        </div>
        <div>
          <InputText value={item.qty} style={{width: "3.5rem"}} />
        </div>
      </div>
    )
  }

  return (
    // <ScrollPanel 
    //   style={{
    //     width: "100%", 
    //     background: "var(--bpb-orange-vibrant-100)", 
    //     height: "40rem"
    //   }}
    // >
    //   {(cartChanges ?? []).map((item, idx) => itemTemplate(item, idx))}
    // </ScrollPanel>
    <div style={isMobile ? containerStyleMobile : containerStyle}>
      {(cartChanges ?? []).map((item, idx) => itemTemplate(item, idx))}
    </div>

  )
}