import { Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const DashboardLogs = (props) => {
	return (
		<Row>
			<Col xs={12} className="text-center">
				<h3>Last logs</h3>
			</Col>
			<Col xs={12}>
				<DataTable
					columns={[
						// {
						// 	name: "",
						// 	center: true,
						// 	width: "50pt",
						// 	cell: (row) => {
						// 		return (
						// 			<Link to={"/account/" + row.account}>
						// 				<Button>
						// 					<FontAwesomeIcon icon={faSearch} />
						// 				</Button>
						// 			</Link>
						// 		);
						// 	},
						// },
						{
							name: "Time",
							selector: (row) => row.date,
							cell: (row) => {
								return <Moment date={row.date} fromNow />;
							},
						},
						{
							name: "Name",
							selector: (row) => row.charactername,
							sortable: true,
							cell: (row) => {
								return (
									<Link to={"/account/" + row.account} className="nav-link">
										{row.charactername}
									</Link>
								);
							},
						},
						{
							name: "Message",
							selector: (row) => row.log,
							cell: (row) => {
								let skill = row.log.split(" ")[0];
								if (skill !== "Task" && skill !== "Hopped") {
									let skillDB = row.log.split(" ");
									let skill = skillDB[0];
									skillDB.shift();
									let skillStr = skillDB.join(" ");
									return (
										<p className="p-1 m-0">
											<img
												src={"/img/skill-icons/" + skill + "_icon.png"}
												alt={skill}
												className="me-2"
											/>
											<strong>{skill} </strong>
											{skillStr}
										</p>
									);
								} else if (skill === "Task") {
									let taskDB = row.log.split(" ");
									let task = row.log.split(" ");
									task.pop();
									task.shift();
									return (
										<p className="p-1 m-0">
											Task <strong>{task} </strong>
											{taskDB[taskDB.length - 1]}
										</p>
									);
								} else {
									return <p className="p-1 m-0">{row.log}</p>;
								}
							},
						},
					]}
					data={props.logs}
					theme="light"
					pagination
					paginationPerPage={10}
					striped
					highlightOnHover
					responsive
					dense
				></DataTable>
			</Col>
		</Row>
	);
};

export default DashboardLogs;
