import { configureStore } from "@reduxjs/toolkit";
import watchReducer from './watchlistSlicer'

export const store = configureStore({
    reducer: {
        watchlist: watchReducer
    }
})

export type RootState = ReturnType<typeof store.getState>