import { isoToDT } from "../utils"

import { useListData } from "../../../../../data/_listData"
import { useBpbn1Data } from "../data/data"
import { useBaguetteData } from "./data/baguetteData"
import { useDoobieStuff } from "./data/doobieStuff"

import { exportBpbn1Pdf } from "./exportPdf"


/**
 * Make the Bpbn1 export button "Portable". Loads all the SWR caches that power
 * database updates and pdf exports. Cache de-duplication lets us do this with
 * little extra overhead. Can be used on a dedicated "Closing/Backup" page.
*/
export const useExportBpbn1 = ({ reportDate, shouldFetch }) => {
  const displayDate = isoToDT(reportDate).toFormat('M/dd/yyyy')

  const { rusticData, otherPrepData } = useBpbn1Data({
    reportDate,
    shouldShowZeroes: false,
    shouldFetch,
  })
  const doobieStuff = useDoobieStuff({ reportDate })
  const { data:baguetteData } = useBaguetteData({ reportDate, shouldFetch })

  const doughCache = useListData({ tableName: "DoughBackup", shouldFetch })

  const allSourceData = [
    rusticData, 
    otherPrepData, 
    doobieStuff, 
    baguetteData, 
    doughCache
  ]
  const allLoaded = allSourceData.every(src => !!src)
  if (!allLoaded) return undefined

  const exportBpbn1 = async () => {
    const { mixes, bins, pans, buckets, nBucketSets } = baguetteData
    
    exportBpbn1Pdf({
      rusticData,
      doobieStuff,
      otherPrepData,
      mixes,
      bins,
      pans,
      buckets,
      displayDate,
      filename: `BPBN_Baker1_${reportDate}.pdf`,
    })
    const baguetteDoughItem = 
      doughCache.data.find(D => D.doughName === 'Baguette')

    console.log("nBucketSets", nBucketSets)

    const updateInput = {
      id: baguetteDoughItem.id,
      preBucketSets: nBucketSets
    }

    doughCache.updateLocalData(
      await doughCache.submitMutations({ updateInputs: [updateInput] })
    )

    console.log("BPBN1 export completed")

  }

  return exportBpbn1

}