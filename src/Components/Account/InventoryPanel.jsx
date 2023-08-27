import { useEffect, useState } from "react";
import axios from "../../axiosClient";
import { Row } from "react-bootstrap";
import InventoryItem from "../InventoryItem";

const InventoryPanel = (props) => {
	let accountid = props.account;

	const [data, setData] = useState();
	let refresh = props.refresh;

	useEffect(() => {
		axios
			.get("/accountInventory/" + accountid)
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
				width: "204px",
				height: "275px",
				background: 'url("/img/Inventory_tab.png")',
				backgroundRepeat: "no-repeat",
				opacity: 1,
				color: "yellow",
				fontSize: "12pt",
				margin: "0 auto",
			}}
		>
			<Row className="m-0 p-3 align-items-center">
				{data
					? data.map((d, index) => {
							return (
								<InventoryItem
									key={index}
									id={d.itemid}
									amount={d.amount}
									icon={d.icon}
									name={d.name}
									slot={d.inventorySlot}
									wiki={d.wiki_url}
								/>
							);
					  })
					: ""}
			</Row>
		</div>
	);
};

export default InventoryPanel;
