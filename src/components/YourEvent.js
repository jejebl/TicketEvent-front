import EventJSON from "../EventContract.json";
import EventFile from './EventFile.js';
import { useState } from "react";
import './YourEvent.css';

const YourEvent = () => {
  
  const [data, updateData] = useState([]);
  const [address, updateAddress] = useState("0x");
  const [dataFetched, updateFetched] = useState(false);

  async function getMyEvents() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await signer.getAddress();
    const addr = await signer.getAddress();
    updateAddress(addr);
    //Pull the deployed contract instance
    let contract = new ethers.Contract(EventJSON.address, EventJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getMyEvents()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
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
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);

}

if(!dataFetched)
getMyEvents();

  return (
    <div className="profile_container">
      <div className="profile_wallet_container">
        <h2>Wallet Address</h2>  
        <p>{address}</p>
      </div>
      <div className="profile_event_container">
        <h2>Your Events</h2>
        <div className="profile_mapevent">
        {data && data.map((value, index) => {
                    return <EventFile data={value} key={index}></EventFile>;
                })}
        </div>
        <div className="profile_nodata">
            {data.length === 0 ? "You don't have event":""}
        </div>
      </div>
  </div>
  )
}

export default YourEvent
