import { ethers } from "ethers";
import {
  Link
} from "react-router-dom";
import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {

  const [defaultAccount, setDefaultAccount] = useState(false);
  let provider;

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

  //Function to connect the user with MetaMask
  async function connectwalletHandler() {
    if (typeof window.ethereum == 'undefined') {
        alert("Please install Metamask !")
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    console.log(provider)

    if (provider!=null) {
      setDefaultAccount(true);
    } else {
      setDefaultAccount(false);
    }
    window.location.replace("/TicketEvent-front")
  }


  return (
    <div className='navbar'>
      <ul className='nav_ul_container'>
            
            <ul className='nav_ul_menu_container'>
                
            {defaultAccount && (
                <li className='nav_li_here'>
                  <Link to="/TicketEvent-front">Events</Link>
                </li>
            )}
            {defaultAccount && (
                <li className='nav_li_here'>
                  <Link to="/createevent">Create Event</Link>
                </li> 
            )} 
            {defaultAccount && (         
                <li className='nav_li_here'>
                  <Link to="/YourEvent">Your Events</Link>
                </li> 
            )} 
            {defaultAccount && (         
                <li className='nav_li_here'>
                  <Link to="/YourTicket">Your Tickets</Link>
                </li> 
            )} 
            {!defaultAccount && (
                <li className='nav_li_here'>
                    <button className="nav_button_connect" onClick={connectwalletHandler}>Connect your wallet</button>
                </li>
            )}
            </ul>

          </ul>
    </div>
  )
}

export default Navbar
