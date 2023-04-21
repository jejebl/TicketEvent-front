import EventJSON from "../EventContract.json";
import EventFile from './EventFile.js';
import { useState } from "react";
import './YourTicket.css';

const YourTicket = () => {
  
  const [data, updateData] = useState([]);
  const [address, updateAddress] = useState("0x");
  const [dataFetched, updateFetched] = useState(false);

  async function getMyTickets() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await signer.getAddress();
    const addr = await signer.getAddress();
    updateAddress(addr);
    //Pull the deployed contract instance
    let contract = new ethers.Contract(EventJSON.address, EventJSON.abi, signer)
    let transaction = await contract.getAllEvents()

    const items = await Promise.all(transaction.map(async i => {
        const myTickets = await contract.getMyTickets(i.tokenId);
        let item;
        if(myTickets>0){
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          var myDate = new Date(i.date*1000);
          myDate = myDate.toLocaleDateString();
          item = {
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
        }
    }))

    updateFetched(true);
    updateData(items);

}

if(!dataFetched)
getMyTickets();

  return (
    <div className="profile_container">
      <div className="profile_wallet_container">
        <h2>Wallet Address</h2>  
        <p>{address}</p>
      </div>
      <div className="profile_event_container">
        <h2>Your Tickets</h2>
        <div className="profile_mapevent">
        {data.map((value, index) => {
                    if(value!==undefined){
                      return <EventFile data={value} key={index}></EventFile>;
                    } else {
                      return null;
                    }
                })}
        </div>
        <div className="profile_nodata">
            {data === undefined ? "You don't have ticket":""}
        </div>
      </div>
  </div>
  )
}

export default YourTicket
