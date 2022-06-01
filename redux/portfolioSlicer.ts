import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './store'

export interface portfolioType {
    id: string,
    boughtPrice: number,
    amount: number
}

const initialState : Array<portfolioType> = []

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        setPortfolio: (state, action: PayloadAction<Array<portfolioType>>) => {
            state = action.payload
            return state
        },
        addToPortfolio: (state, action: PayloadAction<portfolioType>) => {

            var isExist = false
            for(var i = 0; i < state.length; i++){
                if(state[i].id == action.payload.id) {

                    const newTotal = action.payload.boughtPrice * action.payload.amount
                    const total = state[i].boughtPrice * state[i].amount
                    const newBoughtPrice = (newTotal+total)/(action.payload.amount+state[i].amount)

                    state[i].boughtPrice = newBoughtPrice
                    state[i].amount += action.payload.amount

                    isExist = true
                    break
                }
            }    

            !isExist && state.push(action.payload)

            return state
        },
        removeFromPortfolio: (state, action: PayloadAction<portfolioType>) => {

            for(var i = 0; i < state.length; i++){
                if(state[i].id == action.payload.id) {

                    if(action.payload.amount >= state[i].amount) {
                        return state.filter( item=>item.id!==action.payload.id )
                    }

                    const newTotal = action.payload.boughtPrice * action.payload.amount
                    const total = state[i].boughtPrice * state[i].amount
                    const newBoughtPrice = (total-newTotal)/(state[i].amount-action.payload.amount)

                    state[i].boughtPrice = newBoughtPrice
                    state[i].amount -= action.payload.amount

                    break
                }
            }

            return state

        },
    }
})

export const { setPortfolio, addToPortfolio, removeFromPortfolio } = portfolioSlice.actions
export const selectPortfolioList = ( state : RootState ) => state.portfolio
export default portfolioSlice.reducer