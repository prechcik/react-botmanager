import { useContext, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import axios from "../../../axiosClient";
import { AppContext } from "../../appcontext";
import BHToast from "../BHToast";

const EditAccount = (props) => {
	const [formName, setFormName] = useState("Node name");
	const [formIP, setFormIP] = useState("127.0.0.1");
	const [formPort, setFormPort] = useState(8800);
	const [formCap, setFormCap] = useState(3);
	const [err, setErr] = useState();
	const { setToasts } = useContext(AppContext);

	const onSubmit = (e) => {
		e.preventDefault();
		axios
			.post("/editNode", {
				formID: props.nodeID,
				formName: formName,
				formIP: formIP,
				formPort: formPort,
				formCap: formCap,
			})
			.then((res) => {
				if (res.data.affectedRows) {
					props.setRefresh(!props.refresh);
					props.setShow(false);
					setToasts([
						<BHToast key={Math.random()} bg="success">
							Successfully edited account!
						</BHToast>,
					]);
				} else {
					if (res.data.errno && res.data.errno === 1062) {
						setErr("There is another node with same IP and port!");
					} else {
						setErr(err);
					}
				}
			})
			.catch((err) => {
				setErr(err);
			});
	};

	const handleHide = () => {
		props.setShow(false);
	};

	const loadData = () => {
		setErr();
		axios
			.get("/getNodeInfo/" + props.nodeID)
			.then((res) => {
				setFormName(res.data[0].name);
				setFormIP(res.data[0].ip);
				setFormPort(res.data[0].port);
				setFormCap(res.data[0].capacity);
			})
			.catch((err) => {});
	};

	return (
		<Modal show={props.show} onHide={handleHide} onShow={loadData}>
			<Modal.Header>
				<Modal.Title>Edit Node</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{err ? <Alert variant="danger">{err}</Alert> : ""}
				<Form onSubmit={onSubmit}>
					<Form.Group className="mb-3" controlId="nodeNamee">
						<Form.Label>Node Name</Form.Label>
						<Form.Control
							type="text"
							value={formName}
							onChange={(e) => setFormName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodeIP">
						<Form.Label>IP Address</Form.Label>
						<Form.Control
							type="text"
							value={formIP}
							onChange={(e) => setFormIP(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodePort">
						<Form.Label>Port</Form.Label>
						<Form.Control
							type="number"
							value={formPort}
							onChange={(e) => setFormPort(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodeCap">
						<Form.Label>Capacity</Form.Label>
						<Form.Control
							type="number"
							value={formCap}
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

export default EditAccount;
