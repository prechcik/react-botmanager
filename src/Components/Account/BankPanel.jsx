import { useEffect, useState } from "react";
import axios from "../../axiosClient";
import { Row } from "react-bootstrap";
import InventoryItem from "../InventoryItem";

const BankPanel = (props) => {
	let accountid = props.account;
	let refresh = props.refresh;

	const [data, setData] = useState();

	useEffect(() => {
		axios
			.get("/accountBank/" + accountid)
			.then((res) => {
				setData(res.data);
			})
			.catch((err) => {
				setData([]);
			});
	}, [refresh, accountid]);

	return (
		<div
			style={{
				position: "relative",
				width: "220px",
				height: "275px",
				background: 'url("/img/Inventory_tab.png")',
				backgroundSize: "contain",
				backgroundRepeat: "no-repeat",
				opacity: 1,
				color: "yellow",
				fontSize: "12pt",
				overflow: "hidden",
				margin: "0 auto",
			}}
			className="align-items-center"
		>
			<Row
				className="m-0 p-3 align-items-center h-100"
				style={{
					overflowY: "scroll",
					paddingBottom: "0px",
				}}
			>
				{data
					? data.map((item, index) => {
							return (
								<InventoryItem
									key={"bankItem" + index}
									id={item.itemid}
									amount={item.amount}
									name={item.name}
									icon={item.icon}
									wiki={item.wiki_url}
								/>
							);
					  })
					: ""}
			</Row>
		</div>
	);
};

export default BankPanel;
