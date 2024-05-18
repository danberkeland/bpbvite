
import { InputText } from "primereact/inputtext"
import { DBProduct } from "../../../data/types.d"
import { compareBy } from "../../../utils/collectionFns"
import { rankedSearch } from "../../../utils/textSearch"
import { Button } from "primereact/button"


const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})


export const ProductSelectorList = ({
  locNick,
  products,
  selectedProdNicks,
  setSelectedProdNicks,
  FAVR,
  orderChanges,
  query, 
  setQuery
}) => {

  // const FAVR = useTemplateProdsByLocNick({ locNick, shouldFetch: true})
  

  const displayList = (products ?? [])
    .sort(compareBy(P => P.prodName))
    .sort(compareBy(P => FAVR.data?.some(fav => fav.prodNick === P.prodNick) ?? true, 'desc'))

  const filteredDisplayList = rankedSearch(query, displayList, ['prodNick', 'prodName'])

  /** 
   * @param {DBProduct} P 
   * @param {number} idx 
   */
  const itemTemplate = (P, idx) => {
    const isSelected = !!selectedProdNicks[P.prodNick]
    const favItem = FAVR.data?.find(fav => fav.prodNick === P.prodNick)
    const isFavorite = !!favItem
    const isLastItem = idx === products.length - 1
    const unitPriceText = `${USDollar.format(P.wholePrice)}/${P.packSize > 1 ? 'pk' : 'ea'}`

    const handleToggleFav = async () => {
      if (!!favItem) {
        FAVR.updateLocalData(await FAVR.submitMutations({ deleteInputs: [{ id: favItem.id }]}))
      } else {
        FAVR.updateLocalData(await FAVR.submitMutations({ createInputs: [{ locNick, prodNick: P.prodNick}]}))
      }
    }

    return (<>
      <div key={P.prodNick + '-' + idx} style={{background: isSelected ? 'rgba(173, 216, 230, .8)' : '', borderRadius: isLastItem ? "0 0 3px 3px" : undefined, color: "var(--bpb-text-color)", paddingBlock: ".25rem"}}>
        <div style={{ padding: ".25rem", width: "100%", display: "grid", gridTemplateColumns: "1fr 5rem", paddingInline: ".5rem" }}>
          
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
              : <Button 
                  label={isSelected ? "Adding" : "Select"} 
                  className="p-button-rounded p-button-text p-overlay-badge" 
                  style={{alignSelf: "center"}} 
                  onClick={() => setSelectedProdNicks({ ...selectedProdNicks, [P.prodNick]: !selectedProdNicks[P.prodNick] })} 
                />
            }
            {unitPriceText}
          </div>
        </div>
      </div>
    </>
    )
  }

  return (
    <div style={{background: "var(--bpb-orange-vibrant-100)", borderRadius: "0px 0px 3px 3px", marginBottom: "75vh"}}>
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
      {filteredDisplayList.map((P, idx) => itemTemplate(P, idx))}
    </div>
  )
}