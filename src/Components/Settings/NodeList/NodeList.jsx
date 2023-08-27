import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../../axiosClient";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { faEdit, faTrash, faAdd } from "@fortawesome/free-solid-svg-icons";
import AddNode from "./AddNode";
import EditNode from "./EditNode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NodeList = (props) => {
	const [nodes, setNodes] = useState();
	const [selected, setSelected] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const [showAdd, setShowAdd] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [editId, setEditId] = useState(null);

	useEffect(() => {
		axios
			.get("/getNodes")
			.then((res) => {
				setNodes(res.data);
			})
			.catch((err) => {
				setNodes([]);
			});
	}, [refresh]);

	const onSelectedChange = ({ selectedRows }) => {
		setSelected(selectedRows[0]);
	};

	const onEdit = (e) => {
		e.preventDefault();
		if (!selected) return;
		setEditId(selected.id);
		setShowEdit(!showEdit);
	};

	const onDelete = (e) => {
		if (!selected) return;
		e.preventDefault();
		if (window.confirm("Are You sure You want to delete this record?")) {
			// Handle Delete!
			axios
				.get("/removeNode/" + selected.id)
				.then((res) => {})
				.catch((err) => {
					setNodes([]);
				});
			setSelected(null);
			setRefresh(!refresh);
		}
	};

	const onAddNew = (e) => {
		e.preventDefault();
		setShowAdd(!showAdd);
	};

	return (
		<>
			<AddNode
				show={showAdd}
				setShow={setShowAdd}
				setRefresh={setRefresh}
				refresh={refresh}
			/>
			<EditNode
				show={showEdit}
				setShow={setShowEdit}
				setRefresh={setRefresh}
				refresh={refresh}
				nodeID={editId}
			/>
			<Row>
				<Col>
					<ButtonGroup>
						<Button variant="success" onClick={onAddNew}>
							<FontAwesomeIcon icon={faAdd} className="pe-2" />
							Add
						</Button>
						<Button variant="primary" onClick={onEdit}>
							<FontAwesomeIcon icon={faEdit} className="pe-2" />
							Edit
						</Button>
						<Button variant="danger" onClick={onDelete}>
							<FontAwesomeIcon icon={faTrash} className="pe-2" />
							Delete
						</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<DataTable
				columns={[
					{
						name: "ID",
						selector: (row) => row.id,
						center: true,
					},
					{
						name: "Name",
						selector: (row) => row.name,
						center: true,
					},
					{
						name: "IP",
						selector: (row) => row.ip,
						center: true,
					},
					{
						name: "Port",
						selector: (row) => row.port,
						center: true,
					},
					{
						name: "Capacity",
						selector: (row) => row.capacity,
						center: true,
					},
				]}
				data={nodes ? nodes : []}
				theme="light"
				pagination
				paginationPerPage={10}
				selectableRows
				selectableRowsSingle
				striped
				highlightOnHover
				onSelectedRowsChange={onSelectedChange}
			/>
		</>
	);
};

export default NodeList;
