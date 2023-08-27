import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, FormLabel, Row } from "react-bootstrap";
import axios from "../../axiosClient";
import { AppContext } from "../../appcontext";
import BHToast from "../BHToast";

const AccountSettings = (props) => {
	const [proxies, setProxies] = useState();
	const [selectedProxy, setSelectedProxy] = useState(props.data.proxyid);
	const [selectedStatus, setSelectedStatus] = useState(props.data.status);

	const { setToasts } = useContext(AppContext);

	useEffect(() => {
		axios
			.get("/proxies")
			.then((res) => {
				setProxies(res.data);
			})
			.catch((e) => console.log(e));
	}, []);

	const onSubmit = (e) => {
		e.preventDefault();
		axios
			.post("/updateAccount", {
				account: props.account,
				proxy: selectedProxy,
				status: selectedStatus,
			})
			.then((res) => {
				// console.log(res);
				setToasts([
					<BHToast key={Math.random()} bg="success">
						Successfully updated account settings!
					</BHToast>,
				]);

				props.setRefresh(!props.refresh);
			})
			.catch((e) => console.log(e));
	};

	return (
		<Form action="#" method="POST" onSubmit={onSubmit}>
			<FormGroup as={Row} controlId="accountProxy">
				<FormLabel column xs={3}>
					Proxy
				</FormLabel>
				<Col xs={9}>
					<Form.Select
						value={selectedProxy}
						onChange={(e) => setSelectedProxy(e.target.value)}
					>
						<option value={0}>None</option>
						{proxies ? (
							proxies.map((p) => {
								return (
									<option key={p.id} value={p.id}>
										[#{p.id}] {p.ip}
									</option>
								);
							})
						) : (
							<></>
						)}
					</Form.Select>
				</Col>
			</FormGroup>
			<FormGroup as={Row} className="mt-3" controlId="accountStatus">
				<FormLabel column xs={3}>
					Status
				</FormLabel>
				<Col xs={9}>
					<Form.Select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
					>
						<option value={1}>Account created</option>
						<option value={2}>Ready to bot</option>
						<option value={3}>Banned</option>
					</Form.Select>
				</Col>
			</FormGroup>
			<FormGroup className="mt-3">
				<Button variant="primary" className="w-100" type="submit">
					Save
				</Button>
			</FormGroup>
		</Form>
	);
};

export default AccountSettings;
