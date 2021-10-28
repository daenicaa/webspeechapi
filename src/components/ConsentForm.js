import { React } from 'react';
import { MdArrowRightAlt } from 'react-icons/md';

function ConsentForm({ username, selectedLang, handleUsername, handleSelect, handleSubmit }) {
	return (
    <div>
			<form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Name</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsername}
            placeholder="Enter your name"
            className="form-control"/>
        </div>
        <div className="form-group">
          <label htmlFor="language">Language</label>
					<select
            name="language"
            value={selectedLang}
            onChange={handleSelect}
            className="form-control">
            <option>Select language</option>
            <option label="English" value="en">English</option>
            <option label="French" value="fr">French</option>
          </select>
        </div>
        <button className="btn secondary ml-auto d-block">Next <MdArrowRightAlt /></button>
			</form>
    </div>
	)
}

export default ConsentForm;
