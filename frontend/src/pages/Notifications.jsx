import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

function Notifications() {
const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);

const navigate = useNavigate();

useEffect(() => {
loadNotifications();

const userId = localStorage.getItem("userId");

if (userId) {
socket.emit("join", userId);
}

// NEW REQUEST
socket.on("new-session-request", (data) => {
setNotifications((prev) => [data, ...prev]);
setUnreadCount((prev) => prev + 1);
});

// ACCEPTED
socket.on("request-accepted", (data) => {
setNotifications((prev) => [data, ...prev]);
});

// REJECTED
socket.on("request-rejected", (data) => {
setNotifications((prev) => [data, ...prev]);
});

return () => {
socket.off("new-session-request");
socket.off("request-accepted");
socket.off("request-rejected");
};
}, []);

const loadNotifications = async () => {
try {
const token = localStorage.getItem("token");

const res = await axios.get(
"http://localhost:5000/api/notifications",
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

setNotifications(res.data);

setUnreadCount(
res.data.filter((n) => !n.read).length
);
} catch (err) {
console.log(err);
}
};

const acceptRequest = async (id) => {
try {
const token = localStorage.getItem("token");

const res = await axios.put(
`http://localhost:5000/api/requests/${id}/accept`,
{},
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

navigate(`/chat/${res.data.chatId}`);
} catch (err) {
console.log(err);
}
};

const rejectRequest = async (id) => {
try {
const token = localStorage.getItem("token");

await axios.put(
`http://localhost:5000/api/requests/${id}/reject`,
{},
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

loadNotifications();
} catch (err) {
console.log(err);
}
};

return (
<div className="p-6">
<div className="flex items-center gap-3 mb-5">
<h1 className="text-2xl font-bold">
Notifications
</h1>

<div className="relative">
🔔

{unreadCount > 0 && (
<span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
{unreadCount}
</span>
)}
</div>
</div>

<div className="space-y-4">
{notifications.map((n) => (
<div
key={n._id}
className="bg-white shadow rounded p-4"
>
<p>
<strong>{n.senderName}</strong>{" "}
{n.type === "request"
? "sent you a mentorship request"
: n.message}
</p>

{n.status === "pending" && (
<div className="flex gap-2 mt-3">
<button
onClick={() => acceptRequest(n._id)}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Accept
</button>

<button
onClick={() => rejectRequest(n._id)}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Reject
</button>
</div>
)}

{n.status === "accepted" && (
<button
onClick={() => navigate(`/chat/${n.chatId}`)}
className="bg-blue-600 text-white px-3 py-1 rounded mt-3"
>
Open Chat
</button>
)}
</div>
))}
</div>
</div>
);
}

export default Notifications;
