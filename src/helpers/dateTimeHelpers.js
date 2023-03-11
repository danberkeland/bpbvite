const { DateTime } = require("luxon");

export const convertDatetoBPBDate = (ISODate) => {
  let splitDate = ISODate.split("-");
  let day = splitDate[1];
  let mo = splitDate[2];
  let year = splitDate[0];
  return day + "/" + mo + "/" + year;
};

export const convertDatetoBPBDateMinusYear = (ISODate) => {
  let splitDate = ISODate.split("-");
  let day = splitDate[1];
  let mo = splitDate[2];
  return day + "/" + mo;
};

export const tomBasedOnDelivDate = (delivDate) => {
  let tomorrow = DateTime.fromFormat(delivDate, "yyyy-MM-dd")
    .setZone("America/Los_Angeles")
    .plus({ days: 1 });

  return tomorrow.toString().split("T")[0];
};

export const TwodayBasedOnDelivDate = (delivDate) => {
  let tomorrow = DateTime.fromFormat(delivDate, "yyyy-MM-dd")
    .setZone("America/Los_Angeles")
    .plus({ days: 2 });

  return tomorrow.toString().split("T")[0];
};

export const ThreedayBasedOnDelivDate = (delivDate) => {
  let tomorrow = DateTime.fromFormat(delivDate, "yyyy-MM-dd")
    .setZone("America/Los_Angeles")
    .plus({ days: 3 });

  return tomorrow.toString().split("T")[0];
};

export const todayPlus = () => {
  let today = DateTime.now().setZone("America/Los_Angeles");
  let todaySend = today.toString().split("T")[0];

  let tomorrow = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: 1 });
  let tomorrowSend = tomorrow.toString().split("T")[0];

  let twoDay = DateTime.now().setZone("America/Los_Angeles").plus({ days: 2 });
  let twoDaySend = twoDay.toString().split("T")[0];

  let threeDay = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: 3 });
  let threeDaySend = threeDay.toString().split("T")[0];

  let yesterday = DateTime.now()
    .setZone("America/Los_Angeles")
    .minus({ days: 1 });
  let yesterdaySend = yesterday.toString().split("T")[0];

  let weekAgo = DateTime.now()
    .setZone("America/Los_Angeles")
    .minus({ days: 8 });
  let weekAgoSend = weekAgo.toString().split("T")[0];

  let minus2 = DateTime.now().setZone("America/Los_Angeles").minus({ days: 2 });
  let minus2Send = minus2.toString().split("T")[0];

  let minus3 = DateTime.now().setZone("America/Los_Angeles").minus({ days: 3 });
  let minus3Send = minus3.toString().split("T")[0];

  let minus4 = DateTime.now().setZone("America/Los_Angeles").minus({ days: 4 });
  let minus4Send = minus4.toString().split("T")[0];

  let minus5 = DateTime.now().setZone("America/Los_Angeles").minus({ days: 5 });
  let minus5Send = minus5.toString().split("T")[0];

  let minus6 = DateTime.now().setZone("America/Los_Angeles").minus({ days: 6 });
  let minus6Send = minus6.toString().split("T")[0];

  let net15 = DateTime.now().setZone("America/Los_Angeles").plus({ days: 15 });
  let net15Send = net15.toString().split("T")[0];

  let fourDay = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: 4 });
  let fourDaySend = fourDay.toString().split("T")[0];

  return [
    todaySend,
    tomorrowSend,
    twoDaySend,
    threeDaySend,
    yesterdaySend,
    weekAgoSend,
    minus2Send,
    minus3Send,
    minus4Send,
    minus5Send,
    minus6Send,
    net15Send,
    fourDaySend
  ];
};

export const daysOfTheWeek = () => {
  let timeDelta = 0;
  let dayOfWeek = DateTime.now().setZone("America/Los_Angeles").weekday;
  for (let i = 0; i < 7; i++) {
    if (dayOfWeek === i) {
      timeDelta = 7 - i;
    }
  }
  let Sun = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: timeDelta });
  let SunSend = Sun.toString().split("T")[0];

  let Mon = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 1) % 7 });
  let MonSend = Mon.toString().split("T")[0];

  let Tues = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 2) % 7 });
  let TuesSend = Tues.toString().split("T")[0];

  let Wed = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 3) % 7 });
  let WedSend = Wed.toString().split("T")[0];

  let Thurs = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 4) % 7 });
  let ThursSend = Thurs.toString().split("T")[0];

  let Fri = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 5) % 7 });
  let FriSend = Fri.toString().split("T")[0];

  let Sat = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: (timeDelta + 6) % 7 });
  let SatSend = Sat.toString().split("T")[0];

  let Sun15Due = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: timeDelta+15 });
  let Sun15dueSend = Sun15Due.toString().split("T")[0];



  return [SunSend, MonSend, TuesSend, WedSend, ThursSend, FriSend, SatSend,Sun15dueSend];
};

export const daysOfBillingWeek = () => {
  let timeDelta = 0;
  let dayOfWeek = DateTime.now().setZone("America/Los_Angeles").weekday;

  for (let i = 0; i < 7; i++) {
    if (dayOfWeek === i) {
      timeDelta = 7 - i;
    }
  }
  let offset = 7;
  if (dayOfWeek <= 0) {
    offset = 0;
  }
  let Sun = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: 7 + timeDelta - offset });
  let SunSend = Sun.toString().split("T")[0];

  if (dayOfWeek <= 1) {
    offset = 0;
  }
  let Mon = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 1) % 7) - offset });
  let MonSend = Mon.toString().split("T")[0];

  if (dayOfWeek <= 2) {
    offset = 0;
  }
  let Tues = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 2) % 7) - offset });
  let TuesSend = Tues.toString().split("T")[0];

  if (dayOfWeek <= 3) {
    offset = 0;
  }
  let Wed = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 3) % 7) - offset });
  let WedSend = Wed.toString().split("T")[0];

  if (dayOfWeek <= 4) {
    offset = 0;
  }
  let Thurs = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 4) % 7) - offset });
  let ThursSend = Thurs.toString().split("T")[0];

  if (dayOfWeek <= 5) {
    offset = 0;
  }
  let Fri = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 5) % 7) - offset });
  let FriSend = Fri.toString().split("T")[0];

  if (dayOfWeek <= 6) {
    offset = 0;
  }
  let Sat = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: ((timeDelta + 6) % 7) - offset });
  let SatSend = Sat.toString().split("T")[0];

  return [SunSend, MonSend, TuesSend, WedSend, ThursSend, FriSend, SatSend];
};

export const tomorrow = () => {
  let tomorrow = DateTime.now()
    .setZone("America/Los_Angeles")
    .plus({ days: 1 });
  tomorrow = tomorrow.toString().split("T")[0];
  return tomorrow;
};

export const checkDeadlineStatus = (deliv) => {
  let today = DateTime.now().setZone("America/Los_Angeles");
  let hour = today.c.hour;
  let minutes = today.c.minute / 60;
  let totalHour = hour + minutes;

  if (
    ((totalHour > 18.5 &&
      deliv.toString() === todayPlus()[1].toString()) ||
      deliv.toString() === todayPlus()[0].toString())
  ) {
    console.log("Today's deadline has passed")
    return true
  } else {
    console.log("Today's deadline has NOT YET passed")
    return false
  }
}
