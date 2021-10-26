import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { MdMic, MdArrowRightAlt, MdPlayArrow, MdRefresh, MdOutlineUploadFile, MdOutlinePause } from 'react-icons/md';

function Home() {

  const [selectedLang, setSelectedLang] = useState('');
  const [userName, setUserName] = useState('');
	const [firstPage, setfirstPage] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [speechResult, setSpeechResult] = useState(false);
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(null);
  const [translationResult, setTranslationResult] = useState(null);
  const [action, setAction] = useState('');

  const trans = [
    {
      lang: 'en',
      answer: ['yes', 'no'],
      text:[`You understand that by using the site or site services, you agree to be bound by this agreement. If you do not accept this agreement in it's entirety, you must not access or use the site or the sites services.`, `Do you agree to this agreement? please respond by saying "Yes" or "No".`],
    },
    {
      lang: 'fr',
      answer: ['oui', 'non'],
      text:[`Vous comprenez qu'en utilisant le site ou les services du site, vous acceptez d'être lié par cet accord. Si vous n'acceptez pas cet accord dans son intégralité, vous ne devez pas accéder ou utiliser le site ou les services du site.`, `Êtes-vous d'accord avec cet accord? veuillez répondre en disant "Oui" ou "Non".`]
    }
  ]

	function handleNext(event) {
    if(userName === '' || selectedLang === '') {
      setAlertMessage('Please input required fields.')
    } else {
  		setTimeout(function(){
  			const consentMessage = trans.find((tran) => tran.lang === selectedLang)
        setTranslationResult(consentMessage.text)

      	setfirstPage(false);
        const agreement = `${consentMessage.text[0]}${consentMessage.text[1]}`
  			let consentMessageUtter = new SpeechSynthesisUtterance(agreement);
  			speechSynthesis.speak(consentMessageUtter);

  			consentMessageUtter.onend = function(event) {
  				let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  				let consentMessageRecognition = new SpeechRecognition();

          var grammar = selectedLang === 'en' ? '#JSGF V1.0; grammar answers; public <answer> = yes | no ;' : '#JSGF V1.0; grammar answers; public <answer> = oui | non ;'

          let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
          let speechRecognitionList = new SpeechGrammarList();
          speechRecognitionList.addFromString(grammar, 1);
          consentMessageRecognition.grammars = speechRecognitionList;
          consentMessageRecognition.lang = selectedLang

  				consentMessageRecognition.start();
          setAlertMessage('Listening...')
          setAction('listening')

          let result = null

  				consentMessageRecognition.onresult = function(event) {
            setAlertMessage('Analizing...')
            let confidence = event.results[0][0].confidence;
            if(confidence >= .8){
              //for onend
              result = true
              setMessage(event.results[0][0].transcript)

              if(['non', 'no'].includes(event.results[0][0].transcript)){
                setSpeechResult(false);
              }else {
                setSpeechResult(state => true);
              }
            }else {
              setAlertMessage('Please try again.')
            }
            setAction('')
  				}

          consentMessageRecognition.onspeechend = function() {
            consentMessageRecognition.stop();
          }

          consentMessageRecognition.onend = function(event) {
            setAlertMessage('')
            setTimeout(function(){
              if(!result) {
                setAlertMessage('Please try again.')
                setAction('retry')
              } else {
                setConsent({ name: userName, consent: speechResult, lang: selectedLang,  message: message})
              }
            }, 1000);
  				}
  			}
  		}, 1000);
    }
  }
  function handleUserName(event) {
    setUserName(event.target.value)
  }
  function handlePlay(event, consent) {
    //pause icon
    event.target.closest('.respond-container').classList.add('speaking')

    let consentMessageUtter = new SpeechSynthesisUtterance(consent.message);
    speechSynthesis.speak(consentMessageUtter);
    //play icon
    setTimeout(() => {
      event.target.closest('.respond-container').classList.remove('speaking')
    }, 1000)
  }
  function handleSaveConsent(event) {
    let consents = localStorage.getItem('consents') ? JSON.parse(localStorage.getItem('consents')) : []
    consents.push(consent)
    localStorage.removeItem('consents')
    localStorage.setItem('consents', JSON.stringify(consents))
    setAction('sentconsent');
  }
  function handleSelect(event) {
    setSelectedLang(event.target.value)
  }
  function handleRetry() {
    setAction('')
    setConsent(null)
    setAlertMessage('')
    handleNext()
  }

	return (
    <div className="card">
      <h2>Consent Form</h2>
        { action === 'sentconsent' ? (
          <div className="consent-sent--container">
            <div className="icon-box">
              <MdOutlineUploadFile className="icon"/>
            </div>
            <p>Thank you, your consent has been successfully saved!</p>
            <NavLink to="/consents">View All consents</NavLink>
          </div>
        ) : (
          <div>
    				{firstPage ? (
    					<div className="form-container">
    	          <div className="form-group">
    	            <label>Name</label>
    	            <input type="text"
                    value={userName}
                    onChange={handleUserName}
    	              placeholder="Enter your name"
    	              className="form-control"/>
    	          </div>
    	          <div className="form-group">
    	            <label>Language</label>
    							<select value={selectedLang} onChange={handleSelect} className="form-control">
                    <option value="">Select language</option>
    		            <option value="en">English</option>
    		            <option value="fr">French</option>
    		          </select>
    	          </div>
    	          <button onClick={handleNext} className="btn secondary ml-auto d-block">Next <MdArrowRightAlt /></button>
    					</div>
    				) : (
    					<div className="form-container">
                { translationResult ? (
    		          <div>
                    <p>{ translationResult[0] }</p>
                    <p>{ translationResult[1] }</p>
    							</div>
                ) : (null)}

                { consent ? (
                  <div className="">
                    <div className="d-flex respond-container">
                      <div className="icon-box">
                        <MdPlayArrow className="icon play" onClick={(e) => { handlePlay(e, consent) }}/>
												<MdOutlinePause className="icon speaking" onClick={(e) => { handlePlay(e, consent) }}/>
                      </div>
                      <label>You responded { consent.consent ? (<span>"Yes"</span>) : ( <span>"No"</span> )}</label>
                    </div>
                    <div className="btn-group d-flex">
                      <button onClick={handleRetry} className="btn secondary">Retry <MdRefresh /></button>
                      <button onClick={handleSaveConsent} className="btn secondary">Save <MdArrowRightAlt /></button>
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
            )}
            {alertMessage ? (
              <div id="alert" className="alert">{ alertMessage }</div>
            ) : ( null )}
            {action === 'retry' ? (
              <button onClick={handleRetry} className="btn secondary">Retry <MdRefresh /></button>
            ) : ( null )}
          </div>
        )}
    </div>
	);
}

export default Home;
