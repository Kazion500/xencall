const { default: axios } = require("axios");
const express = require("express");
const moment = require("moment");
const app = express();
const PORT = process.env.PORT || 3000;

const HEADERS = {
  Authorization: "Bearer f0f13f30-3c7c-4ada-b280-4582344bfec0",
  "Content-Type": "application/json",
};
console.log(
  new Date().toLocaleString("en-US", { timeZone: "America/Bahia_Banderas" }),
  new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Bahia_Banderas" })
  ).getHours(),
  "\n \n",
  getDate("2021-11-06T15:00:00.000Z")
);

app.get("/", async (req, res) => {
  const { phone, apptDate, id } = req.query;
  console.log(req.query);
  if (!phone || !apptDate) {
    return res.sendStatus(400);
  }
  // get contact
  const contact = await getContact(phone);
  console.log("CONTACT", contact);

  try {
    let a;
    const appointmentDate = new Date(
      new Date(getDate(apptDate)).toLocaleString("en-US", {
        timeZone: "America/Bahia_Banderas",
      })
    );
    console.log(appointmentDate);
    if (appointmentDate.getHours() < 8 || appointmentDate.getHours() > 20) {
      console.log("Less > 8Am");
      a = await putData(contact, apptDate);
    } else {
      console.log("Make post");
      a = await postData(apptDate, phone);
    }
    res.json({ a });
  } catch (error) {
    console.log("LINE 47 ERROR!:", error?.response?.data);
    return res.status(400).send(error?.response?.data);
  }
});

async function putData(contact, apptDate) {
  try {
    const payload = {
      customField: {
        HPx3074jyCnmTheXupv6: new Date(apptDate).toDateString(),
      },
    };
    const a = await axios.put(
      `https://rest.gohighlevel.com/v1/contacts/${contact.id}`,
      payload,
      {
        headers: HEADERS,
      }
    );
    return a.data;
  } catch (error) {
    console.log("LINE 68 ERROR!:", error.response.data);
    throw error;
  }
}

async function postData(apptDate, phone) {
  try {
    const payload = {
      calendarId: "ys6QHQsWSyd1NWs8zvJ6",
      selectedTimezone: "America/Bahia_Banderas",
      selectedSlot: getDate(apptDate),
      phone,
    };
    const a = await axios.post(
      `https://rest.gohighlevel.com/v1/appointments/`,
      payload,
      {
        headers: HEADERS,
      }
    );
    return a.data;
  } catch (error) {
    console.log("90 ERROR!:", error?.response.data);
    throw error;
  }
}

async function getContact(phone) {
  try {
    const response = await axios.get(
      `https://rest.gohighlevel.com/v1/contacts?query=${phone}`,
      {
        headers: HEADERS,
      }
    );
    const {contacts} = response.data
    return contacts[0];
  } catch (error) {
    console.log("ERROR: ", error.response.data);
    return error.response.data;
  }
}

function getDate(date) {
  var d = new Date(
    new Date(date).toLocaleString("en-US", {
      timeZone: "America/Bahia_Banderas",
    })
  );

  var getMo = d.getMonth() + 1;
  if (getMo < 10) {
    getMo = "0" + getMo;
  }
  var getD = d.getDate();
  if (getD < 10) {
    getD = "0" + getD;
  }
  var getH = d.getHours() - 5;
  if (getH < 10) {
    getH = "0" + getH;
  }
  var getM = d.getMinutes();
  // var newM = getM % 30;
  // if (newM != 0) {
  //   getM -= newM;
  // }
  if (getM < 10) {
    getM = "0" + getM;
  }
  var getS = d.getSeconds();
  if (getS < 10) {
    getS = "0" + getS;
  }
  var datestring =
    d.getFullYear() +
    "-" +
    getMo +
    "-" +
    getD +
    "T" +
    getH +
    ":" +
    getM +
    ":" +
    getS +
    "-05:00";
  return datestring;
}
app.listen(PORT, () => {
  console.log("Server Running on port: " + PORT);
});
