import CardNavigation from './components/CardNavigation';
import './App.css';
import UserDetailsForm from './components/UserDetailsForm';
import {  
  BrowserRouter as Router,  
  Routes,  
  Route,  
  Link  
}   
from 'react-router-dom'; 
function App() {
  return (
    <Router>
    <Routes>
    <Route exact path='/' element={<UserDetailsForm/>}></Route>
    <Route exact path='/dashboard' element={<CardNavigation/>}></Route>
    </Routes>
    
    </Router>
  );
}

export default App;
