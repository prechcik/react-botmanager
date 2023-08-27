import { Point } from "leaflet";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Marker, Popup, useMap } from "react-leaflet";
import { LinkContainer } from "react-router-bootstrap";

const MAP_HEIGHT_MAX_ZOOM_PX = 364544;
const RS_TILE_WIDTH_PX = 32,
	RS_TILE_HEIGHT_PX = 32; // Width and height in px of an rs tile at max zoom level
const RS_OFFSET_X = 1151; // Amount to offset x coordinate to get correct value
const RS_OFFSET_Y = 6208; // Amount to offset y coordinate to get correct value

const RSMarker = ({ x, y, account = null }) => {
	const map = useMap();
	var lat = toLatLng(map, x, y);
	return (
		<Marker position={lat}>
			{account !== null ? (
				<Popup minWidth={"350px"}>
					<Container
						className="text-center p-0 m-0"
						style={{ minWidth: "150px" }}
					>
						<Row>
							<Col>
								<strong>
									{account.name} ({account.combat})
								</strong>
							</Col>
						</Row>
						<Row className="mt-2">
							<Col xs={6}>Total: </Col>
							<Col xs={6}>{account.total}</Col>
						</Row>
						<Row className="mt-1">
							<Col xs={6}>QP: </Col>
							<Col xs={6}>{account.qp}</Col>
						</Row>
						<Row className="mt-1">
							<Col xs={6}>Last task: </Col>
							<Col xs={6}>{account.lastTask}</Col>
						</Row>
						<Row className="m-0 mt-2 w-100 p-0">
							<Col className="p-0 m-0">
								<LinkContainer to={"/account/" + account.account}>
									<Button variant="primary text-light w-100">Details</Button>
								</LinkContainer>
							</Col>
						</Row>
					</Container>
				</Popup>
			) : (
				<></>
			)}
		</Marker>
	);
};

function toLatLng(map, x, y) {
	let xx = (x - RS_OFFSET_X) * RS_TILE_WIDTH_PX + RS_TILE_WIDTH_PX / 4;
	let yy = MAP_HEIGHT_MAX_ZOOM_PX - (y - RS_OFFSET_Y) * RS_TILE_HEIGHT_PX;
	let p = new Point(xx, yy, false);
	return map.unproject(p, map.getMaxZoom());
}

export default RSMarker;
