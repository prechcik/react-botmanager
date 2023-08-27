import { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "../../axiosClient";
import Moment from "react-moment";
import RSMap from "../RSMap/RSMap";
import SkillPanel from "./SkillPanel";
import InventoryPanel from "./InventoryPanel";
import EquipmentPanel from "./EquipmentPanel";
import BankPanel from "./BankPanel";
import Quests from "./Quests";
import AccountSettings from "./AccountSettings";
import AccountLog from "./AccountLog";
const Account = () => {
	let { id } = useParams();

	const [data, setData] = useState(null);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		axios
			.get("/account/" + id)
			.then((res) => {
				setData(res.data[0]);
			})
			.catch((err) => {
				console.log(err);
				setData([]);
			});
		setTimeout(() => {
			setRefresh(!refresh);
		}, 30000);
	}, [id, refresh]);

	return data ? (
		<Container>
			{/* Map */}
			<Row style={{ height: "90vh" }}>
				<Col className="p-0 w-100 h-100">
					<Card className="h-100">
						<Card.Body className="p-0 h-100">
							<div
								style={{
									display: "block",
									position: "relative",
									zIndex: 9998,
									top: "0px",
								}}
								className="h-100"
							>
								<RSMap
									center={[-79, -138.5]}
									markers={
										data.posX > 0 ? [{ x: data.posX, y: data.posY }] : null
									}
									zoom={8}
									zoomEnabled={false}
									refresh={refresh}
								></RSMap>
							</div>
							<div
								style={{
									display: "block",
									position: "absolute",
									top: "0px",
									zIndex: 9999,
								}}
								className="p-3 w-100"
							>
								<Card
									style={{ background: "rgba(255,255,255, 0.5)" }}
									className=""
								>
									<Card.Body>
										{/* Account Info */}
										<Row>
											<Col>
												<Card style={{ background: "rgba(255,255,255, 0.7)" }}>
													<Card.Body>
														<Row className="text-center">
															<Col>
																<p>
																	<strong>Account: </strong>
																</p>
																<p>{data.email}</p>
															</Col>
															<Col>
																<p>
																	<strong>Character name: </strong>
																</p>
																<p className="m-0">{data.name}</p>
																<p className="p-0 m-0">
																	{data.online ? (
																		<Badge bg="success">Online</Badge>
																	) : (
																		<Badge bg="danger">Offline</Badge>
																	)}
																</p>
															</Col>
															<Col>
																<p>
																	<strong>Created: </strong>
																</p>
																<p>
																	<Moment
																		format="DD-MM-YYYY"
																		date={data.created_at}
																	/>
																</p>
															</Col>
															<Col>
																<p>
																	<strong>Total Level: </strong>
																</p>
																<p>{data.total}</p>
															</Col>
															<Col>
																<p>
																	<strong>Combat Level: </strong>
																</p>
																<p>{data.combat}</p>
															</Col>
															<Col>
																<p>
																	<strong>Quest Points: </strong>
																</p>
																<p>{data.qp}</p>
															</Col>
														</Row>
													</Card.Body>
												</Card>
											</Col>
										</Row>
										{/* End Account Info */}
										{/* Center Container */}
										<Row className="mt-3">
											<Col>
												<Card style={{ background: "rgba(255,255,255, 0.2)" }}>
													<Card.Body>
														<Row className="">
															{/* Details Column */}
															<Col className="mt-2" sm={12} md={6} lg={4}>
																<Card
																	style={{
																		// width: "222px",
																		display: "block",
																		margin: "0 auto",
																	}}
																>
																	<Card.Header>Details</Card.Header>
																	<Card.Body className="p-0 m-0">
																		<Tabs
																			id="account_tabs"
																			defaultActiveKey={"Skills"}
																			className="justify-content-center"
																			fill
																		>
																			<Tab
																				eventKey={"Skills"}
																				title={"Skills"}
																				className="p-2"
																			>
																				<SkillPanel
																					account={data.id}
																					refresh={refresh}
																					setRefresh={setRefresh}
																				/>
																			</Tab>
																			<Tab
																				eventKey={"Inventory"}
																				title={"Inventory"}
																				className="p-2"
																			>
																				<InventoryPanel
																					account={data.id}
																					refresh={refresh}
																					setRefresh={setRefresh}
																				/>
																			</Tab>
																			<Tab
																				eventKey={"Equipment"}
																				title={"Equipment"}
																				className="p-2"
																			>
																				<EquipmentPanel
																					account={data.id}
																					refresh={refresh}
																					setRefresh={setRefresh}
																				/>
																			</Tab>
																			<Tab eventKey={"Bank"} title={"Bank"}>
																				<BankPanel
																					account={data.id}
																					refresh={refresh}
																					setRefresh={setRefresh}
																				/>
																			</Tab>
																			<Tab
																				eventKey={"Quests"}
																				title={"Quests"}
																				className="p-2"
																			>
																				<Quests
																					account={data.id}
																					refresh={refresh}
																					setRefresh={setRefresh}
																				/>
																			</Tab>
																		</Tabs>
																	</Card.Body>
																</Card>
															</Col>
															{/* End Details Column */}
															<Col className="mt-2" sm={12} md={6} lg={4}>
																<Card>
																	<Card.Header>
																		<Card.Title>Account Settings</Card.Title>
																	</Card.Header>
																	<Card.Body>
																		<AccountSettings
																			data={data}
																			account={id}
																			setRefresh={setRefresh}
																			refresh={refresh}
																		/>
																	</Card.Body>
																</Card>
															</Col>
															<Col className="mt-2" sm={12} md={6} lg={4}>
																<Card>
																	<Card.Header>Account Log</Card.Header>
																	<Card.Body>
																		<AccountLog
																			account={id}
																			refresh={refresh}
																			setRefresh={setRefresh}
																		/>
																	</Card.Body>
																</Card>
															</Col>
														</Row>
													</Card.Body>
												</Card>
											</Col>
										</Row>
										{/* End Center Container */}
									</Card.Body>
								</Card>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			{/* End Map */}
		</Container>
	) : (
		<></>
	);
};

export default Account;
