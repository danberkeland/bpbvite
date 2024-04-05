export const getMixInfo = (doughs, infoWrap) => {
  
    let dough = doughs[0];
    let multiple = [];
    
    let baguetteBins = Math.ceil(infoWrap.bagAndEpiCount / 24);
    let oliveWeight = (infoWrap.oliveCount * 1.4).toFixed(2);
    let bcWeight = (infoWrap.bcCount * 1.4).toFixed(2);
    let fullPockets = Math.floor(infoWrap.bagAndEpiCount / 16);
    let extraPockets = infoWrap.bagAndEpiCount % 16;
    let bucketSets = infoWrap.bagDoughTwoDays;
    

    let info = {
        baguetteBins : baguetteBins,
        oliveWeight: oliveWeight,
        bcWeight: bcWeight,
        fullPockets: fullPockets,
        extraPockets : extraPockets,
        bucketSets: bucketSets
    }
    
  
    let doughTotal =
      Number(dough.needed) + Number(dough.buffer) + Number(dough.short);
  
    let mixes = Math.ceil(doughTotal / 210);
    multiple[0] = 1 / mixes;
    multiple[1] = 1 / mixes;
    multiple[2] = 1 / mixes;
  
    if (mixes === 2 && dough.bucketSets === 3) {
      multiple[0] *= 1.33;
      multiple[1] *= 0.66;
    }
  
    if (mixes === 3 && dough.bucketSets === 4) {
      multiple[0] *= 1.5;
      multiple[1] *= 0.75;
      multiple[2] *= 0.75;
    }
  
    if (mixes === 3 && dough.bucketSets === 5) {
      multiple[0] *= 1.2;
      multiple[1] *= 1.2;
      multiple[2] *= 0.6;
    }
    let oldDoughAdjusted = dough.oldDough;
    let stickerAmount = Number(
      Number(dough.needed) + Number(dough.buffer) + Number(dough.short)
    );
  
    if (oldDoughAdjusted > stickerAmount / 3) {
      oldDoughAdjusted = stickerAmount / 3;
    }
    stickerAmount -= oldDoughAdjusted;
  
    return [dough, multiple, stickerAmount, bucketSets, mixes, info];
  };