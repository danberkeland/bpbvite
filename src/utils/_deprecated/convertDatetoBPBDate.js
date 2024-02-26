export const convertDatetoBPBDate = (ISODate) => {
  const [yyyy, MM, dd] = ISODate.split("-")
  return MM + "/" + dd + "/" + yyyy;
  
};