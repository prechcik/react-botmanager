import { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";

import axios from "../../axiosClient";

const NewClient = (props) => {
	const [nodeData, setNodeData] = useState();
	const [accountData, setAccountData] = useState();
	const [formNode, setFormNode] = useState();
	const [formAccount, setFormAccount] = useState();
	const [formScript, setFormScript] = useState();
	const [formScriptArgs, setFormScriptArgs] = useState("");

	const onSubmit = (e) => {
		e.preventDefault();
		let obj = {
			node: formNode,
			account: formAccount,
			script: formScript,
			scriptargs: formScriptArgs,
		};
		axios
			.post("/launchAccount", obj)
			.then((res) => {
				props.setRefresh(!props.refresh);
			})
			.catch((e) => {
				let status = e.response.status;
				if (status === 404) {
					console.log("There was an error when trying to launch account");
				} else if (status === 403) {
					console.log("This node cannot launch more clients!");
				}
			});
	};

	useEffect(() => {
		axios
			.get("/getNodes")
			.then((res) => {
				setNodeData(res.data);
				setFormNode(res.data[0].id);
			})
			.catch((e) => console.log(e));
		axios
			.get("/accounts")
			.then((res) => {
				setAccountData(res.data);
			})
			.catch((e) => console.log(e));
	}, []);

	const onNodeChange = (e) => {
		setFormNode(parseInt(e.target.value));
	};

	const onAccountChange = (e) => {
		setFormAccount(parseInt(e.target.value));
	};

	const onScriptChange = (e) => {
		setFormScript(e.target.value);
	};

	const onScriptArgsChange = (e) => {
		setFormScriptArgs(e.target.value);
	};
	return (
		<Form action="#" method="POST" onSubmit={onSubmit}>
			<FormGroup controlId="node" as={Row} className="mt-3">
				<Form.Label column sm={4}>
					Node
				</Form.Label>
				<Col sm={8}>
					<Form.Select id="nodeSelect" onChange={onNodeChange}>
						{nodeData ? (
							nodeData.map((n) => {
								return (
									<option key={n.id} value={n.id}>
										[#{n.id}] {n.name} - {n.ip}:{n.port}
									</option>
								);
							})
						) : (
							<></>
						)}
					</Form.Select>
				</Col>
			</FormGroup>
			<FormGroup controlId="account" as={Row} className="mt-3">
				<Form.Label column sm={4}>
					Account
				</Form.Label>
				<Col sm={8}>
					<Form.Select id="accountSelect" onChange={onAccountChange}>
						<option value={0}>Select account</option>
						{accountData ? (
							accountData.map((n) => {
								return n.statusid < 3 ? (
									<option
										key={n.id}
										value={n.id}
										className={
											n.statusid === 2 ? "text-success" : "text-warning"
										}
									>
										[#{n.id}] {n.email}
									</option>
								) : (
									""
								);
							})
						) : (
							<></>
						)}
					</Form.Select>
				</Col>
			</FormGroup>
			<FormGroup controlId="script" as={Row} className="mt-3">
				<Form.Label column sm={4}>
					Script
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						type="text"
						placeholder="Script name"
						onChange={onScriptChange}
						required
					/>
				</Col>
			</FormGroup>
			<FormGroup controlId="scriptargs" as={Row} className="mt-3">
				<Form.Label column sm={4}>
					Script Arguments
				</Form.Label>
				<Col sm={8}>
					<Form.Control
						type="text"
						placeholder="eg. path to script configuration file"
						onChange={onScriptArgsChange}
					/>
				</Col>
			</FormGroup>
			<FormGroup controlId="submit" className="mt-3">
				<Button type="submit" variant="primary" className="w-100">
					Launch
				</Button>
			</FormGroup>
		</Form>
	);
};

export default NewClient;
