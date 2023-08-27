var mysql = require("mysql");
var express = require("express");
var cors = require("cors");
var app = express();
var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "*",
	})
);

var settings = require("./settings.json");

var conn = mysql.createConnection({
	host: settings.db_host,
	port: settings.db_port,
	user: settings.db_user,
	password: settings.db_pass,
	database: settings.db_db,
});

conn.connect(function (err) {
	if (!!err) {
		console.log("[" + new Date().toLocaleString() + "][Launcher][DB] " + err);
	} else {
		console.log(
			"[" +
				new Date().toLocaleString() +
				"][Launcher][DB] Connected to Database!"
		);
	}
});

var clientList = [];

app.get("/getQueue", (req, res) => {
	res.json(clientList);
});

app.post("/launch", (req, res) => {
	let accountID = req.body.account;
	let scriptName = req.body.script;
	let scriptArgs = req.body.scriptargs;
	let inList = IsInList(accountID);
	if (inList) {
		res.send(404);
	} else {
		conn.query(
			`SELECT a.email, a.password, p.ip AS proxy_ip, p.port AS proxy_port, p.login AS proxy_username, p.password AS proxy_password FROM accounts a LEFT JOIN proxies p ON p.id = a.proxyid WHERE a.id = ${accountID}`,
			(err, rows) => {
				if (err) throw err;
				let db = rows[0];
				console.log(
					"[" +
						new Date().toLocaleString() +
						"][Launcher] Launching account " +
						db.email +
						" with proxy " +
						db.proxy_ip +
						":" +
						db.proxy_port
				);
				let account = new Account(
					accountID,
					db.email,
					db.password,
					scriptName,
					scriptArgs,
					db.proxy_ip,
					db.proxy_port,
					db.proxy_username,
					db.proxy_password
				);
				var client = new Client(account);
				client.launch();
				clientList.push(client);
			}
		);
		res.sendStatus(200);
	}
});

app.get("/killAccount/:account", (req, res) => {
	let account = req.params.account;
	clientList.forEach((el, index, obj) => {
		if (parseInt(el.account.id) === parseInt(account)) {
			console.log(
				"[" +
					new Date().toLocaleString() +
					"][Launcher] Killing account #" +
					account
			);
			el.kill();
			clientList.splice(index, 1);
		}
	});
	res.sendStatus(200);
});

app.listen(settings.LISTEN_PORT, settings.LISTEN_IP, () => {
	console.log(
		"[" +
			new Date().toLocaleString() +
			"][Launcher][Server] Listening on " +
			settings.LISTEN_IP +
			":" +
			settings.LISTEN_PORT
	);
});
function IsInList(id) {
	clientList.forEach((acc) => {
		if (acc.id === id) return true;
	});
	return false;
}

class Account {
	constructor(
		id,
		username,
		password,
		script,
		scriptArguments,
		proxy_ip,
		proxy_port,
		proxy_username,
		proxy_password
	) {
		this.id = id;
		this.username = username;
		this.password = password;
		this.script = script;
		this.scriptArguments = scriptArguments;
		this.proxy_ip = proxy_ip;
		this.proxy_port = proxy_port;
		this.proxy_username = proxy_username;
		this.proxy_password = proxy_password;
	}
}

class Client {
	constructor(account) {
		this.account = account;
		this.startTime = -1;
		this.pid = -1;
	}

	launch() {
		var p = require("node:path").join(
			require("os").homedir(),
			"DreamBot",
			"BotData",
			"client.jar"
		);
		let launchString = [
			`-jar`,
			p,
			`-script`,
			`${this.account.script}`,
			`-accountUsername`,
			`${this.account.username}`,
			`-accountPassword`,
			`${this.account.password}`,
			`-covert`,
			`-proxyHost`,
			`${this.account.proxy_ip}`,
			`-proxyPort`,
			`${this.account.proxy_port}`,
			`-proxyUser`,
			`${this.account.proxy_username}`,
			`-proxyPass`,
			`${this.account.proxy_password}`,
			`-username`,
			`${settings.DB_USERNAME}`,
			`-password`,
			`${settings.DB_PASSWORD}`,
			`-world`,
			"f2p",
			"-minimized",
			"-breaks",
			"Pee,random,random frequent,Long break",
			`-params`,
			`${this.account.scriptArguments}`,
		];
		// console.log("[" + new Date().toLocaleString() + "] "launchString);
		var launcher = spawn("java", launchString);
		// launcher.stderr.on("data", (data) => {
		// 	console.log("[" + new Date().toLocaleString() + "] "data.toString("ascii"));
		// });
		// launcher.on("error", (e) => console.log("[" + new Date().toLocaleString() + "] "e));
		// launcher.stdout.on("data", (d) => console.log("[" + new Date().toLocaleString() + "] "d));
		this.pid = launcher.pid;
		this.startTime = new Date();
		// console.log("[" + new Date().toLocaleString() + "] ""PID: " + this.pid);
	}

	kill() {
		let cmd = "taskkill /F /PID " + this.pid;
		// console.log("[" + new Date().toLocaleString() + "] "cmd);
		exec(cmd, (err, stdo, stde) => {
			if (err) console.log("[" + new Date().toLocaleString() + "] " + err);
			conn.query(
				`UPDATE characters SET online=0 WHERE account=${this.account.id}`,
				(err, rows) => {
					if (err) console.log("[" + new Date().toLocaleString() + "] " + err);
				}
			);
			return true;
		});
		return false;
	}
}
