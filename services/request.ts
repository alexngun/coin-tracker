import axios, { Axios, AxiosResponse } from 'axios'

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

export const getMarketData = async (coinId : string, interval: string, days: number | string ) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
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