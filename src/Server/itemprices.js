const { default: axios } = require("axios");

const GetItemPrices = ({ conn }) => {
	axios
		.get("https://prices.runescape.wiki/api/v1/osrs/6h")
		.then((res) => {
			let d = res.data.data;
			let itemsProcessed = 0;
			conn.query(
				"DELETE FROM itemPrices WHERE time < NOW() - INTERVAL 7 DAY",
				(err, rows) => {
					if (err) console.log(err);
					for (const key in d) {
						let value = d[key];
						if (value.avgLowPrice > 0 && value.avgHighPrice > 0) {
							conn.query(
								`INSERT INTO itemPrices(itemid, lowPrice, lowVolume, highPrice, highVolume) VALUES(${parseInt(
									key
								)}, ${value.avgLowPrice}, ${value.lowPriceVolume}, ${
									value.avgHighPrice
								}, ${value.highPriceVolume})`,
								(err, rows) => {
									if (err) {
										console.log(err);
									} else {
									}
								}
							);
							itemsProcessed++;
						}
					}
					console.log(
						"[" +
							new Date().toLocaleString() +
							"] Processed " +
							itemsProcessed +
							" item prices"
					);
				}
			);
		})
		.catch((e) => console.log(e));
};

const GetItemAverages = ({ conn }) => {
	conn.query(
		`SELECT itemid, AVG(lowPrice) AS lowPrice, AVG(highPrice) AS highPrice FROM itemPrices WHERE time > NOW() - INTERVAL 6 HOUR GROUP BY itemid`,
		(err, rows) => {
			if (err) {
				console.log(err);
			} else {
				if (rows.length > 0) {
					let processed = 0;
					rows.map((row) => {
						processed++;
						return conn.query(
							`INSERT INTO 
                    itemPrices_averages(id, lowPrice, highPrice) 
                    VALUES(${row.itemid}, ${row.lowPrice}, ${row.highPrice})
                    ON DUPLICATE KEY UPDATE lowPrice=${row.lowPrice}, highPrice=${row.highPrice}
                    `,
							(err, rows) => {
								if (err) {
									console.log(err);
								}
							}
						);
					});
					console.log(
						"[" +
							new Date().toLocaleString() +
							"] Processed " +
							processed +
							" item averages"
					);
				}
			}
		}
	);
};

module.exports = { GetItemPrices, GetItemAverages };
