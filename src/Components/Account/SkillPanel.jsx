import { useEffect, useState } from "react";
import axios from "../../axiosClient";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

const SkillPanel = (props) => {
	let accountid = props.account;

	const [data, setData] = useState();
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		axios
			.get("/accountSkills/" + accountid)
			.then((res) => {
				setData(res.data[0]);
			})
			.catch((err) => {
				setData([]);
			});
		setTimeout(() => {
			setRefresh(!refresh);
		}, 10000);
	}, [refresh, accountid]);

	const tooltip = (text) =>
		text !== "total" ? (
			<Tooltip key={text} style={{ zIndex: 9999, position: "fixed" }}>
				{text.charAt(0).toUpperCase() + text.slice(1)}
			</Tooltip>
		) : (
			<></>
		);
	return (
		<div
			style={{
				position: "relative",
				width: "189px",
				height: "256px",
				background: 'url("/img/skillsbg.png")',
				backgroundRepeat: "no-repeat",
				opacity: 1,
				color: "yellow",
				fontSize: "12pt",
				margin: "0 auto",
			}}
		>
			<Row className="m-0 p-0">
				{data
					? Object.keys(data).map((k, index) => {
							if (k !== "id" && k !== "account")
								return (
									<OverlayTrigger key={k} placement="top" overlay={tooltip(k)}>
										<Col
											key={"skillcol" + k + index}
											xs={4}
											className="p-0 m-0"
											style={{ height: "32px" }}
										>
											<Row className="m-0 h-100 align-items-center text-center">
												{k !== "total" ? (
													<Col xs={6} className="m-0 p-0"></Col>
												) : (
													""
												)}

												<Col
													xs={k !== "total" ? 6 : 12}
													className="m-0 p-0"
													style={
														k !== "total"
															? {}
															: {
																	fontSize: "8pt",
																	verticalAlign: "bottom",
																	lineHeight: "45px",
															  }
													}
												>
													{data[k]}
												</Col>
											</Row>
										</Col>
									</OverlayTrigger>
								);
							return <div key={Math.random()}></div>;
					  })
					: "Loading"}
			</Row>
		</div>
	);
};

export default SkillPanel;
