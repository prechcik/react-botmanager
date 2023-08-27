import { Point } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
const MAP_HEIGHT_MAX_ZOOM_PX = 364544;
const RS_TILE_WIDTH_PX = 32,
	RS_TILE_HEIGHT_PX = 32; // Width and height in px of an rs tile at max zoom level
const RS_OFFSET_X = 1151; // Amount to offset x coordinate to get correct value
const RS_OFFSET_Y = 6208; // Amount to offset y coordinate to get correct value

const NavigateTo = ({ point }) => {
	const map = useMap();

	useEffect(() => {
		let p = toLatLng(map, point.x, point.y);
		map.flyTo(p, map.getZoom());
	}, [map, point.x, point.y]);

	return <></>;
};

function toLatLng(map, x, y) {
	let xx = (x - RS_OFFSET_X) * RS_TILE_WIDTH_PX + RS_TILE_WIDTH_PX / 4;
	let yy = MAP_HEIGHT_MAX_ZOOM_PX - (y - RS_OFFSET_Y) * RS_TILE_HEIGHT_PX;
	let p = new Point(xx, yy, false);
	return map.unproject(p, map.getMaxZoom());
}

export default NavigateTo;
