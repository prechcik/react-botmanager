import { useContext, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import axios from "../../axiosClient";
import moment from "moment";
import { AppContext } from "../../appcontext";
import BHToast from "../BHToast";

const EditProxy = (props) => {
	const [formUsername, setFormUsername] = useState("");
	const [formPassword, setFormPassword] = useState("");
	const [formIP, setFormIP] = useState("127.0.0.1");
	const [formPort, setFormPort] = useState(0);
	const [formExpires, setFormExpires] = useState(
		new Date().getFullYear() +
			"-" +
			(new Date().getMonth() < 10
				? "0" + new Date().getMonth()
				: new Date().getMonth()) +
			"-" +
			(new Date().getDate() < 10
				? "0" + new Date().getDate()
				: new Date().getDate())
	);
	const [err, setErr] = useState();
	const { setToasts } = useContext(AppContext);

	const onSubmit = (e) => {
		e.preventDefault();
		axios
			.post("/editProxy", {
				formID: props.nodeID,
				formUsername: formUsername,
				formIP: formIP,
				formPort: formPort,
				formPassword: formPassword,
				formExpires: formExpires,
			})
			.then((res) => {
				if (res.data.affectedRows) {
					props.setRefresh(!props.refresh);
					props.setShow(false);
					setToasts([
						<BHToast key={Math.random()} bg="success">
							Successfully edited proxy!
						</BHToast>,
					]);
				} else {
					console.log(res);
					setErr("Proxy with the same IP and Port already exists!");
				}
			})
			.catch((err) => {
				setErr(err);
			});
	};

	const loadData = () => {
		setErr();
		axios
			.get("/getProxyInfo/" + props.nodeID)
			.then((res) => {
				setFormUsername(res.data[0].login);
				setFormIP(res.data[0].ip);
				setFormPort(res.data[0].port);
				setFormPassword(res.data[0].password);
				let tempstr = moment(res.data[0].expires).format("YYYY-MM-DD");
				console.log(tempstr);
				setFormExpires(tempstr);
			})
			.catch((err) => {});
	};

	const handleHide = () => {
		props.setShow(false);
	};

	return (
		<Modal show={props.show} onHide={handleHide} onShow={loadData}>
			<Modal.Header>
				<Modal.Title>Add new Proxy</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{err ? <Alert variant="danger">{err}</Alert> : ""}
				<Form onSubmit={onSubmit}>
					<Form.Group className="mb-3" controlId="nodeIP">
						<Form.Label>IP</Form.Label>
						<Form.Control
							required
							type="text"
							value={formIP}
							onChange={(e) => setFormIP(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodePort">
						<Form.Label>Port</Form.Label>
						<Form.Control
							required
							type="number"
							value={formPort}
							onChange={(e) => setFormPort(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodeUsername">
						<Form.Label>Username</Form.Label>
						<Form.Control
							required
							type="text"
							value={formUsername}
							onChange={(e) => setFormUsername(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodePassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							required
							type="text"
							value={formPassword}
							onChange={(e) => setFormPassword(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodeExpires">
						<Form.Label>Expires</Form.Label>
						<Form.Control
							required
							type="date"
							value={formExpires}
							onChange={(e) => setFormExpires(e.target.value)}
						/>
					</Form.Group>
					<Button variant="primary" type="submit" className="w-100">
						Submit
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default EditProxy;
