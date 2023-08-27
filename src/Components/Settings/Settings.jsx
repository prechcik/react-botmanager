import { Card, Col, Container, Row } from "react-bootstrap";
import NodeList from "./NodeList/NodeList";

const Settings = () => {
	return (
		<Container style={{ padding: "10px 15px 10px 15px" }} className="shadow">
			<Row>
				<Col className="text-center">
					<h2>Settings</h2>
				</Col>
			</Row>
			<Row>
				<Col className="mt-2">
					<Card className="shadow">
						<Card.Header>
							<Card.Title>Server Nodes</Card.Title>
						</Card.Header>
						<Card.Body>
							<NodeList />
						</Card.Body>
					</Card>
				</Col>
				<Col className="mt-2">
					<Card className="shadow">
						<Card.Header>
							<Card.Title>Various Settings</Card.Title>
						</Card.Header>
						<Card.Body>Settings</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Settings;
