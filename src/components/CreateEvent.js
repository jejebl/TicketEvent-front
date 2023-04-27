import React from 'react'
import './CreateEvent.css';
import { useState } from "react";
import EventJSON from "../EventContract.json";

const CreateEvent = () => {
    const [formParams, updateFormParams] = useState({ name: '', date: '', price: '', ticketCount: ''});
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');

    async function createEvent(e) {
        e.preventDefault();
        
        let button = document.querySelector('.create_button_createEvent');
        button.disabled = true;

        try {
            const {name, date, price, ticketCount} = formParams;
        
            //Make sure that none of the fields are empty
            if( !name || !date || !price || !ticketCount) {
                window.location.replace("/TicketEvent-front/#/createevent")
                return;
            }
            updateMessage("Creating your event, wait...")

            console.log(date)
            var newDate = Math.floor(new Date(date).getTime()/1000);
            console.log(newDate);

            const priceTicket = ethers.utils.parseUnits(price, 'ether')

            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(EventJSON.address, EventJSON.abi, signer)

            let transaction = await contract.createEvent(name,newDate,priceTicket,ticketCount)
            await transaction.wait()

            alert("Successfully create your Event!");
            updateMessage("");
            updateFormParams({ name: '', date: '', price: '', ticketCount: ''});
            window.location.replace("/TicketEvent-front/#/createevent")
        }
        catch(e) {
            alert( "Upload error"+e )
            window.location.replace("/TicketEvent-front/#/createevent")
        }
    }


  return (
    <div className="create_container">
      <form className="create_form_container">
      <h3 className="create_h3_title">Create your Event here</h3>
          <div className="create_input_container">
              <label className="create_input_label" htmlFor="name">Event Name</label>
              <input className="create_input_input" id="name" type="text" placeholder="Event name" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
          </div>
          <div className="create_input_container">
              <label className="create_input_label" htmlFor="date">Event Date</label>
              <input className="create_input_input" id="date" type="date" placeholder="Date" value={formParams.date} onChange={e => updateFormParams({...formParams, date: e.target.value})}></input>
          </div>
          <div className="create_input_container">
              <label className="create_input_label" htmlFor="price">Event Price</label>
              <input className="create_input_input" id="price" type="number" placeholder="Price in MATIC" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
          </div>
          <div className="create_input_container">
              <label className="create_input_label" htmlFor="ticketCount">Event ticket count</label>
              <input className="create_input_input" id="ticketCount" type="number" placeholder="ticket count" value={formParams.ticketCount} onChange={e => updateFormParams({...formParams, ticketCount: e.target.value})}></input>
          </div>
          <br></br>
          <button onClick={createEvent} className="create_button_createEvent">
              Create Event
          </button>
          <div className="create_message">{message}</div>
      </form>
  </div>
  )
}

export default CreateEvent
