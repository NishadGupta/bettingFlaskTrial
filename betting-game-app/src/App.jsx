import { useState } from 'react';
import './App.css'
import { LandingPage } from './components/LandingPage'
import { Tournament } from './components/Tournament'
import { PlaceBet } from './components/PlaceBet';
import { Button } from '@mui/material';
import { Login } from './components/Login';

function App() {
  const [value, setValue] = useState(3);
  const [startBets, setStartBets] = useState(false);
  const [userData, setUserData] = useState({});
  return (
    <>
      {Object.keys(userData).length !==0  ? <>
        <LandingPage setValue={setValue} value={value} userData={userData}/>
        {/* <Tournament B={100} N={value} />
        <Button onClick={() => {
          setStartBets(!startBets)
        }}>Click to Start</Button>
        {startBets && <PlaceBet />} */}
      </>: <><Login userData={userData} setUserData={setUserData} /></> }

    </>
  )
}

export default App