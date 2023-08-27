const FormatNumber = (props) => {
	const map = [
		{ suffix: "T", threshold: 1e12 },
		{ suffix: "B", threshold: 1e9 },
		{ suffix: "M", threshold: 1e6 },
		{ suffix: "K", threshold: 1e3 },
		{ suffix: "", threshold: 1 },
	];

	const found = map.find((x) => Math.abs(props.children) >= x.threshold);
	if (found) {
		const formatted =
			(props.children / found.threshold).toFixed(0) + found.suffix;
		return formatted;
	}
};

export default FormatNumber;
