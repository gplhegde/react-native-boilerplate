import AsyncStorage from '@react-native-community/async-storage'
import { combineReducers } from 'redux'
import {useDispatch} from 'react-redux'

import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    Persistor
} from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import createDebugger from 'redux-flipper'
import { ThunkAction } from 'redux-thunk'

import startup from './Startup'
import user from './User'

const rootReducer = combineReducers({
    startup,
    user,
})

export type RootState = ReturnType<typeof rootReducer>

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(createDebugger()),
})

const persistor: Persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export { store, persistor }
