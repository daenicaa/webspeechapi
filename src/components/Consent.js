import { useState } from "react";
import { MdCheck, MdClose, MdPlayArrow, MdOutlinePause } from 'react-icons/md';

function Consents({ consents }) {
	const [activeContent, setActiveContent] = useState(-1)

	function handlePlay(event, index, message) {
		setActiveContent(index)

    const consentMessageUtter = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(consentMessageUtter)

		consentMessageUtter.onend = function(event) {
      setActiveContent(-1)
    }
  }

	return (
	  <div>
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
		 	))}
		</div>
	)
}

export default Consents;
