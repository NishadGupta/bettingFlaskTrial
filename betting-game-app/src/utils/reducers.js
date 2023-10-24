// reducers.js
const userReducer = (state = {}, action) => {
    if (action.type === 'SET_USER_DATA') {
      return action.userData;
    }
    return state;
  };
  
  const gameRoomReducer = (state = [], action) => {
    if (action.type === 'SET_GAME_ROOM_DATA') {
      return action.gameRoomData;
    }
    return state;
  };
  
  export { userReducer, gameRoomReducer };
  