import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Accounts from "./Components/Accounts/Accounts";
import Proxies from "./Components/Proxies/Proxies";
import Launcher from "./Components/Launcher/Launcher";
import Settings from "./Components/Settings/Settings";
import Login from "./Components/Login/Login";
import Account from "./Components/Account/Account";
import isValidProp from "@emotion/is-prop-valid";
import { StyleSheetManager } from "styled-components";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout setToken={setToken} />,
			children: [
				{
					path: "/",
					element: <Dashboard />,
				},
				{
					path: "/accounts",
					element: <Accounts />,
				},
				{
					path: "/account/:id",
					element: <Account />,
				},
				{
					path: "/proxies",
					element: <Proxies />,
				},
				{
					path: "/launcher",
					element: <Launcher />,
				},
				{
					path: "/settings",
					element: <Settings />,
				},
			],
		},
	]);

	function setToken(t) {
		sessionStorage.setItem("token", JSON.stringify(t));
	}

	function getToken() {
		const tokenString = sessionStorage.getItem("token");
		const userToken = JSON.parse(tokenString);
		return userToken ? userToken : undefined;
	}

	const token = getToken();

	if (!token) return <Login setToken={setToken} />;

	return (
		<StyleSheetManager shouldForwardProp={(propn) => isValidProp(propn)}>
			<RouterProvider router={router}></RouterProvider>
		</StyleSheetManager>
	);
}

export default App;
