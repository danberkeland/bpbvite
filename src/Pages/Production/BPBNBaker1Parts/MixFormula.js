import { todayPlus } from '../../../helpers/dateTimeHelpers';
import { getMixInfo } from './GetMixInfo'

let tomorrow = todayPlus()[1]

export const mixFormula = (doughs, infoWrap, multi, deliv) => {
    //  Set up Mix 1

    console.log("infoWrap",infoWrap)
  
    let [dough, multiple, stickerAmount, bucketSets, mixes, info] = getMixInfo(
      doughs,
      infoWrap
    );
     stickerAmount = (
      Number(dough.needed) +
      Number(dough.buffer) +
      Number(dough.short)
    ).toFixed(2);

    bucketSets = dough.bucketSets
    if (deliv===tomorrow){
      console.log("using preBucketSets")
      bucketSets = dough.preBucketSets
    }
    
    let OldDough = dough.oldDough
    
    if(multi === 0 && (Number(OldDough
      )>(Number(stickerAmount)*.2))){
      OldDough = stickerAmount*.2
      
    }
  
    let Mix1BucketSets = Math.round(bucketSets * multiple[multi]);
    
    let Mix1OldDough = (OldDough * multiple[multi]).toFixed(2);
    let Mix150lbFlour = Math.floor(
      (0.5730 * ((stickerAmount-OldDough) * multiple[multi]) - (Mix1BucketSets * 19.22)) / 50
    );
    let Mix125lbWater = Math.floor(
      (0.374 * ((stickerAmount-OldDough) * multiple[multi]) - (Mix1BucketSets * 19.22)) / 25
    );
    let Mix1BreadFlour = (
      (0.5730 * ((stickerAmount-OldDough) * multiple[multi]) - (Mix1BucketSets * 19.22)) % 50
    ).toFixed(2);
    let Mix1WholeWheat = (0.038 * (stickerAmount-OldDough) * multiple[multi]).toFixed(2);
    console.log("stickerAmount",stickerAmount)
    console.log("oldDough",OldDough)
    console.log("bucketSets",bucketSets)
    console.log("multiple",multiple[multi])
    let Mix1Water = (
      ((0.374 * (stickerAmount-OldDough) - bucketSets * 19.22) * multiple[multi]) %
      25
    ).toFixed(2);
    let Mix1Salt = (0.013 * (stickerAmount-OldDough) * multiple[multi]).toFixed(2);
    let Mix1Yeast = (0.002 * (stickerAmount-OldDough) * multiple[multi]).toFixed(2);
  
    return [
      { title: "Bucket Sets", amount: Mix1BucketSets },
      { title: "Old Dough", amount: Mix1OldDough },
      { title: "50 lb. Bread Flour", amount: Mix150lbFlour },
      { title: "25 lb. Bucket Water", amount: Mix125lbWater },
      { title: "Bread Flour", amount: Mix1BreadFlour },
      { title: "Whole Wheat Flour", amount: Mix1WholeWheat },
      { title: "Water", amount: Mix1Water },
      { title: "Salt", amount: Mix1Salt },
      { title: "Yeast", amount: Mix1Yeast },
    ];
  };