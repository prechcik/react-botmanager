import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import md5 from "md5";
import axios from "../../axiosClient";
import { useState } from "react";

const Login = ({ setToken }) => {
	const [err, setErr] = useState(null);

	const handleLogin = (e) => {
		e.preventDefault();
		let user = document.getElementById("username").value;
		let pass = document.getElementById("password").value;
		let passMD5 = md5(pass);
		axios
			.post("/login", { username: user, password: passMD5 })
			.then((res) => {
				if (res.data.length > 0) {
					setToken(res.data[0]);
					console.log("Successfully logged in as " + res.data[0].username);
					window.location.reload();
				} else {
					setErr({ message: "Username or password is incorrect!" });
				}
			})
			.catch((err) => {
				setToken();
				setErr(err);
			});
	};

	return (
		<Container className="text-center mt-5 mb-5">
			<Row>
				<Col>
					<h1>Log in</h1>
				</Col>
			</Row>
			<Row className="justify-content-center mt-3">
				<Col xs={12} lg={6}>
					<Card>
						<Card.Body className="p-4">
							{err && (
								<Alert key="danger" variant="danger">
									{err.message}
								</Alert>
							)}
							<form action="#" method="POST" className="">
								<Row className="m-3">
									<Col className="input-group">
										<span className="input-group-text" id="usernameLabel">
											Username
										</span>
										<input
											type="text"
											className="form-control"
											id="username"
											name="username"
											placeholder="Username"
											aria-label="Username"
											aria-describedby="usernameLabel"
											autoComplete="username"
										/>
									</Col>
								</Row>
								<Row className="m-3">
									<Col className="input-group">
										<span className="input-group-text" id="passwordLabel">
											Password
										</span>
										<input
											type="password"
											className="form-control"
											id="password"
											name="password"
											placeholder="Password"
											aria-label="Password"
											aria-describedby="passwordLabel"
											autoComplete="current-password"
										/>
									</Col>
								</Row>
								<Row className="m-3">
									<Col>
										<input
											type="submit"
											value="Submit"
											className="btn btn-primary"
											onClick={handleLogin}
										/>
									</Col>
								</Row>
							</form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Login;
