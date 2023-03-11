import { getMixInfo } from './GetMixInfo'

export const panAmount = (doughs, infoWrap) => {
   
    let fullPockets = getMixInfo(doughs, infoWrap)[5].fullPockets;
    let extraPockets = getMixInfo(doughs, infoWrap)[5].extraPockets;
   
  
    return [
      { title: "Full (16 per pan)", amount: fullPockets },
      { title: "Extra", amount: extraPockets },
    ];
  };