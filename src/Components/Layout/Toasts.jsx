import { useContext } from "react";
import { ToastContainer } from "react-bootstrap";
import { AppContext } from "../../appcontext";
const Toasts = () => {
	const { toasts } = useContext(AppContext);
	return (
		<ToastContainer
			position="top-end"
			className="m-4"
			style={{ zIndex: 99999, position: "fixed" }}
		>
			{toasts.length > 0 ? (
				toasts.map((t) => {
					return t;
				})
			) : (
				<></>
			)}
		</ToastContainer>
	);
};

export default Toasts;
