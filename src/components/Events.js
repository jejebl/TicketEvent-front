import EventJSON from "../EventContract.json";
import EventFile from './EventFile.js';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import './Events.css';

const Events = () => {

  const [data, updateData] = useState();
  const [dataFetched, updateFetched] = useState(false);

  const [defaultAccount, setDefaultAccount] = useState(false);

  //Check on refresh if the user is connected to MetaMask
  useEffect(() => {
    async function look(){
      let provider = new ethers.providers.Web3Provider(window.ethereum);

      const addresses = await provider.listAccounts(); 
      // it doesn't create metamask popup
      if (addresses.length) {
        // permission already granted so request account address from metamask
        setDefaultAccount(true);
      } else {
        setDefaultAccount(false);
      }
    }
    look();
  })

  async function getAllEvents() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(EventJSON.address, EventJSON.abi, signer)
    let transaction = await contract.getAllEvents()

    const items = await Promise.all(transaction.map(async i => {
        const myTickets = await contract.getMyTickets(i.tokenId);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        var myDate = new Date(i.date*1000);
        myDate = myDate.toLocaleDateString();
        let item = {
            tokenId: i.tokenId.toNumber(),
            organizer: i.organizer,
            name: i.name,
            date: myDate,
            price,
            ticketCount: i.ticketCount.toNumber(),
            ticketRemain: i.ticketRemain.toNumber(),
            myTickets: myTickets.toNumber(),
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
getAllEvents();

  return (
    <div className="event_container">
        <div className="event_display">
        {!defaultAccount && (
            <p className="event_title">Welcome to Ticket Event</p>
        )}
        {defaultAccount && (
            <p className="event_title">All the Events</p>
        )}
            <div className="event_listevent ">
                {data && data.map((value, index) => {
                    return <EventFile data={value} key={index}></EventFile>;
                })}
            </div>
        </div>
    </div>   
  )
}

export default Events
