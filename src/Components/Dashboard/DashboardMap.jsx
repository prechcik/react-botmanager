import RSMap from "../RSMap/RSMap";
import RSMarker from "../RSMap/RSMarker";

const DashboardMap = (props) => {
	return (
		<RSMap
			center={[-78.9, -137]}
			zoom={6}
			zoomEnabled={true}
			refresh={props.refresh}
			markers={[]}
		>
			{props.markers && props.markers.length > 0 ? (
				props.markers.map((m) => {
					return (
						<RSMarker key={Math.random()} x={m.posX} y={m.posY} account={m} />
					);
				})
			) : (
				<></>
			)}
		</RSMap>
	);
};

export default DashboardMap;
