const { default: axios } = require('axios')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000


const HEADERS ={

    "Authorization":"Bearer f0f13f30-3c7c-4ada-b280-4582344bfec0",
    "Content-Type":"application/json"

}

app.get('/',async (req,res)=>{
    const {phone, aptDate,id} = req.query 
    if(!id && !aptDate){
        return res.sendStatus(400)
    }
    // get contact
    const contact = getContact(id)
    console.log("CONTACT",contact);
    try {
        const payload = {
            "calendarId": "ys6QHQsWSyd1NWs8zvJ6_1630615855296",
            "selectedTimezone": "America/Bahia_Banderas",
            "selectedSlot": aptDate,
            "email": "john@deo.com",
            "phone": "+18887324197"
        }
        const a = await axios.post(`https://rest.gohighlevel.com/v1/appointments/`,payload,{
            headers:HEADERS
        })
        return res.json({"data":a.data})
    } catch (error) {
        console.log("ERROR!:", error);
        return res.sendStatus(500)
    }
  
})

async function getContact(contactId){
    try {
        const response = await axios.get(`https://rest.gohighlevel.com/v1/contacts/:${contactId}`,{
            headers:HEADERS
        })
        return response.data
    } catch (error) {
        console.log("ERROR: ", error.message);
        return error
    }
}

app.listen(PORT,()=>{
    console.log("Server Running on port: "+PORT);
})