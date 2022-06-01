import { configureStore } from "@reduxjs/toolkit";
import watchReducer from './watchlistSlicer'
import portfolioReducer from "./portfolioSlicer";

export const store = configureStore({
    reducer: {
        watchlist: watchReducer,
        portfolio: portfolioReducer
    }
})

export type RootState = ReturnType<typeof store.getState>