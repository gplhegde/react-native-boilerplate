import { AsyncThunk, createAsyncThunk, CaseReducer, } from '@reduxjs/toolkit'

type ThunkAPI = {
    dispatch?: any;
    state?: any;
}

interface SerializedError {
    name?: string
    message?: string
    code?: string
    stack?: string
}

interface PendingAction<ThunkArg> {
    type: string
    payload: undefined
    meta: {
        requestId: string
        arg: ThunkArg
    }
}

interface FulfilledAction<ThunkArg, PromiseResult> {
    type: string
    payload: PromiseResult
    meta: {
        requestId: string
        arg: ThunkArg
    }
}

interface RejectedAction<ThunkArg> {
    type: string
    payload: undefined
    error: SerializedError | any
    meta: {
        requestId: string
        arg: ThunkArg
        aborted: boolean
        condition: boolean
    }
}

export type FeatureState<D> = {
    data: D | null;
    loading: boolean;
    error: string | null;
}

export type Feature<S, ThunkArg, D> = {
    initialState: S;
    action: ReturnType<typeof createAsyncThunk>;
    reducers: {
        pending: CaseReducer<S, PendingAction<ThunkArg>>;
        fulfilled: CaseReducer<S, FulfilledAction<ThunkArg, D>>;
        rejected: CaseReducer<S, RejectedAction<ThunkArg>>
    }
}