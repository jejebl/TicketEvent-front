import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Events from './components/Events';
import CreateEvent from './components/CreateEvent';
import YourEvent from './components/YourEvent';
import EventPage from './components/EventPage';
import YourTicket from './components/YourTicket';


function App() {
  return (
    <div className="App">
      <Navbar />
        <Routes>
          <Route path="*" element={<Events/>}></Route>
          <Route path="/eventPage/:tokenId" element={<EventPage />}/> 
          <Route path="/createevent" element={<CreateEvent />}/>        
          <Route path="/YourEvent" element={<YourEvent />}/> 
          <Route path="/YourTicket" element={<YourTicket />}/>           
        </Routes>
    </div>
  );
}

export default App;
