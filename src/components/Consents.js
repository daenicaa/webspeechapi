import React from "react";
import { MdCheck, MdClose, MdPlayArrow, MdOutlinePause } from 'react-icons/md';

function Consents() {

		let cons = localStorage.getItem('consents');

		let consents = typeof(cons) == 'string' ? JSON.parse(cons) : []
		console.log('hello', consents.length)

		function handlePlay(event, message) {
			//pause icon
			if(event.target.closest('.consent-item')){
				event.target.closest('.consent-item').classList.add('speaking')
			}

	    let consentMessageUtter = new SpeechSynthesisUtterance(message);
	    speechSynthesis.speak(consentMessageUtter);
			//play icon
			setTimeout(() => {
				if(event.target.closest('.consent-item')){
					event.target.closest('.consent-item').classList.remove('speaking')
				}
			}, 1000)
	  }

		return (
      <div className="card consents-container">
			<h2>All Consents</h2>
			{consents.length > 0 ? (
				<div>
					<div className="consents-head">
						<h3>Details</h3> <h3>Consent Given</h3>
					</div>
					{
						consents.map((consent, index) => (
							<div id={`consent-${index}`} key={`connsent-item-${index}`} className="consent-item">
							 	<label>
									{ consent.name }
									<small>Language: {consent.lang === 'en' ? ("English") : ("French")} </small>
								</label>

									{consent.consent > 0 ? (
										<div className="consent-item--given">
											<MdCheck className="icon-first"/>
											<div className="icon-box small" onClick={(e) => { handlePlay(e, consent.message) }}>
	                      <MdPlayArrow className="icon play" />
												<MdOutlinePause className="icon speaking" />
	                    </div>
										</div>
									) : (
										<div className="consent-item--given">
											<MdClose className="icon-first" />
											<div className="icon-box small" onClick={(e) => { handlePlay(e, consent.message) }}>
												<MdPlayArrow className="icon play" />
												<MdOutlinePause className="icon speaking" />
											</div>
										</div>
									)}
							</div>
					 ))
				 }
				</div>
			) : (
				<div>No consent listed.</div>
			)}
			</div>
		);

}

export default Consents;
