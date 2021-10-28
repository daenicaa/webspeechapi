import { NavLink } from "react-router-dom"
import { MdOutlineUploadFile } from 'react-icons/md';

function ConsentSuccesful() {
	return (
		<div className="consent-sent--container">
			<div className="icon-box">
				<MdOutlineUploadFile className="icon"/>
			</div>
			<p>Thank you, your consent has been successfully saved!</p>
			<NavLink to="/consents">View All consents</NavLink>
		</div>
	)
}

export default ConsentSuccesful;
