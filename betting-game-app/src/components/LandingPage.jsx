import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { socket } from '../socket';
import { ConnectionState } from '../utils/ConectionState';
import { ListGames } from '../utils/ListGames';
import { Button, Select, MenuItem } from '@mui/material';
import { PlaceBet } from './PlaceBet';

export const LandingPage = ({ setValue, value, userData }) => {
  const [create, setCreate] = React.useState(0);
  const [isConnected, setIsConnected] = React.useState(socket.connected);
  const [gameRoomsData, setgameRoomsData] = React.useState([]);
  const [userRoom, setUserRoom] = React.useState(null);
  const [balance, setBalance] = React.useState(100);
  const handleBalanceChange = (event) => {
    setBalance(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission (page reload)
    const userRoomDeets = {
      'uuid': userData.uuid,
      'numPlayers': value == 3 ? 10 : 18,
      'balance': balance,
    }
    setBalance('');
    socket.emit('createGame', userRoomDeets);
  };
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleRoomButton = (event) => {
    if (event.target.value === "create") {
      setCreate(1);
    }
    if (event.target.value === "join") {
      setCreate(0);
    }
  }
  React.useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onListGames(value) {
      setgameRoomsData(value);
    }
    socket.connect();
    socket.emit('listGames', { uuid: userData.uuid });
    socket.on('get_games_list', onListGames);
    return () => {
      socket.off('get_games_list', onListGames);
    };

  }, [gameRoomsData]);

  React.useEffect(() => {
    function onCreateGame(value) {
      setUserRoom(value);
      console.log(userRoom);
    }
    socket.on('lobby', onCreateGame);
    return () => {
      socket.off('lobby', onCreateGame);
    };
  }, [userRoom]);
  return (
    //Consume API for Rooms
    <>
      {/* <ConnectionState isConnected={isConnected} /> */}
      <button value='create' onClick={handleRoomButton} >Create Room</button>
      <button value='join' onClick={handleRoomButton}>Join Room</button>
      {create ? 
      <form onSubmit={handleSubmit}>
        <>{userRoom ? ( 
          <PlaceBet userData={userData} joinedRoom={userRoom}/>
      ) : (
        // Render a loading state or other content while waiting for data
        <p>Loading...</p>
      )}</>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Number of players</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel value={3} control={<Radio />} label="10" />
            <FormControlLabel value={4} control={<Radio />} label="18" />
          </RadioGroup>
          <Select
            value={balance}
            onChange={handleBalanceChange}
            name="balance"
          >
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
            <MenuItem value={500}>500</MenuItem>
            <MenuItem value={1000}>1000</MenuItem>
          </Select>
          <Button type="submit">Submit</Button>
        </FormControl>
      </form> : <ListGames listGames={gameRoomsData.games_list} userData={userData} />}
    </>
  );
}