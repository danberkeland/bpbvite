import { useEffect, useMemo, useState } from "react";
import { DT } from "../../../utils/dateTimeFns";
import { useCombinedRoutedOrdersByDate } from "../../../data/production/useProductionData";
import { DataTable } from "primereact/datatable";
import { tablePivot } from "../../../utils/tablePivot";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext"
import { useProducts } from "../../../data/product/useProducts";
import { compareBy, countByRdc, keyBy } from "../../../utils/collectionFns";
import { DBProduct, DBStanding } from "../../../data/types.d";
import { useRoutes } from "../../../data/route/useRoutes";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge"

import { DataView } from 'primereact/dataview';
import 'primeflex/primeflex.css'
import { Button } from "primereact/button";

import "./cartOrder.css"
import { useStandingsByLocNickByDayOfWeek } from "../../../data/standing/useStandings";
import { rankedSearch } from "../../../utils/textSearch";
import { useLocation } from "../../../data/location/useLocations";
import { useTemplateProdsByLocNick } from "../../../data/templateProd/useTemplateProd";
import { useLocationProductOverridesByLocNick } from "../../../data/locationProductOverride/useLocationProductOverrides";

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const Sandbox = () => {
  const reportDT = DT.today()
  const dayOfWeek = reportDT.toFormat('EEE')

  const locNick = 'backporch'
  const shouldFetch = true
   
  const { data:loc } = useLocation({ locNick, shouldFetch: true})
  const { data:ORD } = useStandingsByLocNickByDayOfWeek({ shouldFetch, locNick, dayOfWeek })
  const FAVR = useTemplateProdsByLocNick({ locNick, shouldFetch })
  const { data:overrides } = useLocationProductOverridesByLocNick({ locNick, shouldFetch })

  const [orderChanges, setOrderChanges] = useState(/** @type {DBStanding[]} */([]))
  useEffect(() => {
    if (!!ORD) setOrderChanges(ORD.sort(compareBy(order => order.prodNick)))
  }, [ORD])
  
  
  const { data:PRD } = useProducts({ shouldFetch: true })
  const customizedProductList = (PRD ?? [])
    .sort(compareBy(P => P.prodName))
    .sort(compareBy(P => !(FAVR.data ?? []).some(f => f.prodNick === P.prodNick)))
    .filter(P => P.defaultInclude || overrides?.some(o => o.prodNick === P.prodNick && o.defaultInclude === true))


  const [selectedProducts, setSelectedProducts] = useState({})
  const nItemsSelected = Object.values(selectedProducts).reduce(countByRdc(v => !!v), 0)

  const [cartView, setCartView] = useState('cart') // 'cart'|'add'
  const selectedClass = "bpb-cart-view-button bpb-cart-view-button-selected"
  const notSelectedClass = "bpb-cart-view-button bpb-cart-view-button-not-selected"
  const changeToCartView = () => {
    const productsToAdd = Object.entries(selectedProducts)
      .filter(entry => entry[1] === true)
      .map(entry => ({
        Type: "Standing",
        locNick,
        prodNick: entry[0],
        dayOfWeek,
        qty: 0,
        isWhole: true,
        isStand: false,
      }))

    setOrderChanges(orderChanges.concat(productsToAdd).sort(compareBy(order => order.prodNick)))
    
    setCartView('cart')
    setSelectedProducts({})
    setQuery('')
  }

  /** 
   * @param {DBProduct} P 
   * @param {number} idx 
   */
  const itemTemplate = (P, idx) => {
    const isSelected = !!selectedProducts[P.prodNick]
    const favItem = FAVR.data?.find(fav => fav.prodNick === P.prodNick)
    const isFavorite = !!favItem
    const isLastItem = idx === displayProductList.length - 1
    const unitPriceText = `${USDollar.format(P.wholePrice)}/${P.packSize > 1 ? 'pk' : 'ea'}`

    const handleToggleFav = async () => {
      if (!!favItem) {
        FAVR.updateLocalData(await FAVR.submitMutations({ deleteInputs: [{ id: favItem.id }]}))
      } else {
        FAVR.updateLocalData(await FAVR.submitMutations({ createInputs: [{ locNick, prodNick: P.prodNick}]}))
      }
    }

    return (<>
      <div style={{background: isSelected ? 'rgba(173, 216, 230, .8)' : '', borderRadius: isLastItem ? "0 0 3px 3px" : undefined, color: "var(--bpb-text-color)", paddingBlock: ".25rem"}}>
        <div key={P.prodNick + '-' + idx} style={{ padding: ".25rem", width: "100%", display: "grid", gridTemplateColumns: "1fr 5rem", paddingInline: ".5rem" }}>
          
          <div>
            <div style={{display: "flex", gap: ".5rem", alignItems: "baseline"}}>
              <Button icon={isFavorite ? "pi pi-star-fill": "pi pi-star"} onClick={handleToggleFav} className="p-button-text" style={{padding: "0", width: "1.5rem", borderRadius: ".75rem"}} />
              <div style={{fontWeight: "bold"}}>{P.prodName}</div>
            </div>
            <div style={{fontSize: ".9rem", paddingLeft: ".25rem"}}>
              {P.leadTime} day lead  
            </div>

          </div>
          
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            {orderChanges?.some(order => order.prodNick === P.prodNick)
              ? <div style={{paddingBlock: ".5rem"}}>in cart</div>
              : <Button label={isSelected ? "Adding" : "Select"} className="p-button-rounded p-button-text p-overlay-badge" style={{alignSelf: "center"}} onClick={() => setSelectedProducts({...selectedProducts, [P.prodNick]: !selectedProducts[P.prodNick] })} />
            }
            {unitPriceText}
          </div>
        </div>
      </div>
      {/* {!isLastItem && 
        <div style={{marginInline: "0.5rem"}}>
          <Divider style={{marginBlock: "0.5rem"}} />
        </div>
      } */}
    </>
    )
  }



  const [query, setQuery] = useState('')
  const displayProductList = rankedSearch(
    query, 
    customizedProductList, 
    ['prodNick', 'prodName']
  )
    
  return (
    <div style={{maxWidth: "28rem"}}>
      <h1>Layout Testing</h1>


      <div style={{display: "flex", gap: "0.5rem", justifyContent: "space-between", alignItems: "center", background: "var(--bpb-orange-vibrant-100)", borderRadius: "3px", padding: ".5rem", marginBlock: "1rem"}}>
        <button className={`${cartView === 'cart' ? selectedClass : notSelectedClass}`}
          onClick={changeToCartView}
        >
          <i className="pi pi-shopping-cart p-overlay-badge">
            {nItemsSelected > 0 && <Badge value={'+' + nItemsSelected} style={{borderRadius: "1rem"}} />}
          </i>
          <div className="bpb-cart-view-button-text">Your Order</div>
        </button>

        <button className={cartView === 'add' ? selectedClass : notSelectedClass}
          onClick={() => setCartView('add')}
        >
          <i className="pi pi-plus" />
          <div className="bpb-cart-view-button-text">Add Items</div>
        </button>
      </div>

      {cartView === 'cart' && 
        <DataTable value={orderChanges} responsiveLayout="scroll">
          <Column header="Product" field="prodNick" />
          <Column header="Qty"     field="qty" />
        </DataTable>
      }
      {cartView === 'add' &&
        <div style={{background: "var(--bpb-orange-vibrant-100)", borderRadius: "3px"}}>
          <div style={{padding: ".5rem"}}>
            <span className="p-input-icon-right" style={{width: "100%"}}>
              {!!query && <i className="pi pi-fw pi-times" onClick={() => setQuery('')} style={{cursor: "pointer"}} />}
              <InputText 
                placeholder="Find Items..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Escape") setQuery('')
                  if (e.key === "Enter") e.currentTarget.blur()
                }}
                onFocus={e => e.target.select()}
                style={{width: "100%"}}
              />
            </span>
          </div>
          {displayProductList.map((P, idx) => itemTemplate(P, idx))}
        </div>
      }



    </div>
  )
}

