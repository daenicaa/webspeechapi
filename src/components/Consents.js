import { useState } from "react";
import { MdCheck, MdClose, MdPlayArrow, MdOutlinePause } from 'react-icons/md';

import Consent from './Consent'

function Consents() {
	const cons = localStorage.getItem('consents')
	const consents = typeof(cons) == 'string' ? JSON.parse(cons) : []

	return (
    <div className="card consents-container">
			<h2>All Consents</h2>
			{consents.length > 0 ? (
				<div>
					<h3 className="consents-head">
						<span>Details</span>
						<span>Consent Given</span>
					</h3>
					<Consent consents="consents"/>
				</div>
			) : (<div>No consent listed.</div>)}
		</div>
	)
}

export default Consents;
