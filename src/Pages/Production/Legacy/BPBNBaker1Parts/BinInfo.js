import { getMixInfo } from './GetMixInfo'

export const binInfo = (doughs, infoWrap) => {
   
    let baguetteBins = getMixInfo(doughs, infoWrap)[5].baguetteBins;
    let oliveWeight = getMixInfo(doughs, infoWrap)[5].oliveWeight;
    let bcWeight = getMixInfo(doughs, infoWrap)[5].bcWeight;
  
    return [
      { title: "Baguette (27.7)", amount: baguetteBins+" bins" },
      { title: "Olive", amount: oliveWeight+" lb." },
      { title: "-- Green Olives", amount: " -- "+((oliveWeight/1.4)*.08).toFixed(2)+" lb." },
      { title: "-- Black Olives", amount: " -- "+((oliveWeight/1.4)*.08).toFixed(2)+" lb." },

      { title: "BC Walnut", amount: bcWeight+" lb." },
      { title: "-- Bleu Cheese", amount: " -- "+((bcWeight/1.4)*.08).toFixed(2)+" lb." },
      { title: "-- Toasted Walnuts", amount: " -- "+((bcWeight/1.4)*.08).toFixed(2)+" lb." },
    ];
  };