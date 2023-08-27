import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosClient";
import Moment from "react-moment";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const QueueList = (props) => {
	const [data, setData] = useState();
	const [selected, setSelected] = useState();

	useEffect(() => {
		axios.get("/getQueues").then((res) => {
			setData(res.data);
		});
	}, [props.refresh]);

	const columns = [
		{
			name: "Node",
			selector: (row) => row.node,
		},
		{
			name: "Account ID",
			selector: (row) => row.id,
			hide: "lg",
		},
		{
			name: "Node ID",
			selector: (row) => row.nodeid,
			hide: "lg",
		},
		{
			name: "E-mail",
			selector: (row) => row.account.username,
		},

		{
			name: "Started",
			selector: (row) => row.startTime,
			cell: (row) => {
				return <Moment date={row.startTime} fromNow />;
			},
		},
		{
			name: "Script",
			selector: (row) => row.account.script,
		},
	];

	const onSelectedChanged = ({ selectedRows }) => {
		setSelected(selectedRows[0]);
	};

	const stopSelected = (e) => {
		if (!selected) return;
		let url = "/kill/" + selected.nodeid + "/" + selected.account.id;
		console.log(url);
		axios
			.get(url)
			.then((res) => {
				props.setRefresh(!props.refresh);
				setSelected();
			})
			.catch((e) => {
				console.log(e);
			});
	};

	return (
		<>
			<Row>
				<Col className="text-end">
					<ButtonGroup>
						<Button variant="danger" onClick={stopSelected}>
							<FontAwesomeIcon icon={faStop} className="pe-2" />
							Stop
						</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<DataTable
				columns={columns}
				data={data}
				theme="light"
				pagination
				paginationPerPage={10}
				striped
				highlightOnHover
				selectableRows
				selectableRowsSingle
				onSelectedRowsChange={onSelectedChanged}
				responsive
				dense
			/>
		</>
	);
};

export default QueueList;
