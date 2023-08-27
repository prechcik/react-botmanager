import { useState } from "react";
import { Toast } from "react-bootstrap";

const BHToast = (props) => {
	const [show, setShow] = useState(true);
	return (
		<Toast
			key={Math.random()}
			show={show}
			onClose={() => {
				setShow(false);
			}}
			delay={4000}
			autohide
			bg={props.bg}
		>
			<Toast.Body>{props.children}</Toast.Body>
		</Toast>
	);
};

export default BHToast;
