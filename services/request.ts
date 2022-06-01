import axios from 'axios'

enum choices {
    oneD = '1D',
    oneW = '1W',
    oneM = '1M',
    halfY = '0.5Y',
    oneY = '1Y',
    twoY = '2Y',
    AllTime = 'ALL'
}

export const getTrueAllCoins = async () => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/list`
        )
        return response.data
    } catch(e) {
        console.log(e)
    }
}

export const getDetailedCoinData = async (coinId : string) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`
        )
        return response.data
    } catch(e) {
        console.log(e)
    }
}

export const getOneCoinData = async (coinId: string) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
        )
        return response.data
    } catch(e) {
        console.log(e)
    }
}

export const getMarketData = async (coinId : string, days: choices) => {
    try {
        var daysAgo : null | 'max' | number = null

        switch(days) {
            case choices.oneD:
                daysAgo = 1
                break
            case choices.oneW:
                daysAgo = 7
                break
            case choices.oneM:
                daysAgo = 31
                break
            case choices.halfY:
                daysAgo = 183
                break
            case choices.oneY:
                daysAgo = 365
                break
            case choices.twoY:
                daysAgo = 730
                break;
            case choices.AllTime:
                daysAgo = "max"
                break
            default:
                daysAgo = 1
                break
        }

        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${daysAgo}`
        )
        return response.data
    } catch(e) {
        console.log(e)
    }
}

export const getAllCoins = async (type?: 'vol' | 'cap' | 'id') => {
    try {
        var query : string = 'volume_desc'

        if(type==='vol')
            query = 'volume_desc'
        if(type==='cap')
            query = 'market_cap_desc'
        else if(type==='id')
            query = 'gecko_desc'

        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${query}&per_page=15&page=1&sparkline=true&price_change_percentage=24h`
        )
        return response.data
    } catch(e) {
        console.log(e)
    }
}