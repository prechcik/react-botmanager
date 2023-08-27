import { useEffect, useState } from "react";
import axios from "../../axiosClient";
import { Badge } from "react-bootstrap";

const ServerPing = () => {
	const [ping, setPing] = useState(-1);
	const [refresh, setRefresh] = useState(true);

	useEffect(() => {
		let sendTime = new Date();
		axios
			.get("/ping")
			.then((res) => {
				let resTime = new Date();
				let diff = resTime - sendTime;
				setPing(diff);
			})
			.catch((err) => {
				setPing(-1);
			});
		setTimeout(() => {
			setRefresh(!refresh);
		}, 5000);
	}, [refresh]);

	return (
		<span className="h-100 align-middle">
			Server ping:{" "}
			{ping > 0 ? (
				<Badge bg={ping < 1000 ? "success" : "warning"}>{ping} ms</Badge>
			) : (
				<Badge bg="danger">Offline</Badge>
			)}
		</span>
	);
};

export default ServerPing;
