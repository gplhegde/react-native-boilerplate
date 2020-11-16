import { CaseReducer, createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Feature} from './types'

type FeatureKeyMap = {
    dataKey?: string;
    loadingKey?: string;
    errorKey?: string;
}

export function buildReducers<S, D>(keyMap: FeatureKeyMap = {}) {
    const {
        dataKey = 'data',
        loadingKey = 'loading',
        errorKey = 'error',
    } = keyMap


    const handlePending: CaseReducer<S, PayloadAction<D>> = (state, action) => {
        stateKeysExists(state, [loadingKey, errorKey], action.type)
        setNestedValue(state, loadingKey, true)
        setNestedValue(state, errorKey, null)
    }

    const handleRejected: CaseReducer<S, PayloadAction<D>> = (state, action) => {
        stateKeysExists(state, [loadingKey, errorKey], action.type)
        setNestedValue(state, loadingKey, false)
        setNestedValue(state, errorKey, action.payload)
    }

    const handleFulfilled: CaseReducer<S, PayloadAction<D>> = (state, action) => {
        stateKeysExists(state, [loadingKey, errorKey], action.type)
        if(dataKey) {
            stateKeyExists(state, dataKey, action.type)
            setNestedValue(state, dataKey, action.payload)
        }
        setNestedValue(state, loadingKey, false)
        setNestedValue(state, errorKey, null)
    }

    return {
        pending: handlePending,
        fulfilled: handleFulfilled,
        rejected: handleRejected,
    }
}

function stateKeysExists<PartialState>(state: PartialState, keys: string[], type: string) {
    keys.forEach((key) => stateKeyExists(state, key, type))
}

function stateKeyExists<PartialState>(state: PartialState, key: string, type: string) {
    if (typeof getNestedValue(state, key) === 'undefined') {
        console.error(`Invalid state key : ${key} in ${type}`)
    }
}

function setNestedValue<PartialState>(state: PartialState, dotKey: string, value: any) {
    dotKey.split('.').reduce((acc, key, index, arr) => {
        if (index === arr.length - 1) {
            acc[key] = value
        }
        return acc[key]
    }, state)
}

function getNestedValue<PartialState>(state: PartialState, dotKey: string) {
    return dotKey.split('.').reduce((acc, key) => acc[key], state)
}


// todo: define thunk API type
type ThunkAPI = {
    dispatch?: any;
    state?: any;
}

export function buildAction<Returned, ThunkArg>(
    actionName: string, action: (args: ThunkArg, thunkAPI: ThunkAPI) => Returned
) {
    return createAsyncThunk<Returned, ThunkArg, ThunkAPI>(actionName, async (args, thunkAPI) => {
        try {
            return (await action(args, thunkAPI)) as Returned
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    })
}

export function buildSlice<SliceState>(name: string, features:Feature[], moduleInitialState = {}) {
    const initialState = features.reduce(
        (acc, feature) => ({
            ...acc,
            ...feature.initialState,
        }),
        { ...moduleInitialState },
    )

    return createSlice({
        name,
        initialState,
        extraReducers: (builder) => {
            feature.forEach((feature) => {
                builder
                    .addCase(feature.action.pending, feature.reducers.pending)
                    .addCase(feature.action.fulfilled, feature.reducers.fulfilled)
                    .addCase(feature.action.rejected, feature.reducers.rejected)
            })
        },
    })
}
