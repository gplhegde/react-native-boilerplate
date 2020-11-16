import fetchOneUserService from '@/Services/User/FetchOne'
import { buildAction, buildReducers } from '@/Store/builder'
import { FeatureState } from '@/Store/types'

type FetchOneData = {

}

export type FetchOneState = {
    fetchOne: FeatureState<FetchOneData>
}
const initialState: FetchOneState = {
    fetchOne: {
        loading: false,
        error: null,
        data: null
    }
}


export default {
    initialState,
    action: buildAction<FetchOneData, number>('user/fetchOne', fetchOneUserService),
    reducers: buildReducers<FetchOneState, FetchOneData>({
        errorKey: 'fetchOne.error', // Optionally, if you scoped variables, you can use a key with dot notation
        loadingKey: 'fetchOne.loading',
    }),
}
