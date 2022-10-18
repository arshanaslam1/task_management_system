import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {apiSlice} from "../../api/apiSlice";
import authReducer from '../../features/auth/authSlice'
import dashboardReducer from '../../features/dashboard/dashSlice'
import {persistReducer, persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,} from "redux-persist";
import storageSession from 'redux-persist/lib/storage/session';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import resetStatesReducer from "./actions/resetStates";


const rootPersistConfig = {
    key: 'root',
    version: 1,
    storage,
    stateReconciler: autoMergeLevel2,
    blacklist: [
        apiSlice.reducerPath,
        'dashboard',
        'resetStates'
    ],
}

const dashboardPersistConfig = {
    key: 'dashboard',
    version: 1,
    storage: storageSession,
    stateReconciler: autoMergeLevel2,
    // blacklist: [
    //     apiSlice.reducerPath],
}


const CombineReducers = combineReducers({
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        dashboard: persistReducer(dashboardPersistConfig, dashboardReducer),
        resetStates: resetStatesReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'resetStates/clearResults') {
        state = {};
        // storage.removeItem('persist:root')
        // storageSession.removeItem('persist:dashboard')
    }
    return CombineReducers(state, action);
};


const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
    reducer : persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat([
            apiSlice.middleware,
        ]),
})

export const persistor = persistStore(store)