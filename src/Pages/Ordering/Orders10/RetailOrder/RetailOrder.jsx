import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber} from "primereact/inputnumber"
import React, { useMemo, useState, useEffect } from "react";
import { useProductListFull } from "../../../../data/productData";
import { Button } from "primereact/button";
import { dateToYyyymmdd, getTtl, yyyymmddToJSDate } from "../../../../functions/dateAndTime";
import dynamicSort from "../../../../functions/dynamicSort";
import { createOrder, updateOrder, useCartListFull } from "../../../../data/orderData";




export const RetailOrder = () => {
  // const { data:locationList } = useLocationListSimple(true)
  const { data:productList } = useProductListFull(true)
  const { data:orders, mutate:mutateOrders } = useCartListFull()

  const retailItems = orders?.filter(i => i.isWhole === false) ?? []
  const retailList = [...new Set(retailItems.map(i => i.locNick))]
  // const retailOptions = retailList.map(locNick => ({ label: locNick, value: locNick }))

  const [locNick, setLocNick] = useState('')
  const [delivDate, setDelivDate] = useState()
  const [route, setRoute] = useState()
  const [note, setNote] = useState('')

  const [selectedLocNick, setSelectedLocNick] = useState()
  const [selectedProdNick, setSelectedProdNick] = useState()
  const [selectedQty, setSelectedQty] = useState()

  const retailName = locNick ? "retail__" + (locNick.replaceAll(' ', '_')) : (selectedLocNick ?? '')

  const header = {
    locNick: retailName,
    delivDate: delivDate ? dateToYyyymmdd(delivDate) : null,
    isWhole: false,
    route: route,
    ItemNote: note,
    ttl: delivDate ? getTtl(delivDate) : null,
    updatedBy: "bpb_admin"
  }
  const [items, setItems] = useState([])
  useEffect(() => {
    setItems(selectedLocNick ? retailItems.filter(i => i.locNick === selectedLocNick) : [])
  }, [selectedLocNick])

  const tempLocation = {locNick: retailName, locName: retailName, zone: route, ttl: delivDate && getTtl(delivDate)}
  const forSubmit = items.map(item => ({ ...item, ...header })).filter(item => !!item.id || item.qty > 0)
  
  const locNickIsValid = !!selectedLocNick || !retailList.includes(retailName)
  const routeIsValid = !!route

  return(
    <>
      <div>
        <Dropdown placeholder="Look up existing order"
          // options={retailOptions ? retailOptions : []}
          options={retailList}
          showClear
          value={selectedLocNick}
          onChange={e => {
            setSelectedLocNick(e.value)
            const matchItem = retailItems?.find(item => item.locNick === e.value)
            if (matchItem) {
              const { delivDate, route } = matchItem
              setDelivDate(yyyymmddToJSDate(delivDate))
              setRoute(route)
            }
            setLocNick('')
          }}
        />
      </div>

      <div>
        <InputText placeholder="Name for new order" 
          value={locNick} 
          onChange={e => {
            setLocNick(e.target.value)
            setSelectedLocNick('')
          }} 
          disabled={!!selectedLocNick}
        />
        <Calendar 
          placeholder="order date" 
          value={delivDate} 
          onChange={e => setDelivDate(e.target.value)} 
          disabled={!!selectedLocNick}
          readOnlyInput
        />
        <Dropdown 
          placeholder="pickup loc" 
          options={pickupOptions} 
          value={route} 
          onChange={e => {
            setRoute(e.value)
          }} 
        />
      </div>

      <h2>Items</h2>

      {items.map((item, idx) => {
        return <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "15rem", margin: ".5rem"}} key={idx}>
            <span style={{marginInline: "1rem"}}>{item.prodNick}</span>
            <InputNumber 
              placeholder="Qty"
              inputStyle={{width: "3rem"}} 
              value={item.qty}
              onChange={e => {
                setItems([...items.slice(0, idx), {...items[idx], qty: e.value}, ...items.slice(idx + 1)])
              }} 
            />
          </div>
      })}
    
      <div style={{marginBlock: "1rem"}}>
        <Dropdown placeholder="add a product" 
          optionLabel="prodName" 
          optionValue="prodNick" 
          options={productList?.sort(dynamicSort('prodName')).filter(p => !items.map(item => item.prodNick).includes(p.prodNick))} 
          value={selectedProdNick} 
          onChange={e => setSelectedProdNick(e.value)}
          style={{width: "20rem"}}
          filter
          filterBy="prodNick"  
        />
        <InputNumber 
          placeholder="Qty" 
          inputStyle={{width: "3rem"}} 
          value={selectedQty} 
          onChange={e => setSelectedQty(e.value)}
        />
        <Button style={{width: "fit-content"}} label="add" icon={(selectedProdNick && selectedQty ? "pi pi-plus" : '')}
          onClick={() => {
            if (!!selectedProdNick && !!selectedQty) {
              setItems([ ...items, { prodNick: selectedProdNick, qty: selectedQty } ])
              setSelectedProdNick(null)
              setSelectedQty(null)
            }
          }} 
        />
      </div>

      {/* <pre>{JSON.stringify(header, null, 2)}</pre>
      <pre>{JSON.stringify(locNick, null, 2)}</pre>
      <pre>{JSON.stringify(delivDate, null, 2)}</pre>
      <pre>{JSON.stringify(route, null, 2)}</pre>
      <pre>{JSON.stringify(selectedProdNick, null, 2)}</pre>
      <pre>{JSON.stringify(selectedQty, null, 2)}</pre>
      <pre>{JSON.stringify(items, null, 2)}</pre> */}


      <h2>For submission:</h2>
      <pre>items</pre>
      <pre>{JSON.stringify(forSubmit, null, 2)}</pre>
      {/* <pre>temp location</pre>
      <pre>{JSON.stringify(tempLocation, null, 2)}</pre> */}

    <Button label={selectedLocNick ? "Submit update" : "Create"} 
      style={{width: "fit-content"}}
      onClick={async () => {
        for (let item of forSubmit) {
          if (!!item.id) {
            try {
              //console.log(item)
              let resp = await updateOrder(item)
              console.log("updated")
            } catch (error) {
              console.log(error)
            }
          } else {
            try {
              //console.log(item)
              await createOrder(item)
              console.log("created")
            } catch (error) {
              console.log(error)
            }
          }

        }
        mutateOrders()
      }}
      disabled={!forSubmit.length || !locNickIsValid || !routeIsValid || !delivDate}
    />
    {!locNickIsValid && <pre>Name already in use</pre>}
    {!routeIsValid && <pre>Select a pick up location</pre>}
    {!delivDate && <pre>Select an order date</pre>}
    
    </>
  )

}


const blankItem = {
  locNick: '',
  delivDate: '',
  isWhole: false,
  route: '',
  ItemNote: '',
  prodNick: '',
  qty: '',

}

const pickupOptions = [{label: "SLO", value: "slopick"}, {label: "Carlton", value: "atownpick"}]
// const createItem = {
//   locNick: ''locNick'',
//   delivDate: dateToYyyymmdd(delivDate),
//   isWhole: true,
//   route: headerChanges.route,
//   ItemNote: headerChanges.ItemNote,
//   prodNick: submitItem.product.prodNick,
//   qty: submitItem.qty,
//   qtyUpdatedOn: new Date().toISOString(),
//   sameDayMaxQty: baseItem ? baseItem.qty : submitItem.qty,
//   rate: submitItem.rate,
//   isLate: 0,
//   updatedBy: user.name,
//   ttl: getTtl(delivDate)
// }

// const QtyInput = (qty, updateQty) => {
//   return (
//     <InputNumber 
//       min={0}
//       max={999}
//       placeholder='qty'
//       value={qty}
//       onChange={e => updateQty(e.value)}
//     />
//   )
// })