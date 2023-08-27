import { useContext, useEffect, useState } from "react";
import {
	Badge,
	Button,
	ButtonGroup,
	Col,
	Container,
	Row,
} from "react-bootstrap";
import axios from "../../axiosClient";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSearch, faAdd } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import DataTable from "react-data-table-component";
import AddAccount from "./AddAccount";
import { AppContext } from "../../appcontext";
import BHToast from "../BHToast";

const Accounts = () => {
	const [accounts, setAccounts] = useState();
	const [selected, setSelected] = useState(null);
	const [showAdd, setShowAdd] = useState(false);
	const [refresh, setRefresh] = useState(false);

	const { setToasts } = useContext(AppContext);

	useEffect(() => {
		axios
			.get("/accounts")
			.then((res) => {
				setAccounts(res.data);
				// console.log(res.data);
			})
			.catch((err) => {
				setAccounts([]);
			});
	}, [refresh]);

	const onSelectedChange = ({ selectedRows }) => {
		setSelected(selectedRows[0]);
	};

	const onAddClick = (e) => {
		e.preventDefault();
		setShowAdd(true);
	};

	const onDeleteClick = (e) => {
		if (!selected) return;
		e.preventDefault();
		if (window.confirm("Are You sure You want to delete this account?")) {
			axios
				.get("/removeAccount/" + selected.id)
				.then((res) => {})
				.catch((err) => {});
			setSelected(null);
			setRefresh(!refresh);
			setToasts([
				<BHToast key={Math.random()} bg="success">
					Successfully deleted proxy!
				</BHToast>,
			]);
		}
	};

	return (
		<Container className="shadow">
			<AddAccount
				refresh={refresh}
				setRefresh={setRefresh}
				show={showAdd}
				setShow={setShowAdd}
			/>
			<Row>
				<Col className="text-center">
					<h2>Accounts</h2>
					<ButtonGroup>
						<Button variant="success" onClick={onAddClick}>
							<FontAwesomeIcon icon={faAdd} className="me-2" />
							Add
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
								name: "",
								center: true,
								width: "50pt",
								cell: (row) => {
									return (
										<Link to={"/account/" + row.id}>
											<Button>
												<FontAwesomeIcon icon={faSearch} />
											</Button>
										</Link>
									);
								},
							},
							{
								name: "ID",
								selector: (row) => row.id,
								width: "70pt",
								center: true,
								sortable: true,
							},
							{
								name: "Email",
								selector: (row) => row.email,
								center: true,
								sortable: true,
							},
							{
								name: "Character Name",
								selector: (row) => row.charactername,
								width: "100pt",
								center: true,
								sortable: true,
							},
							{
								name: "Total",
								selector: (row) => row.total,
								center: true,
								width: "70pt",
								sortable: true,
							},
							{
								name: "QP",
								selector: (row) => row.qp,
								center: true,
								width: "70pt",
								sortable: true,
							},
							{
								name: "Status",
								selector: (row) => row.status,
								center: true,
								width: "100pt",
								cell: (row) => {
									let variant = "primary";
									switch (row.statusid) {
										case 1:
											variant = "success";
											break;
										case 2:
											variant = "primary";
											break;
										case 3:
											variant = "danger";
											break;
										default:
											variant = "primary";
											break;
									}
									return (
										<Badge variant={variant} bg={variant}>
											{row.status}
										</Badge>
									);
								},
								sortable: true,
							},
							{
								name: "Last Online",
								selector: (row) => row.lastSeen,
								center: true,
								cell: (row) => {
									if (row.lastseen !== "Never")
										return <Moment date={row.lastseen} fromNow />;
									return row.lastseen;
								},
							},
						]}
						data={accounts}
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

export default Accounts;
