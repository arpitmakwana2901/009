import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/buy-ticket/${id}`
        );
        setTicket(res.data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
      }
    };

    fetchTicket();
  }, [id]);

  if (!ticket) return <p>Loading ticket details...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-900 text-white rounded-xl shadow-md">
      <img src={ticket.image} alt={ticket.title} className="rounded-lg mb-4" />
      <h1 className="text-2xl font-bold">{ticket.title}</h1>
      <p className="text-gray-400">
        {ticket.releaseYear} · {ticket.genres.join(" | ")}
      </p>
      <p className="mt-2">Runtime: {ticket.runtime} min</p>
      <p>Rating: ⭐ {ticket.rating}</p>
      <p className="mt-4 font-semibold">Seats: {ticket.seats}</p>
    </div>
  );
};

export default TicketDetails;
