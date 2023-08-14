import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/pages/Home/Home.jsx';
import TrainDetails from '../src/pages/TrainDetails/TrainDetails.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/train" element={<Home />} />
        <Route path="/train/:slug" >
          <Route element={<TrainDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
