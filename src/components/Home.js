import { useState } from 'react'
import { MdRefresh } from 'react-icons/md'

import ConsentForm from './ConsentForm'
import ConsentSpeechForm from './ConsentSpeechForm'
import ConsentSuccessful from './ConsentSuccessful'

function Home() {
  const [selectedLang, setSelectedLang] = useState('')
  const [username, setUsername] = useState('')
	const [firstPage, setfirstPage] = useState(true)
  const [alertMessage, setAlertMessage] = useState('')
  const [speechResult, setSpeechResult] = useState(true)
  const [consent, setConsent] = useState('')
  const [translationResult, setTranslationResult] = useState(null)
  const [action, setAction] = useState('')
  let transcriptMess = ''

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

  function handleUsername(event) {
    setUsername(event.target.value)
  }

  function handleSelect(event) {
    setSelectedLang(event.target.value)
  }

	function handleSubmit(event) {
    event.preventDefault()
    if(username === '' || selectedLang === '') {
      setAlertMessage('Please input required fields.')
    } else {
      setAlertMessage('')
  		setTimeout(function(){
  			const consentMessage = trans.find((tran) => tran.lang === selectedLang)
        setTranslationResult(consentMessage.text)
      	setfirstPage(false)

        const agreement = `${consentMessage.text[0]}${consentMessage.text[1]}`
  			let consentMessageUtter = new SpeechSynthesisUtterance(agreement)
        consentMessageUtter.rate = .9
        speechSynthesis.speak(consentMessageUtter)

  			consentMessageUtter.onend = function(event) {
  				const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  				const consentMessageRecognition = new SpeechRecognition()
          const grammar = selectedLang === 'en' ? '#JSGF V1.0  grammar answers  public <answer> = yes | no  ' : '#JSGF V1.0  grammar answers  public <answer> = oui | non  '

          const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
          let speechRecognitionList = new SpeechGrammarList()
          speechRecognitionList.addFromString(grammar, 1)
          consentMessageRecognition.grammars = speechRecognitionList
          consentMessageRecognition.lang = selectedLang

  				consentMessageRecognition.start()
          setAlertMessage('Listening...')
          setAction('listening')

          let result = null
  				consentMessageRecognition.onresult = function(event) {
            setAlertMessage('Analizing...')
            const confidence = event.results[0][0].confidence
            transcriptMess = event.results[0][0].transcript

            if(confidence >= .7){
              result = true
              setSpeechResult(!['non', 'no'].includes(transcriptMess))
            } else { setAlertMessage('Please try again.') }

            setAction('')
  				}

          consentMessageRecognition.onspeechend = function() {
            consentMessageRecognition.stop()
          }

          consentMessageRecognition.onend = function(event) {
            setAlertMessage('')
            if(!result) {
              setAlertMessage('Please try again.')
              setAction('retry')
            } else {
              setConsent({ name: username, consent: speechResult, lang: selectedLang,  message: transcriptMess})
            }
  				}
  			}
  		}, 1000)
    }
  }

  function handleRetry(event) {
    setAction('')
    setConsent(null)
    setAlertMessage('')
    handleSubmit(event)
  }

  function handleSetAction(action) {
    setAction(action)
  }

	return (
    <div className="card">
      <h2>Consent Form</h2>
        {action === 'sentconsent' ? (
          <ConsentSuccessful />
        ) : (
          <div>
    				{firstPage ? (
    					<ConsentForm username={username} selectedLang={selectedLang} handleUsername={handleUsername} handleSelect={handleSelect} handleSubmit={handleSubmit} />
    				) : (
              <ConsentSpeechForm action={action} username={username} selectedLang={selectedLang} consent={consent} translationResult={translationResult} handleRetry={handleRetry} handleSetAction={handleSetAction} />
            )}
            {alertMessage ? (<div id="alert" className="alert">{alertMessage}</div>) : (null)}
            {action === 'retry' ? (<button onClick={handleRetry} className="btn secondary">Retry <MdRefresh /></button>) : (null)}
          </div>
        )}
    </div>
	)
}

export default Home
