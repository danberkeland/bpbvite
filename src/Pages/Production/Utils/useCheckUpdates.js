// Portable version of the Square order checker & overnight flip

import { DateTime } from "luxon";
import { useSettingsStore } from "../../../Contexts/SettingsZustand";
import { useListData } from "../../../data/_listData";
import { useLegacyFormatDatabase } from "../../../data/legacyData";
import { checkForUpdates } from "../../../core/checkForUpdates";
import { useState, useEffect } from "react";


export const useCheckUpdates = () => {
  const shouldFetch = true
  const delivDate = DateTime.now()
    .setZone('America/Los_Angeles')
    .startOf('day')
    .toFormat('yyyy-MM-dd')

  const setIsLoading = useSettingsStore(
    (state) => state.setIsLoading
  )
  // const ordersHasBeenChanged = useSettingsStore(
  //   (state) => state.ordersHasBeenChanged
  // )
  // const setOrdersHasBeenChanged = useSettingsStore(
  //   (state) => state.setOrdersHasBeenChanged
  // )
  const { data: database } = useLegacyFormatDatabase()
  const { mutate:mutateOrders } = useListData({ tableName: "Order", shouldFetch })
  const { mutate:mutateDoughs } = useListData({ tableName: "DoughBackup", shouldFetch })
  const { mutate:mutateProducts } = useListData({ tableName: "Product", shouldFetch })

  const [checkCompleted, setCheckCompleted] = useState(false)

  useEffect(() => {
    if (database && !checkCompleted) {
      checkForUpdates(
        database,
        true,
        true,
        delivDate,
        setIsLoading
      ).then(db => {
        // async revalidate orders, doughs, products
        setCheckCompleted(true)
        mutateOrders()
        mutateDoughs()
        mutateProducts()
      })
    }
  }, [database, delivDate])

}