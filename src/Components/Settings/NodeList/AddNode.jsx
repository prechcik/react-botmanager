import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import axios from "../../../axiosClient";

const AddNode = (props) => {
	const [formName, setFormName] = useState("Node name");
	const [formIP, setFormIP] = useState("127.0.0.1");
	const [formPort, setFormPort] = useState(8800);
	const [formCap, setFormCap] = useState(3);
	const [err, setErr] = useState();

	const onSubmit = (e) => {
		e.preventDefault();
		axios
			.post("/addNode", {
				formName: formName,
				formIP: formIP,
				formPort: formPort,
				formCap: formCap,
			})
			.then((res) => {
				if (res.data.affectedRows) {
					props.setRefresh(!props.refresh);
					props.setShow(false);
				} else {
					setErr("Node with same IP and port already exists!");
				}
			})
			.catch((err) => {
				setErr(err);
			});
	};

	const handleHide = () => {
		props.setShow(false);
	};

	return (
		<Modal show={props.show} onHide={handleHide} onShow={() => setErr()}>
			<Modal.Header>
				<Modal.Title>Add new Node</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{err ? <Alert variant="danger">{err}</Alert> : ""}
				<Form onSubmit={onSubmit}>
					<Form.Group className="mb-3" controlId="nodeNamee">
						<Form.Label>Node Name</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder="Node name"
							onChange={(e) => setFormName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodeIP">
						<Form.Label>IP Address</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder="127.0.0.1"
							onChange={(e) => setFormIP(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodePort">
						<Form.Label>Port</Form.Label>
						<Form.Control
							required
							type="number"
							value={8800}
							onChange={(e) => setFormPort(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodeCap">
						<Form.Label>Capacity</Form.Label>
						<Form.Control
							required
							type="number"
							value={3}
							onChange={(e) => setFormCap(e.target.value)}
						/>
					</Form.Group>
					<Button variant="primary" type="submit">
						Submit
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default AddNode;
