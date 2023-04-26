import React from 'react'
import { Link } from "react-router-dom";
import './EventFile.css';

const EventFile = (data) => {
  const newTo = {
    pathname:"/eventPage/"+data.data.tokenId
  }
  return (
      <Link to={newTo}>
          <div className="eventfile_container">
            <div className='eventfile_container_part12'>
              <div className='eventfile_part1'>
                <p>Name:</p>{data.data.name}
                <p>Price:</p> {data.data.price + " MATIC"}
                <p>TicketCount: </p>{data.data.ticketCount}
              </div>
              <div className='eventfile_part2'>
                <p>Date: </p> {data.data.date}
                <p>My Tickets: </p>{data.data.myTickets}
                <p>TicketRemain: </p>{data.data.ticketRemain}
              </div>
            </div>
            <p>Organizer:</p>
            <div className='eventfile_organizer'>{data.data.organizer}</div>
          </div>
      </Link>
  )
}

export default EventFile
