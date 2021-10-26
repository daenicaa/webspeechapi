import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdMic, MdArrowRightAlt } from 'react-icons/md';
const translate = require('translate-google')

function Home() {

  const [selectedLang, setSelectedLang] = useState('');
  const [userName, setUserName] = useState('');
	const [firstPage, setfirstPage] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [speechResult, setSpeechResult] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const trans = ['You understand that by using the site or site services, you agree to be bound by this agreement. If you do not accept this agreement in it\'s entirety, you must not access or use the site or the sites services.', 'Do you agree to this agreement? please respond by saying "Yes" or "No".']

  // useEffect(() => {
  //   let transJoin = trans.join('-13579-')
  //   const response = axios
  //     .post( 'https://translation.googleapis.com/language/translate/v2',
  //       {},
  //       {
  //         params: {
  //           q: transJoin,
  //           target: 'fr',
  //           key: 'AIzaSyCYsCMEIxT3kmXLBGnyVq1x7V7BdQOjjHM'
  //         }
  //       }
  //     )
  //     .then((response) => {
  //       console.log('response', response)
  //       const parsed = response.data.data.translations[0].translatedText.split('-13579-')
  //       setTranslationResult(parsed);
  //     })
  //     .catch((err) => {
  //       console.log('rest api error', err);
  //     });
  // });

  const tranObj = {
  a: 1,
  b: '1',
  c: "How are you?\nI'm nice.",
  d: [true, 'true', 'hi', { a: 'hello', b: ['world']}],
}

translate(tranObj, {to: 'fr', except:['a']}).then(res => {
    console.log(res)
}).catch(err => {
    console.error(err)
})

	function handleNext(event) {
    if(userName == '' || selectedLang == '') {
      setAlertMessage('Please input required fields.')
    } else {

  		setfirstPage(false);
  		setTimeout(function(){
        //console.log('')
  			// const message = this.selectedLang == 'english' ? 'You understand that by using the site or site services, you agree to be bound by this agreement. If you do not accept this agreement in it\'s entirety, you must not access or use the site or the sites services. Do you agree to this agreement? please respond by saying "Yes" or "No".' : 'Vous comprenez qu\'en utilisant le site ou les services du site, vous acceptez d\'etre lie par cet accord. Si vous n\'acceptez pas cet accord dans son intégralité, vous ne devez pas accéder ou utiliser le site ou les services du site. Etes-vous d\'accord avec cet accord? veuillez répondre en disant "Oui" ou "Non".'
  			const consentMessage = 'You understand?'
  			let consentMessageUtter = new SpeechSynthesisUtterance(consentMessage);
  			speechSynthesis.speak(consentMessageUtter);

  			consentMessageUtter.onend = function(event) {
          setAlertMessage('Listening...')
  				let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  				let consentMessageRecognition = new SpeechRecognition();

          var grammar = '#JSGF V1.0; grammar colors; public <answer> = yes | no | oui | non ;'
          let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
          let speechRecognitionList = new SpeechGrammarList();
          speechRecognitionList.addFromString(grammar, 1);
          consentMessageRecognition.grammars = speechRecognitionList;

  				consentMessageRecognition.start();

  				console.log('Ready to receive a color command.');

          // setTimeout(function(){
          //   consentMessageRecognition.stop()
          // }, 10000);

  				consentMessageRecognition.onresult = function(event) {
            setSpeechResult(true)
            setAlertMessage('Ending...')
            console.log('speechResult', speechResult)
            console.log('results', event)
  					var color = event.results[0][0].transcript;
  					console.log('COLOR', color)
  					// let answer = color == 'No' || color == 'Yes' ? `Your answer is ${color}` : 'That is not an accepted answer.';
  					// let answerUtterance = new SpeechSynthesisUtterance(answer);
  					// speechSynthesis.speak(answerUtterance);
            consentMessageRecognition.onnomatch = function(event) {
              let answerUtterance = new SpeechSynthesisUtterance('That is not an accepted answer.');
    					speechSynthesis.speak(answerUtterance);
              setAlertMessage('That is not an accepted answer.')
            }
  				}



          consentMessageRecognition.onend = function(event) {
            console.log('speechResult', speechResult)
            setTimeout(function(){
              if(!speechResult) {
                console.log('No answer')
                setAlertMessage('You did not answer.')
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
  function handleSelect(event) {
    setSelectedLang(event.target.value)
  }

	return (
		<div className="container">
	    <div className="card">
	      <h2>Consent Form</h2>
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
		          <button onClick={handleNext} className="btn secondary">Next <MdArrowRightAlt /></button>
						</div>
					) : (
						<div className="form-container">

		          <div>

							</div>

              <div className="icon-box">
                <MdMic className="icon"/>
              </div>
			      </div>
	        )}
          {alertMessage ? (
            <div id="alert" className="alert">{ alertMessage }</div>
          ) : (
            <span></span>
          )}
	    </div>
	  </div>
	);
}

export default Home;
