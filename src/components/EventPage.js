import { useParams } from 'react-router-dom';
import EventJSON from "../EventContract.json";
import { useState } from "react";
import './EventPage.css';

const EventPage = () => {
  
  const [quantity, updateQuantity] = useState();
  const [address, updateAddress] = useState();
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [buyMessage, updateBuyMessage] = useState("");
  const [transferMessage, updateTransferMessage] = useState("");

  async function getEventData(tokenId) {
    const ethers = require("ethers");

    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(EventJSON.address, EventJSON.abi, signer)

    const listedEvent = await contract.events(tokenId);

    const myTickets = await contract.getMyTickets(tokenId);

    let price = ethers.utils.formatUnits(listedEvent.price.toString(), 'ether');

    var myDate = new Date(listedEvent.date*1000);
    myDate = myDate.toLocaleDateString();

    let item = {
      tokenId: listedEvent.tokenId.toNumber(),
      organizer: listedEvent.organizer,
      name: listedEvent.name,
      date: myDate,
      price,
      ticketCount: listedEvent.ticketCount.toNumber(),
      ticketRemain: listedEvent.ticketRemain.toNumber(),
      myTickets: myTickets.toNumber(),
    }
    updateData(item);
    updateDataFetched(true);
  }

  async function buyTicket(tokenId) {
      try {
          if(quantity>0){
            const ethers = require("ethers");
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
  
            //Pull the deployed contract instance
            let contract = new ethers.Contract(EventJSON.address, EventJSON.abi, signer);
            const salePrice = ethers.utils.parseUnits(data.price, 'ether')

            updateBuyMessage("Buying the ticket... Please wait")
            //run the executeSale function
            let transaction = await contract.buyTicket(tokenId, quantity, {value:quantity*salePrice});
            await transaction.wait();
  
            alert('You successfully bought the ticket!');
            updateBuyMessage("");
            window.location.replace("/YourTicket");
          }
      }
      catch(e) {
          alert("Upload Error"+e)
      }
  }

  async function transferTicket(tokenId) {
    try {
        if(quantity>0 && address!=null){
          const ethers = require("ethers");
          //After adding your Hardhat network to your metamask, this code will get providers and signers
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          //Pull the deployed contract instance
          let contract = new ethers.Contract(EventJSON.address, EventJSON.abi, signer);

          updateTransferMessage("Transfering the ticket... Please wait")
          //run the executeSale function
          let transaction = await contract.transferTicket(tokenId, quantity, address);
          await transaction.wait();

          alert('You successfully transfer your ticket!');
          updateTransferMessage("");
          window.location.replace("/YourTicket")
        }
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

  const params = useParams();
  const tokenId = params.tokenId;
  if(!dataFetched)
    getEventData(tokenId);

  return (
    <div className="eventpage_container_display">
      <div className="eventpage_display">
          <div className="eventpage_container_info">
                <div className='eventpage_description_container_part1'>
                  <p>Name:</p>{data.name}<br></br><br></br>
                  <p>Date: </p> {data.date}<br></br><br></br>
                  <p>My Tickets: </p>{data.myTickets}<br></br><br></br>
                  <p>Price:</p> {data.price + "MATIC"}
                </div>
                <div className='eventpage_description_container_part2'>
                  <p>TokenId: </p> {data.tokenId}<br></br><br></br>
                  <p>Organizer:</p>
                  <div className='eventpage_organizer'>{data.organizer}</div><br></br>
                  <p>TicketCount: </p>{data.ticketCount}<br></br><br></br>
                  <p>TicketRemain: </p>{data.ticketRemain}
                </div>
          </div>
          <div className="eventpage_container_buy">
              { data.ticketRemain > 0 ? 
                  <div className='eventpage_form_container'>
                    <p>Buy a ticket here:</p>
                    <div className="eventpage_input_container">
                        <label className="eventpage_input_label" htmlFor="quantity">Quantity</label>
                        <input className="eventpage_input_input" id="quantity" type="number" placeholder="Number of tickets" value={updateQuantity.quantity} onChange={e => updateQuantity(e.target.value)}></input>
                    </div>
                    <button className='eventpage_button' onClick={() => buyTicket(tokenId)}>Buy ticket</button>
              
                    <div className="eventpage_message">{buyMessage}</div>
                  </div>
                  : null
              }
              { data.myTickets > 0 ? 
                  <div className='eventpage_form_container'>
                    <p>Transfer your ticket here:</p>
                    <div className="eventpage_input_container">
                        <label className="eventpage_input_label" htmlFor="quantity">Quantity</label>
                        <input className="eventpage_input_input" id="quantity" type="number" placeholder="Number of tickets" value={updateQuantity.quantity} onChange={e => updateQuantity(e.target.value)}></input>
                    </div>
                    <div className="eventpage_input_container">
                        <label className="eventpage_input_label" htmlFor="address">Address</label>
                        <input className="eventpage_input_input" id="address" type="text" placeholder="Address" value={updateAddress.address} onChange={e => updateAddress(e.target.value)}></input>
                    </div>
                    <button className='eventpage_button' onClick={() => transferTicket(tokenId)}>Transfer ticket</button>
        
                    <div className="eventpage_message">{transferMessage}</div>
                  </div>
                  : null
              }
          </div>
      </div>
  </div>
  )
}

export default EventPage
