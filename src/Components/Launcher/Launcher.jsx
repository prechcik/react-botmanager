import { Card, Col, Container, Row } from "react-bootstrap";
import QueueList from "./QueueList";
import NewClient from "./NewClient";
import { useState } from "react";
import { faPlay, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Launcher = () => {
	const [refresh, setRefresh] = useState(false);

	return (
		<Container className="shadow">
			<Row>
				<Col className="text-center">
					<h2>Client Launcher</h2>
				</Col>
			</Row>
			<Row className="p-3">
				<Col md={13} lg={8}>
					<Card className="shadow">
						<Card.Header>
							<Card.Title>
								<FontAwesomeIcon icon={faUsers} className="pe-2 text-primary" />
								Running clients
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<QueueList refresh={refresh} setRefresh={setRefresh} />
						</Card.Body>
					</Card>
				</Col>
				<Col md={12} lg={4}>
					<Card className="shadow">
						<Card.Header>
							<Card.Title>
								<FontAwesomeIcon icon={faPlay} className="pe-2 text-success" />
								Start new client
							</Card.Title>
						</Card.Header>
						<Card.Body>
							<NewClient refresh={refresh} setRefresh={setRefresh} />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Launcher;
