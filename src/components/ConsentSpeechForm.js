import { useState } from 'react';
import { MdMic, MdArrowRightAlt, MdPlayArrow, MdRefresh, MdOutlinePause } from 'react-icons/md';

function SpeechConsentForm({ action, consent, translationResult, setTab, handleRetry, handleSetAction }) {
  const [speaking, setSpeaking] = useState('')

  function handlePlay(event, consent) {
    setSpeaking('speaking')

    const consentMessageUtter = new SpeechSynthesisUtterance(consent.message)
    speechSynthesis.speak(consentMessageUtter)

    consentMessageUtter.onend = function(event) {
      setSpeaking('')
    }
  }

  function handleSaveConsent(event) {
    let consents = localStorage.getItem('consents') ? JSON.parse(localStorage.getItem('consents')) : []
    consents.push(consent)
    localStorage.removeItem('consents')
    localStorage.setItem('consents', JSON.stringify(consents))
    handleSetAction('sentconsent')
    setTab('success')
  }

	return (
    <form className="form-container" onSubmit={handleSaveConsent}>
      <div>
        <p>{translationResult[0]}</p>
        <p>{translationResult[1]}</p>
  		</div>
      <div>
        {consent ? (
          <div>
            <div className={`d-flex respond-container ${speaking}`}>
              <div className="icon-box">
                <MdPlayArrow className="icon play" onClick={(e) => {handlePlay(e, consent)}}/>
                <MdOutlinePause className="icon speaking" onClick={(e) => {handlePlay(e, consent)}}/>
              </div>
              <label>You responded {consent.consent ? (<span>"Yes"</span>) : (<span>"No"</span>)}</label>
            </div>
            <div className="btn-group d-flex">
              <button type="button" onClick={handleRetry} className="btn secondary">Retry <MdRefresh /></button>
              <button type="submit" className="btn secondary">Save <MdArrowRightAlt /></button>
            </div>
          </div>
        ) : (
          <div className="flex-center">
            <div className={`icon-box ${action}`}>
              <MdMic className="icon" />
            </div>
          </div>
        )}
      </div>
    </form>
	)
}

export default SpeechConsentForm;
