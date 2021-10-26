import { BrowserRouter } from "react-router-dom";

import './App.scss';

import Header from './layout/Header';
import Main from './layout/Main';

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Header />
          <Main />
        </BrowserRouter>
      </div>
  );
}

export default App;
