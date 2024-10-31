import React, { useContext, useEffect } from "react";
import userContext from "../context/userContext";

export const Update = () => {
	const { socket } = useContext(userContext);
	useEffect(() => {
		console.log("Update");
		// broadcast new_update event to all connected clients
		socket.emit("new_update");
		// socket.emit("new_update");
	}, []);

	return <div>Update</div>;
};
