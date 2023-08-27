var mysql = require("mysql");
var express = require("express");
var cors = require("cors");
var app = express();
require("../LauncherServer/launcherServer");
const { default: axios } = require("axios");
const { GetItemPrices, GetItemAverages } = require("./itemprices");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "*",
	})
);

var conn = mysql.createConnection({
	host: "127.0.0.1",
	user: "user",
	password: "passwrod",
	database: "database",
});

conn.connect(function (err) {
	if (!!err) {
		console.log("[" + new Date().toLocaleString() + "][Main][DB] " + err);
	} else {
		console.log(
			"[" + new Date().toLocaleString() + "][Main][DB] Connected to Database!"
		);
	}
});

conn.query(`UPDATE characters SET online=0`, (err, rows) => {
	if (err) console.log("[" + new Date().toLocaleString() + "] " + err);
});

const PricesCRON = () => {
	GetItemPrices({ conn });
};

const PriceAveragesCRON = () => {
	GetItemAverages({ conn });
};
setInterval(PricesCRON, 60 * 60 * 1000);
setInterval(PriceAveragesCRON, 60 * 60 * 1000);
PricesCRON();
PriceAveragesCRON();

app.get("/accounts", function (req, res, next) {
	conn.query(
		`SELECT 
		accounts.id, 
		accounts.email, 
		accounts.password, 
		accounts.proxyid, 
		st.id AS statusid,
		st.name AS status, 
		ch.name AS charactername, 
		ch.total AS total, 
		ch.qp AS qp, 
		COALESCE((SELECT date FROM status_log WHERE status_log.account = accounts.id ORDER BY date DESC LIMIT 1), 'Never') AS lastseen 
		FROM accounts 
		LEFT JOIN account_status st ON st.id = accounts.status 
		LEFT JOIN characters ch ON ch.account = accounts.id 
		ORDER BY id ASC`,
		(err, rows, fields) => {
			if (err)
				console.log(
					"[" + new Date().toLocaleString() + "][Main][GetAccounts] " + err
				);
			res.send(rows);
		}
	);
});

app.get("/proxies", (req, res, next) => {
	conn.query(
		`SELECT proxies.*, (SELECT COUNT(*) FROM accounts WHERE accounts.proxyid = proxies.id) AS inUse FROM proxies ORDER BY id ASC`,
		(err, rows, fiels) => {
			if (err)
				console.log(
					"[" + new Date().toLocaleString() + "][Main][GetProxies] " + err
				);
			res.send(rows);
		}
	);
});

app.get("/getProxyInfo/:id", (req, res) => {
	conn.query(
		"SELECT * FROM proxies WHERE id = " + req.params.id,
		(err, rows) => {
			if (err) res.send(err);
			res.send(rows);
		}
	);
});

app.post("/login", (req, res, next) => {
	conn.query(
		`SELECT id, username, usergroup FROM users WHERE username='${req.body.username}' AND password='${req.body.password}'`,
		(err, rows, fields) => {
			res.send(rows);
		}
	);
});

app.get("/account/:id", (req, res, next) => {
	conn.query(
		`
    SELECT
    acc.*,
    p.ip AS proxy_ip,
    c.account,
	c.name,
	c.online,
	c.posX,
	c.posY,
	c.posZ,
	c.world,
	GetTotal(acc.id),
	c.combat,
	c.qp,
    c_bank.bankstring AS bankstring,
    c_inv.inventorystring AS inventorystring,
    c_q.queststring AS queststring
    FROM accounts acc
    LEFT JOIN account_status acc_s ON acc_s.id = acc.status
    LEFT JOIN proxies p ON p.id = acc.proxyid
    LEFT JOIN characters c ON c.account = acc.id
    LEFT JOIN characters_bank c_bank ON c_bank.account = acc.id
    LEFT JOIN characters_inventory c_inv ON c_inv.account = acc.id
    LEFT JOIN characters_quests c_q ON c_q.account = acc.id
    WHERE acc.id = ${req.params.id}
    `,
		(err, rows) => {
			if (err)
				console.log(
					"[" + new Date().toLocaleString() + "][Main][GetAccount] " + err
				);
			res.send(rows);
		}
	);
});

app.get("/accountSkills/:id", (req, res) => {
	let query = `SELECT *,
	SUM(attack + hitpoints + mining + strength + agility + smithing + defence + herblore + fishing + ranged + thieving + cooking + prayer + crafting + firemaking + magic + fletching + woodcutting + runecrafting + slayer + farming + construction + hunter) AS total
	FROM characters_skills WHERE account = ${req.params.id}`;
	conn.query(query, (err, rows) => {
		if (err)
			console.log(
				"[" + new Date().toLocaleString() + "][Main][GetAccountSkills] " + err
			);
		res.send(rows);
	});
});

app.get("/accountInventory/:id", (req, res) => {
	let query = `SELECT inv.itemid, inv.amount, inv.slot AS inventorySlot, db.name, db.icon, db.wiki_url FROM characters_inventory inv LEFT JOIN itemsdb db ON db.id = inv.itemid WHERE inv.account = ${req.params.id}`;
	conn.query(query, (err, rows) => {
		if (err)
			console.log(
				"[" +
					new Date().toLocaleString() +
					"][Main][GetAccountInventory] " +
					err
			);
		res.send(rows);
	});
});

app.get("/accountEquipment/:id", (req, res) => {
	let query = `SELECT c.itemid, c.amount, c.slot, db.name, db.icon, db.wiki_url FROM characters_equipment c LEFT JOIN itemsdb db ON db.id = c.itemid WHERE account = ${req.params.id}`;
	conn.query(query, (err, rows) => {
		if (err)
			console.log(
				"[" +
					new Date().toLocaleString() +
					"][Main][GetAccountEquipment] " +
					err
			);
		res.send(rows);
	});
});

app.get("/accountBank/:id", (req, res) => {
	let query = `SELECT b.itemid, b.amount, db.name, db.icon, db.wiki_url FROM characters_bank b LEFT JOIN itemsdb db ON db.id = b.itemid WHERE account = ${req.params.id}`;
	conn.query(query, (err, rows) => {
		if (err)
			console.log(
				"[" + new Date().toLocaleString() + "][Main][GetAccountBank] " + err
			);
		res.send(rows);
	});
});

app.get("/accountQuests/:id", (req, res) => {
	conn.query(
		`SELECT q.queststring, a.qp FROM characters_quests q LEFT JOIN characters a ON a.account = q.account WHERE q.account = ${req.params.id}`,
		(err, rows) => {
			if (err) {
				res.send(err);
			}
			let quests = [];
			if (rows.length > 0) {
				let qstr = rows[0].queststring
					.replaceAll("[", "")
					.replaceAll("]", "")
					.replaceAll('"', "")
					.replaceAll('"', "")
					.replaceAll('\\"', "")
					.replaceAll("_", " ");
				quests = qstr.split(",");
			}
			res.send({ quests: quests, qp: rows.length > 0 ? rows[0].qp : 0 });
		}
	);
});

app.post("/updateAccount", (req, res) => {
	let account = req.body.account;
	let proxy = req.body.proxy;
	let status = req.body.status;
	conn.query(
		`UPDATE accounts SET proxyid = ${proxy}, status = ${status} WHERE id = ${account}`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.post("/addAccount", (req, res) => {
	let name = req.body.formUsername;
	let password = req.body.formPassword;
	let port = req.body.formPort;
	conn.query(
		`INSERT INTO accounts(email, password, proxyid, status) VALUES("${name}", "${password}", ${port}, 1)`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.get("/removeAccount/:id", function (req, res, next) {
	conn.query("DELETE FROM accounts WHERE id=" + req.params.id, (err, rows) => {
		if (err) {
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

app.get("/getNodes", (req, res) => {
	conn.query("SELECT * FROM serverNodes", (err, rows) => {
		res.send(rows);
	});
});

app.get("/ping", (req, res, next) => {
	res.send("OK");
});

app.post("/addNode", (req, res) => {
	let name = req.body.formName;
	let ip = req.body.formIP;
	let port = req.body.formPort;
	let cap = req.body.formCap;
	conn.query(
		`INSERT INTO serverNodes(name, ip, port, capacity) VALUES("${name}", "${ip}", ${port}, ${cap})`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.post("/editNode", (req, res) => {
	let id = req.body.formID;
	let name = req.body.formName;
	let ip = req.body.formIP;
	let port = req.body.formPort;
	let cap = req.body.formCap;
	conn.query(
		`UPDATE serverNodes SET name = "${name}", ip = "${ip}", port = ${port}, capacity = ${cap} WHERE id = ${id}`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.get("/removeNode/:id", function (req, res, next) {
	conn.query(
		"DELETE FROM serverNodes WHERE id=" + req.params.id,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.sendStatus(200);
			}
		}
	);
});

app.get("/getNodeInfo/:id", (req, res) => {
	conn.query(
		`SELECT * FROM serverNodes WHERE id = ${req.params.id}`,
		(err, rows) => {
			if (err) res.send(err);
			res.send(rows);
		}
	);
});

app.post("/addProxy", (req, res) => {
	let name = req.body.formUsername;
	let ip = req.body.formIP;
	let port = req.body.formPort;
	let password = req.body.formPassword;
	let expires = req.body.formExpires;
	conn.query(
		`INSERT INTO proxies(ip, port, login, password, expires) VALUES("${ip}", ${port}, "${name}", "${password}", ${
			expires !== null ? '"' + expires + '"' : null
		})`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.get("/removeProxy/:id", function (req, res, next) {
	conn.query("DELETE FROM proxies WHERE id=" + req.params.id, (err, rows) => {
		if (err) {
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});
});

app.post("/editProxy", (req, res) => {
	let id = req.body.formID;
	let name = req.body.formUsername;
	let ip = req.body.formIP;
	let port = req.body.formPort;
	let pass = req.body.formPassword;
	let expires = req.body.formExpires;
	conn.query(
		`UPDATE proxies SET ip = "${ip}", port = ${port}, login = "${name}", password = "${pass}", expires = "${expires}" WHERE id = ${id}`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.get("/getQueues", (req, res) => {
	conn.query("SELECT * FROM serverNodes", async (err, rows) => {
		let queues = [];
		// if (err) console.log(err);
		for (let row of rows) {
			await axios
				.get("http://" + row.ip + ":" + row.port + "/getQueue")
				.then(async (res) => {
					let count = 0;
					await new Promise((resolve) => {
						if (res.data.length > 0) {
							res.data.forEach((r) => {
								try {
									let tempr = r;
									tempr.node = row.name;
									tempr.nodeid = row.id;
									tempr.id = r.account.id;
									queues.push(tempr);
								} catch (err) {
									console.log(err);
								} finally {
									count += 1;
									if (count === res.data.length) resolve();
								}
							});
						} else resolve();
					});
				})
				.catch((e) => {});
		}
		res.send(queues);
	});
});

app.post("/launchAccount", (req, res) => {
	if (!req.body.node) return;
	conn.query(
		`SELECT ip, port, capacity FROM serverNodes WHERE id = ${req.body.node}`,
		(err, rows) => {
			if (err) console.log(err);
			let url = "http://" + rows[0].ip + ":" + rows[0].port + "/launch";
			let queueurl = "http://" + rows[0].ip + ":" + rows[0].port + "/getQueue";
			axios
				.get(queueurl)
				.then((qres) => {
					let queue = qres.data.length;
					if (rows[0].capacity - queue > 0) {
						axios
							.post(url, {
								account: req.body.account,
								script: req.body.script,
								scriptargs: req.body.scriptargs,
							})
							.then((ress) => {
								res.sendStatus(200);
							})
							.catch((e) => {
								res.sendStatus(404);
							});
					} else {
						res.sendStatus(403);
					}
				})
				.catch((e) => {
					// console.log(e);
				});
		}
	);
});

app.get("/kill/:node/:id", (req, res) => {
	if (!req.params.node) return;
	conn.query(
		`SELECT ip, port FROM serverNodes WHERE id = ${req.params.node}`,
		(err, rows) => {
			if (!rows || rows.length < 1) return;
			let url =
				"http://" +
				rows[0].ip +
				":" +
				rows[0].port +
				"/killAccount/" +
				req.params.id;
			axios
				.get(url)
				.then((ress) => {
					res.sendStatus(200);
				})
				.catch((e) => console.log(e));
		}
	);
});

app.get("/getStatusLog/:account", (req, res) => {
	conn.query(
		`SELECT l.id, l.date, l.log, t.name AS log_type FROM status_log l LEFT JOIN log_types t ON t.id = l.log_type WHERE l.account = ${req.params.account} ORDER BY id DESC LIMIT 100`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.get("/getDashboardMap", (req, res) => {
	conn.query(
		`SELECT c.account, c.name, c.posX, c.posY, c.posZ, c.world, c.combat, c.qp, GetTotal(c.account) AS total, GetLastTask(c.account) AS lastTask FROM characters c WHERE c.online = 1`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.get("/getDashboardLogs", (req, res) => {
	conn.query(
		`SELECT l.date, l.account, l.log, t.name AS type, c.name AS charactername FROM status_log l LEFT JOIN log_types t ON t.id = l.log_type LEFT JOIN characters c ON c.account = l.account ORDER BY l.id DESC LIMIT 50`,
		(err, rows) => {
			if (err) {
				res.send(err);
			} else {
				res.send(rows);
			}
		}
	);
});

app.listen(8800, () => {
	console.log(
		"[" +
			new Date().toLocaleString() +
			"] [Main][Server] Listening on port 8800"
	);
});
