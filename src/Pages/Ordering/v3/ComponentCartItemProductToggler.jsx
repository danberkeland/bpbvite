
import { Badge } from "primereact/badge"

import "./componentCartItemProductToggler.css"

const containerStyle = {
  display: "flex", 
  gap: "0.5rem", 
  justifyContent: "space-between", 
  alignItems: "center", 
  background: "var(--bpb-surface-content-header)", 
  borderRadius: "3px 3px 0px 0px", 
  padding: ".5rem", 
  marginTop: "1rem"
}

const selectedClass    = "bpb-cart-view-button bpb-cart-view-button-selected"
const notSelectedClass = "bpb-cart-view-button bpb-cart-view-button-not-selected"

export const CartItemProductToggler = ({ 
  itemViewMode,
  changeToCartView,
  changeToAddView,
  nItemsSelected,
}) => {

  

  return (
    <div style={containerStyle}>
      <button className={`${itemViewMode === 'cart' ? selectedClass : notSelectedClass}`}
        onClick={changeToCartView}
      >
        <i className="pi pi-shopping-cart p-overlay-badge">
          {nItemsSelected > 0 && <Badge value={'+' + nItemsSelected} style={{borderRadius: "1rem"}} />}
        </i>
        <div className="bpb-cart-view-button-text">Your Order</div>
      </button>

      <button className={itemViewMode === 'add' ? selectedClass : notSelectedClass}
        onClick={changeToAddView}
      >
        <i className="pi pi-plus" />
        <div className="bpb-cart-view-button-text">Add Items</div>
      </button>
    </div>
  )
}