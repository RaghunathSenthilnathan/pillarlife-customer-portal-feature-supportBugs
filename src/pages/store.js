import policyReducer from "./Reducers/reducer"
import {combineReducers} from 'redux';
import { configureStore } from '@reduxjs/toolkit'


const rootReducer = combineReducers({
  policyDetails : policyReducer
})


  // load string from localStarage and convert into an Object
  // invalid output must be undefined
  function loadFromLocalStorage() {
    try {
      const serialisedState =localStorage&& localStorage.getItem("persistantState");
      if (serialisedState === null) return undefined;
      return JSON.parse(serialisedState);
    } catch (e) {
      console.warn(e);
      return undefined;
    }
  }

  
export default configureStore({ reducer : rootReducer,
    preloadedState: loadFromLocalStorage(),
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
})


     
  
    
  