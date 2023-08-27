import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTachometerAlt,
	faCogs,
	faPlayCircle,
	faNetworkWired,
	faUsers,
	faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Nav, Navbar } from "react-bootstrap";
import ServerPing from "../ServerPing/ServerPing";
import { LinkContainer } from "react-router-bootstrap";

const Sidebar = ({ setToken }) => {
	const logoutHandler = (e) => {
		e.preventDefault();
		setToken();
		sessionStorage.clear();
		window.location.reload();
	};

	return (
		<Navbar
			collapseOnSelect
			expand="lg"
			bg="light"
			variant="light"
			className="ps-3 pe-3"
		>
			<LinkContainer to="/">
				<Navbar.Brand>
					<span className="text-primary ms-3">BH</span>BotManager
				</Navbar.Brand>
			</LinkContainer>
			<Navbar.Collapse id="navbar">
				<Nav>
					<LinkContainer to="/" className="nav-link" eventKey="1">
						<Nav.Link>
							<FontAwesomeIcon
								icon={faTachometerAlt}
								className="pe-2 text-warning"
							/>
							Dashboard
						</Nav.Link>
					</LinkContainer>
					<LinkContainer to="/accounts" className="nav-link" eventKey="2">
						<Nav.Link>
							<FontAwesomeIcon icon={faUsers} className="pe-2 text-secondary" />
							Accounts
						</Nav.Link>
					</LinkContainer>
					<LinkContainer to="/proxies" className="nav-link" eventKey="3">
						<Nav.Link>
							<FontAwesomeIcon
								icon={faNetworkWired}
								className="pe-2 text-primary"
							/>
							Proxies
						</Nav.Link>
					</LinkContainer>
					<LinkContainer to="/launcher" className="nav-link" eventKey="4">
						<Nav.Link>
							<FontAwesomeIcon
								icon={faPlayCircle}
								className="pe-2 text-success"
							/>
							Client Launcher
						</Nav.Link>
					</LinkContainer>
					<LinkContainer to="/settings" className="nav-link" eventKey="5">
						<Nav.Link>
							<FontAwesomeIcon icon={faCogs} className="pe-2 text-dark" />
							Settings
						</Nav.Link>
					</LinkContainer>
					<LinkContainer to="/" className="nav-link" onClick={logoutHandler}>
						<Nav.Link>
							<FontAwesomeIcon
								icon={faSignOutAlt}
								className="pe-2 text-danger"
							/>
							Logout
						</Nav.Link>
					</LinkContainer>
				</Nav>
			</Navbar.Collapse>
			<div className="ms-auto me-auto text-dark text-center">
				<ServerPing />
			</div>
			<Navbar.Toggle aria-controls="navbar" data-bs-target="#navbar" />
		</Navbar>
	);
};

export default Sidebar;
