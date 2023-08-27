import { Card, Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AppContext } from "../../appcontext";
import Toasts from "./Toasts";
import { useState } from "react";

const Layout = ({ setToken }) => {
	const [toasts, setToasts] = useState([]);

	return (
		<AppContext.Provider value={{ toasts: toasts, setToasts: setToasts }}>
			<Container className="p-0">
				<Toasts />
				<Sidebar setToken={setToken} />
				<Row className="mt-3">
					<Col>
						<Card className="p-0">
							<Card.Body className="p-0">
								<Outlet />
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Row className="mt-3 text-center">
					<Col>
						<small>Copyright &copy; Dawid Precht 2023</small>
					</Col>
				</Row>
			</Container>
		</AppContext.Provider>
	);
};

export default Layout;
