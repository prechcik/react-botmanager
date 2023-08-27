import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../../axiosClient";
import Moment from "react-moment";

const AccountLog = (props) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		axios
			.get("/getStatusLog/" + props.account)
			.then((res) => {
				setData(res.data);
			})
			.catch((e) => console.log(e));
	}, [props.account, props.refresh]);

	const columns = [
		{
			name: "Date",
			selector: (row) => row.date,
			cell: (row) => {
				return <Moment date={row.date} fromNow />;
			},
			width: "100pt",
			center: true,
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
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			responsive
			highlightOnHover
			dense
			pagination
			paginationPerPage={10}
		/>
	);
};

export default AccountLog;
