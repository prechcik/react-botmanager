import axios from "../../axiosClient";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import InventoryItem from "../InventoryItem";

const EquipmentPanel = (props) => {
	const accountid = props.account;
	const [data, setData] = useState();
	let refresh = props.refresh;

	useEffect(() => {
		axios
			.get("/accountEquipment/" + accountid)
			.then((res) => {
				setData(res.data);
			})
			.catch((err) => {
				setData([]);
			});
	}, [refresh, accountid]);

	const RenderEqItem = (slot) => {
		let item = GetSlot(slot.slot);
		return item ? (
			<InventoryItem
				id={item.itemid}
				amount={item.amount}
				icon={item.icon}
				wiki={item.wiki_url}
				name={item.name}
			/>
		) : (
			<InventoryItem />
		);
	};

	return (
		<div
			style={{
				position: "relative",
				width: "176px",
				height: "205px",
				background: 'url("/img/eqbg.png")',
				backgroundRepeat: "no-repeat",
				opacity: 1,
				color: "yellow",
				fontSize: "12pt",
				margin: "0 auto",
			}}
		>
			{data ? (
				<div style={{ position: "relative" }}>
					<Row className="p-0 m-0">
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "5px", left: "68px" }}
						>
							<RenderEqItem slot="HEAD" />
						</Col>
					</Row>
					<Row className="m-0 p-0 align-items-center text-center">
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "44px", left: "27px" }}
						>
							<RenderEqItem slot="CAPE" />
						</Col>
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "44px", left: "68px" }}
						>
							<RenderEqItem slot="AMULET" />
						</Col>
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "44px", left: "109px" }}
						>
							<RenderEqItem slot="ARROWS" />
						</Col>
					</Row>
					<Row className="m-0 p-0 align-items-center text-center">
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "83px", left: "12px" }}
						>
							<RenderEqItem slot="WEAPON" />
						</Col>
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "83px", left: "68px" }}
						>
							<RenderEqItem slot="CHEST" />
						</Col>
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "83px", left: "124px" }}
						>
							<RenderEqItem slot="SHIELD" />
						</Col>
					</Row>
					<Row className="m-0 p-0 align-items-center text-center">
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "123px", left: "69px" }}
						>
							<RenderEqItem slot="LEGS" />
						</Col>
					</Row>
					<Row className="m-0 p-0 align-items-center text-center">
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "163px", left: "12px" }}
						>
							<RenderEqItem slot="HANDS" />
						</Col>
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "163px", left: "69px" }}
						>
							<RenderEqItem slot="FEET" />
						</Col>
						<Col
							xs={3}
							className="p-0 align-items-center text-center"
							style={{ position: "absolute", top: "163px", left: "124px" }}
						>
							<RenderEqItem slot="RING" />
						</Col>
					</Row>
				</div>
			) : (
				""
			)}
		</div>
	);

	function GetSlot(slot) {
		for (let i = 0; i < data.length; i++) {
			if (data[i].slot === slot) return data[i];
		}
	}
};

export default EquipmentPanel;
