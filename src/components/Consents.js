import { useState } from "react";
import { MdCheck, MdClose, MdPlayArrow, MdOutlinePause } from 'react-icons/md';

function Consents() {
	const [activeContent, setActiveContent] = useState(-1)
	const cons = localStorage.getItem('consents')
	const consents = typeof(cons) == 'string' ? JSON.parse(cons) : []

	function handlePlay(event, index, message) {
		setActiveContent(index)

    const consentMessageUtter = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(consentMessageUtter)

		consentMessageUtter.onend = function(event) {
      setActiveContent(-1)
    }
  }

	return (
    <div className="card consents-container">
			<h2>All Consents</h2>
			{consents.length > 0 ? (
				<div>
					<h3 className="consents-head">
						<span>Details</span>
						<span>Consent Given</span>
					</h3>
					{consents.map((consent, index) => (
							<div className={`consent-item ${index === activeContent ? 'speaking' : ''}`} key={`connsent-item-${index}`}>
							 	<label>
									{consent.name}
									<small>Language: {consent.lang === 'en' ? ("English") : ("French")}</small>
								</label>
								{consent.consent > 0 ? (
									<div className="consent-item--given">
										<MdCheck className="icon-first"/>
										<div className="icon-box small" onClick={(e) => handlePlay(e, index, consent.message)}>
                      <MdPlayArrow className="icon play" />
											<MdOutlinePause className="icon speaking" />
                    </div>
									</div>
								) : (
									<div className="consent-item--given">
										<MdClose className="icon-first" />
										<div className="icon-box small" onClick={(e) => handlePlay(e, index, consent.message)}>
											<MdPlayArrow className="icon play" />
											<MdOutlinePause className="icon speaking" />
										</div>
									</div>
								)}
							</div>
					 	))
				 	}
				</div>
			) : (<div>No consent listed.</div>)}
		</div>
	)
}

export default Consents;
