import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "../../axiosClient";

const Quests = (props) => {
	const [quests, setQuests] = useState();

	useEffect(() => {
		axios.get("/accountQuests/" + props.account).then((res) => {
			setQuests(res.data);
		});
	}, [props.account]);

	return (
		<div
			style={{
				position: "relative",
				width: "203px",
				height: "274px",
				background: 'url("/img/questbg.png")',
				backgroundRepeat: "no-repeat",
				backgroundSize: "contain",
				opacity: 1,
				color: "yellow",
				fontSize: "12pt",
				margin: "0 auto",
			}}
			className="align-items-center"
		>
			<Row style={{ height: "32px", lineHeight: "32px" }}>
				<Col xs={{ span: 6, offset: 6 }}>
					{quests && quests.qp ? quests.qp : 0}
				</Col>
			</Row>
			<Row className="m-0 h-100 pb-5">
				<Col
					style={{
						padding: "5px 12px 15px 22px",
						margin: "0px 9px 0px 0px",
						color: "lime",
						fontSize: "8.5pt",
						overflowY: "scroll",
					}}
					className="text-start"
				>
					{quests && quests.quests
						? quests.quests.map((q) => {
								let qdb = q.split(" ");
								let outstr = "";
								qdb.forEach((quest) => {
									outstr +=
										quest.charAt(0).toUpperCase() +
										quest.slice(1).toLowerCase() +
										" ";
								});
								return (
									<p key={q} className="p-0 m-0">
										{outstr}
									</p>
								);
						  })
						: ""}
				</Col>
			</Row>
		</div>
	);
};

export default Quests;
