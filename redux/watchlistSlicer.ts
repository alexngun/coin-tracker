import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './store'

const initialState : string[] = ['bitcoin', 'ethereum', 'solana', 'dogecoin']

export const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState,
    reducers: {
        setWatchList: (state, action: PayloadAction<string[]>) => {
            state = action.payload
        },
        addToWatchlist: (state, action: PayloadAction<string>) => {
            state.push(action.payload)
        },
        removeFromWatchlist: (state, action: PayloadAction<string>) => {
            return state.filter( id=>id!==action.payload )
        },
    }
})

export const { setWatchList, addToWatchlist, removeFromWatchlist } = watchlistSlice.actions
export const selectWatchlist = ( state : RootState ) => state.watchlist
export default watchlistSlice.reducer