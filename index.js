const { default: axios } = require('axios')
const express = require('express')
const moment = require('moment')
const app = express()
const PORT = process.env.PORT || 3000


const HEADERS ={

    "Authorization":"Bearer f0f13f30-3c7c-4ada-b280-4582344bfec0",
    "Content-Type":"application/json"
}



// console.log(datestring);
// console.log("DATE",moment('2021-09-04T16:00:00.000Z').format());

app.get('/',async (req,res)=>{
    const {phone, apptDate,id} = req.query 
    console.log(req.query);
    if(!id && !apptDate){
        return res.sendStatus(400)
    }
    // get contact
    const contact = await getContact(id)
    console.log("CONTACT",contact);

    try {
        const payload = {
            "calendarId": "ys6QHQsWSyd1NWs8zvJ6",
            "selectedTimezone": "America/Bahia_Banderas",
            "selectedSlot": getDate(apptDate),
            "phone": phone
        }
        const a = await axios.post(`https://rest.gohighlevel.com/v1/appointments/`,payload,{
            headers:HEADERS
        })
        return res.json({"data":a.data})
    } catch (error) {
        console.log("ERROR!:", error.response.data);
        return res.sendStatus(500)
    }
  
})

async function getContact(contactId){
    try {
        const response = await axios.get(`https://rest.gohighlevel.com/v1/contacts/${contactId}`,{
            headers:HEADERS
        })
        return response.data
    } catch (error) {
        console.log("ERROR: ", error.response.data);
        return error.response.data
    }
}

function getDate(date){
    var d = new Date (date);

var getMo = d.getMonth()+1;
if(getMo <10){
getMo = "0"+ getMo ;
}
var getD = d.getDate();
if(getD <10){
 getD= "0"+ getD ;
}
var getH = d.getHours();
if(getH <10){
getH = "0"+ getH ;
}
var getM = d.getMinutes();
if(getM <10){
getM ="0"+ getM ;
}
var getS = d.getSeconds();
if(getS <10){
getS ="0"+ getS ;
}
var datestring = d.getFullYear()  + "-" + (getMo) + "-" + getD + "T" +
getH + ":" + getM + ":" + getS +"-05:00";
return datestring
}
app.listen(PORT,()=>{
    console.log("Server Running on port: "+PORT);
})