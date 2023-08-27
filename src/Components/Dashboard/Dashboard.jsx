import { Col, Container, Row } from "react-bootstrap";
import DashboardMap from "./DashboardMap";
import { useEffect, useState } from "react";
import axios from "../../axiosClient";
import DashboardOnlineList from "./DashboardOnlineList";
import DashboardLogs from "./DashboardLogs";

const Dashboard = () => {
	const [online, setOnline] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [logs, setLogs] = useState([]);

	useEffect(() => {
		axios
			.get("/getDashboardMap")
			.then((res) => {
				setOnline(res.data);
			})
			.catch((e) => console.log(e));
		axios
			.get("/getDashboardLogs")
			.then((res) => {
				setLogs(res.data);
			})
			.catch((e) => console.log(e));
	}, [refresh]);

	const r = () => {
		setRefresh(!refresh);
	};

	setTimeout(r, 10000);

	return (
		<Container className="shadow">
			<Row>
				<Col className="text-center">
					<h2>Dashboard</h2>
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={6} className="text-center">
					<h3>Online users</h3>
					<Row
						className="mt-3"
						style={{ position: "relative", height: "350px" }}
					>
						<Col className="h-100">
							<DashboardMap markers={online} />
						</Col>
					</Row>
					<Row>
						<Col>
							<DashboardOnlineList accounts={online} />
						</Col>
					</Row>
				</Col>
				<Col xs={12} sm={6}>
					<Row>
						<Col>
							<DashboardLogs logs={logs} />
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default Dashboard;
