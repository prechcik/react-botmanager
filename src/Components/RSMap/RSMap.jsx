import { MapContainer, TileLayer } from "react-leaflet";
import RSMarker from "./RSMarker";
import NavigateTo from "./NavigateTo";

const RSMap = (props) => {
	return (
		<MapContainer
			center={props.center}
			zoom={props.zoom ? props.zoom : 6}
			maxZoom={11}
			minZoom={4}
			className="h-100"
			zoomControl={props.zoomEnabled}
			doubleClickZoom={props.zoomEnabled}
			scrollWheelZoom={props.zoomEnabled}
			dragging={props.zoomEnabled}
		>
			<TileLayer
				attribution=""
				url="http://botapi.prech.online/map/osrs_map_tiles/0/{z}/{x}/{y}.png"
				minZoom={4}
				maxZoom={11}
				tms
				noWrap
			/>
			{props.markers && props.markers.length === 1 ? (
				<NavigateTo point={props.markers[0]} />
			) : (
				<></>
			)}
			{props.markers
				? props.markers.map((marker) => {
						return (
							<RSMarker
								key={Math.random()}
								x={marker.x}
								y={marker.y}
								account={marker.account ? marker.account : null}
							/>
						);
				  })
				: ""}
			{props.children}
		</MapContainer>
	);
};

export default RSMap;
