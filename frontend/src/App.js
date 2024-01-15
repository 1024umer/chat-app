import './App.css';
import { Routes,Route,Router} from 'react-router-dom'
import Chat from './Pages/Chat';
import Home from './Pages/Home';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chats' element={<Chat/>}/>
      </Routes>
    </div>
  );
}

export default App;
