import { useEffect, useState } from "react";
import {
	Badge,
	Button,
	ButtonGroup,
	Col,
	Container,
	Row,
} from "react-bootstrap";
import axios from "../../axiosClient";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import AddProxy from "./AddProxy";
import EditProxy from "./EditProxy";
import Moment from "react-moment";

const Proxies = () => {
	const [proxies, setProxies] = useState([]);
	const [selected, setSelected] = useState();
	const [showAdd, setShowAdd] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [editId, setEditId] = useState(null);

	useEffect(() => {
		axios
			.get("/proxies")
			.then((res) => {
				setProxies(res.data);
			})
			.catch((err) => {
				setProxies([]);
			});
	}, [refresh]);

	const onSelectedChange = ({ selectedRows }) => {
		setSelected(selectedRows[0]);
	};

	const onAddClick = (e) => {
		setShowAdd(true);
		e.preventDefault();
	};

	const onEditClick = (e) => {
		if (!selected) return;
		setEditId(selected.id);
		setShowEdit(true);
		e.preventDefault();
	};

	const onDeleteClick = (e) => {
		if (!selected) return;
		e.preventDefault();
		if (window.confirm("Are You sure You want to delete this proxy?")) {
			axios
				.get("/removeProxy/" + selected.id)
				.then((res) => {})
				.catch((err) => {});
			setSelected(null);
			setRefresh(!refresh);
		}
	};

	return (
		<Container className="shadow">
			<AddProxy
				refresh={refresh}
				setRefresh={setRefresh}
				show={showAdd}
				setShow={setShowAdd}
			/>
			<EditProxy
				refresh={refresh}
				setRefresh={setRefresh}
				show={showEdit}
				setShow={setShowEdit}
				nodeID={editId}
			/>
			<Row>
				<Col className="text-center">
					<h2>Proxies</h2>
					<ButtonGroup>
						<Button variant="success" onClick={onAddClick}>
							<FontAwesomeIcon icon={faAdd} className="me-2" />
							Add
						</Button>
						<Button variant="primary" onClick={onEditClick}>
							<FontAwesomeIcon icon={faEdit} className="me-2" />
							Edit
						</Button>
						<Button variant="danger" onClick={onDeleteClick}>
							<FontAwesomeIcon icon={faTrash} className="me-2" />
							Delete
						</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<Row className="mt-3">
				<Col>
					<DataTable
						columns={[
							{
								name: "ID",
								selector: (row) => row.id,
								width: "50pt",
								center: true,
								sortable: true,
							},
							{
								name: "IP",
								selector: (row) => row.ip,
								center: true,
								sortable: true,
							},
							{
								name: "Port",
								selector: (row) => row.port,
								width: "100pt",
								center: true,
							},
							{
								name: "Username",
								selector: (row) => row.login,
								width: "60pt",
								center: true,
							},
							{
								name: "Password",
								selector: (row) => row.password,
								center: true,
							},
							{
								name: "Status",
								selector: (row) => row.status,
								center: true,
								cell: (row) => {
									let variant = row.status === 1 ? "success" : "danger";
									let str = row.status === 1 ? "Good" : "Banned!";
									return (
										<Badge variant={variant} bg={variant}>
											{str}
										</Badge>
									);
								},
								sortable: true,
							},
							{
								name: "In Use?",
								selector: (row) => row.inUse,
								center: true,
								cell: (row) => {
									let variant = row.inUse === 0 ? "success" : "secondary";
									let str = row.inUse === 0 ? "No" : "Yes";
									return (
										<Badge variant={variant} bg={variant}>
											{str}
										</Badge>
									);
								},
								sortable: true,
							},
							{
								name: "Expires",
								selector: (row) => row.expires,
								center: true,
								cell: (row) => {
									return <Moment date={row.expires} fromNow />;
								},
							},
						]}
						data={proxies}
						theme="light"
						pagination
						paginationPerPage={10}
						selectableRows
						selectableRowsSingle
						striped
						highlightOnHover
						responsive
						onSelectedRowsChange={onSelectedChange}
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default Proxies;
