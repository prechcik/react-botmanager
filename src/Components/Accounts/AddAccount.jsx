import { useContext, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import axios from "../../axiosClient";
import { AppContext } from "../../appcontext";
import BHToast from "../BHToast";

const AddAccount = (props) => {
	const [formUsername, setFormUsername] = useState("user@example.com");
	const [formPassword, setFormPassword] = useState("password");
	const [formProxy, setFormProxy] = useState("");
	const [err, setErr] = useState();
	const [proxies, setProxies] = useState();

	const { setToasts } = useContext(AppContext);

	const getProxies = () => {
		setErr();
		axios.get("/proxies").then((res) => {
			setProxies(res.data);
		});
	};

	const onSubmit = (e) => {
		e.preventDefault();
		let obj = {
			formUsername: formUsername,
			formPassword: formPassword,
			formPort: parseInt(formProxy),
		};
		axios
			.post("/addAccount", obj)
			.then((res) => {
				if (res.data.affectedRows) {
					props.setRefresh(!props.refresh);
					props.setShow(false);
					setToasts([
						<BHToast key={Math.random()} bg="success">
							Successfully added new account!
						</BHToast>,
					]);
				} else {
					setErr("Account with the same email already exists!");
				}
			})
			.catch((err) => {
				setErr(err.message);
			});
	};

	const handleHide = () => {
		props.setShow(false);
	};

	return (
		<Modal show={props.show} onHide={handleHide} onShow={getProxies}>
			<Modal.Header>
				<Modal.Title>Add new Account</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{err ? <Alert variant="danger">{err}</Alert> : ""}
				<Form onSubmit={onSubmit}>
					<Form.Group className="mb-3" controlId="nodeNamee">
						<Form.Label>E-mail</Form.Label>
						<Form.Control
							required
							type="email"
							placeholder="user@example.com"
							onChange={(e) => setFormUsername(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodeIP">
						<Form.Label>Password</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder="password"
							onChange={(e) => setFormPassword(e.target.value)}
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="nodePort">
						<Form.Label>Proxy</Form.Label>
						<Form.Select
							required
							onChange={(e) => setFormProxy(e.target.value)}
						>
							{proxies
								? proxies.map((p) => {
										return (
											<option key={p.id} value={p.id}>
												[#{p.id}] {p.ip}:{p.port}
											</option>
										);
								  })
								: ""}
						</Form.Select>
					</Form.Group>
					<Button variant="primary" type="submit">
						Submit
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default AddAccount;
