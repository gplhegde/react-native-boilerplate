import { buildSlice } from '@/Store/builder'
import FetchOne, { FetchOneState } from './FetchOne'

// This state is common to all the "user" module, and can be modified by any "user" reducers
const moduleInitialState = {
    item: {},
}

type UserSliceState = FetchOneState & {
    items: {}
}

export default buildSlice<UserSliceState>('user', [FetchOne], moduleInitialState).reducer

