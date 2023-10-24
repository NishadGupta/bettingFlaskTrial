// store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { userReducer, gameRoomReducer } from './reducers';

const rootReducer = combineReducers({
  user: userReducer,
  gameRoom: gameRoomReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
