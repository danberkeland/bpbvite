
export const ConvertDateToBPBDate = (date) => {
    let delivDate = date.toISOString();
      delivDate = delivDate.split("T")[0];
      let splitDate = delivDate.split("-");
      let day = splitDate[1];
      let mo = splitDate[2];
      let year = splitDate[0];
      let finalDate = day + "/" + mo + "/" + year;
      console.log(finalDate);
      return finalDate
  }