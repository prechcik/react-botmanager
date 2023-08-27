import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const DashboardOnlineList = (props) => {
	return (
		<DataTable
			columns={[
				{
					name: "",
					center: true,
					width: "50pt",
					cell: (row) => {
						return (
							<Link to={"/account/" + row.account}>
								<Button>
									<FontAwesomeIcon icon={faSearch} />
								</Button>
							</Link>
						);
					},
				},
				{
					name: "Name",
					selector: (row) => row.name,
					center: true,
					sortable: true,
				},
				{
					name: "Task",
					selector: (row) => row.lastTask,
					center: true,
					sortable: true,
				},
				{
					name: "World",
					selector: (row) => row.world,
					center: true,
					sortable: true,
				},
				{
					name: "Combat",
					selector: (row) => row.combat,
					center: true,
					sortable: true,
				},
				{
					name: "Total",
					selector: (row) => row.total,
					center: true,
					sortable: true,
				},
				{
					name: "QP",
					selector: (row) => row.qp,
					center: true,
					sortable: true,
				},
			]}
			data={props.accounts}
			theme="light"
			pagination
			paginationPerPage={10}
			striped
			highlightOnHover
			responsive
		></DataTable>
	);
};

export default DashboardOnlineList;
