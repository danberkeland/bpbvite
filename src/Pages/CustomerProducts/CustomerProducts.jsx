import { DataTable } from "primereact/datatable";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useCustomizedProducts } from "../Ordering/Orders/data/productHooks";
import { Column } from "primereact/column";
import { flattenDeep, maxBy, minBy, sortBy, uniqBy } from "lodash";
import { useWindowSizeDetector } from "../../functions/detectWindowSize";

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const reformatProdName = (prodName, packSize) => {
  const trimmedProdName = prodName.replace(/\([0-9]+\)/, '').trim()
  const pkString = packSize > 1 ? ` (${packSize}pk)` : ''
  return `${trimmedProdName}${pkString}`
}

export const CustomerProducts = () => {
  
  const user = {
    name: useSettingsStore(state => state.user),
    sub: useSettingsStore(state => state.username),
    authClass: useSettingsStore(state => state.authClass),
    locNick: useSettingsStore(state => state.currentLoc),
  }

  const windowSize = useWindowSizeDetector()

  const { data:PRD } = useCustomizedProducts({ 
    locNick: user.locNick, 
    shouldFetch: true, 
    format: 'list'
  })

  //if (!PRD) return <div>Loading...</div>

  const _tableData = sortBy(
    (PRD ?? []).map(P => {
      const rowGroup = P.doughNick === "Pretzel Bun" ? "pretzel" : P.packGroup || P.DoughNick
      const leadTimes = uniqBy(
        flattenDeep(Object.values(P.meta.routeOptions.deliv)).filter(route => route.isValid),
        'adjustedLeadTime'
      ).map(route => route.adjustedLeadTime)

      // console.log(P.prodNick, minBy(leadTimes), maxBy(leadTimes))

      return {
        ...P, 
        rowGroup,
        maxLeadTime: maxBy(leadTimes),
        minLeadTime: minBy(leadTimes),
      }
    }),
    ['rowGroup', 'doughNick', 'prodName', ]
  )
  const tableData = user.authClass === 'bpbfull'
    ? _tableData
    : _tableData.filter(P => P.defaultInclude)



  const headerTemplate = (data) => {
    return <div style={{
      fontSize: "1.25rem",
      fontWeight: "Bold",
      textTransform: "capitalize",
      // marginBlock: ".25rem"
      //background: "var(--bpb-surface-content-header)"
    }}>
      {data.rowGroup}
    </div>
  }

  const mobileColumnTemplate = (row) => {
    const price = row.altPricing[0] ?? row.meta.baseAttributes.wholePrice
    const unitType = row.packSize > 1 ? "pk" : "ea" 
    //const leadTime = row.readyTime >= 15 ? row.leadTime + 1 : row.leadTime
    const leadTimeText = row.maxLeadTime === row.minLeadTime 
      ? row.maxLeadTime
      : `${row.minLeadTime}-${row.maxLeadTime}`

    return <div style={{
      padding: "0 .75rem 0 .75rem",
      display: "flex", 
      justifyContent: "space-between",
      alignItems: "center",
      gap: ".5rem",  
    }}>
      <div 
        // style={{flex: "0 0 16rem"}}
      >
        <div style={{fontWeight: "bold"}}>
          {reformatProdName(row.prodName, row.packSize)}
        </div>
        <div style={{fontSize: ".9rem"}}>Lead Time: {leadTimeText} days</div>
      </div>
      <div>
        {/* <div style={{
          fontFamily: "monospace",
          fontSize: ".8rem"  
        }}>
          {row.prodNick}
        </div> */}
        <div>{USDollar.format(price)}/{unitType}</div>
        
      </div>
    </div>
  }


  

  //console.log(tableData)

  return (<div style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
    marginBottom: "10rem"
  }}>
    <DataTable 
      className="customer-products"
      value={tableData}
      //style={{width: "20rem"}}  
      groupRowsBy="rowGroup"
      rowGroupMode="subheader"
      rowGroupHeaderTemplate={headerTemplate}
      sortMode="single" 
      sortField="rowGroup"
      size="small"
      style={{marginInline: ".5rem"}}
      responsiveLayout="scroll"
    >
      {windowSize.width < 550 &&
        <Column 
          header="Products"
          headerStyle={{fontSize: "1.5rem"}}
          body={row => mobileColumnTemplate(row)}
        />
      }
      {windowSize.width > 550 && <Column header="Product" 
        headerStyle={{fontSize: "1.5rem"}}
        body={row => reformatProdName(row.prodName, row.packSize)}
      />}
      {windowSize.width > 550 && <Column header="Price" 
        field={row => {
          const price = row.altPricing[0] ?? row.meta.baseAttributes.wholePrice
          return `${USDollar.format(price)}/${row.packSize > 1 ? 'pk' : 'ea'}`
        }}
      />}
      {windowSize.width > 550 && <Column 
        header={<div style={{paddingRight: ".25rem"}}>
          Lead Time
        </div>}
        body={row => row.maxLeadTime === row.minLeadTime 
          ? row.maxLeadTime
          : `${row.minLeadTime}-${row.maxLeadTime}`
        }
        bodyStyle={{textAlign: "center"}}
      />}
      
      {/* <Column header="readyTime" field="readyTime" /> */}
      {/* <Column header="DefHide?" 
        // field="meta.baseAttributes.defaultInclude" 
        body={row => !row.meta.baseAttributes.defaultInclude ? "X" : ""}
      /> */}
      {/* <Column header="AltRule?" 
        body={row => !!row.prodsNotAllowed?.items?.[0] 
            ? !!row.prodsNotAllowed.items?.[0].defaultInclude
              ? "show"
              : "hide"
            : ""
        }
      /> */}

    </DataTable>

  </div>)

}