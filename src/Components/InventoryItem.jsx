import { Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import FormatNumber from "./FormatNumber";

const InventoryItem = ({
	id,
	amount,
	showAmount = true,
	icon,
	wiki,
	name,
	slot,
}) => {
	const toolTip =
		id > 0 ? (
			<Tooltip style={{ zIndex: 9999, position: "fixed" }}>{name}</Tooltip>
		) : (
			<></>
		);

	return (
		<OverlayTrigger placement="top" overlay={toolTip}>
			<Col
				xs={3}
				className="p-0 align-middle"
				style={{
					height: "32px",
					width: "32px",
					position: "relative",
					margin: "0px 5px 0px 5px",
				}}
			>
				{icon ? <img src={"data:image/png;base64, " + icon} alt={name} /> : ""}

				<span
					style={{
						display: "block",
						position: "absolute",
						top: "-3px",
						left: "0px",
						fontSize: "7pt",
						textShadow: "1px 1px 1px #000",
					}}
				>
					{showAmount && amount > 1 ? (
						<FormatNumber>{amount}</FormatNumber>
					) : (
						""
					)}
				</span>
			</Col>
		</OverlayTrigger>
	);
};

export default InventoryItem;
