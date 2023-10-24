import { Button } from '@mui/material';
import React, { useState } from 'react';
import { socket } from '../socket';
import { PlaceBet } from '../components/PlaceBet';

export function ListGames({ listGames, userData }) {
  const [joinedGame, setJoinedGame] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState({});
  const [stillLobby, setStillLobby] = useState(true);
  const handleJoinGame = (event) =>{
    const roomID = event.target.value;
    const selectGameDeets = {
      'uuid': userData.uuid,
      'game_uuid': roomID,
    }
    socket.emit('selectGame', selectGameDeets);
  }
  React.useEffect(() => {
    function onJoinedGame(value) {
      console.log("Socket listened");
      console.log(value);
      setJoinedGame(true);
      setStillLobby(false);
      setJoinedRoom(value);
      console.log(joinedRoom);
    }
    function onStillLobby(value){
      console.log("Still in the lobby");
      console.log(value);
    }
    socket.on('start-game', onJoinedGame);
    socket.on('lobby', onStillLobby);
    return () => {
      socket.off('start-game', onJoinedGame);
      socket.off('lobby', onStillLobby);
    };
  }, []);
  return (
    <>
    {joinedGame ? (<PlaceBet userData = {userData} joinedRoom={joinedRoom}/>):(<ul>
      {listGames?.map((roomObject, index) => {
        for (const roomName in roomObject) {
          if (roomObject.hasOwnProperty(roomName)) {
            const roomProperties = roomObject[roomName];
            return (<li key={index}>
              <button value={roomName} onClick={handleJoinGame}>{roomName}</button>
              <div>
                <p>Total Players: {roomProperties.totalPlayers}</p>
                <p>Current Players: {roomProperties.currentPlayers}</p>
              </div>
            </li>
            );
          }
        }
        return null;
      })}
    </ul>)}
    
    </>
  );
}
