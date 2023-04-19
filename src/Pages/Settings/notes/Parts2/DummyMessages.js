import { getWorkingDateTime } from "../../../../functions/dateAndTime";

export const DummyMessages = [
  {
    message: "Lorem ipsum dolor sit amet",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 1 }).toISO()),
  },
  {
    message: "Consectetur adipiscing elit",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 2 }).toISO()),
  },
  {
    message: "Sed do eiusmod tempor incididunt",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 3 }).toISO()),
  },
  {
    message: "Ut labore et dolore magna aliqua",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 4 }).toISO()),
  },
  {
    message: "Ut enim ad minim veniam",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 5 }).toISO()),
  },
  {
    message: "Quis nostrud exercitation ullamco laboris nisi",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 6 }).toISO()),
  },
  {
    message: "Aliquip ex ea commodo consequat",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 7 }).toISO()),
  },
  {
    message: "Duis aute irure dolor in reprehenderit",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 8 }).toISO()),
  },
  {
    message: "Voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 9 }).toISO()),
  },
  {
    message: "Excepteur sint occaecat cupidatat non proident",
    date: new Date(getWorkingDateTime("NOW").plus({ days: 10 }).toISO()),
  },
];
