import { Box, ScrollView, VStack, HStack, Center, Skeleton, ISkeletonProps, StatusBar, useColorMode, Spinner, Text } from 'native-base'
import { useEffect, useState } from 'react'
import Appbar from '../components/Appbar'
import CoinList from '../components/CoinList'
import Tags from '../components/Tags'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setWatchList } from '../redux/watchlistSlicer';

import * as React from 'react'
import { getAllCoins } from '../services/request'
import { useDispatch } from 'react-redux'

export interface coinsData {
    id: string,
    symbol: string,
    name: string,
    image: string,
    current_price: number,
    market_cap: number,
    market_cap_rank: number,
    price_change_percentage_24h: number,
    sparkline_in_7d: { price: Array<number> },
    high_24h: number,
    low_24h: number,
    total_volume: number,
    max_supply: number,
    price_change_24h: number,
}

const getItem : ()=>Promise<string[]> = async () => {
    try {
        const res = await AsyncStorage.getItem("@watchlist")
        if(res !== null) {
            return JSON.parse(res)
        }
        return []

    } catch(err) {
        console.log(err)
        return []
    }
}

function MainScreen() {

    const [coinData, setCoinData] = useState<null | Array<coinsData> >(null)
    const [loading, setLoading] = useState<boolean>(true)
    const {colorMode} = useColorMode()
    const dispatch = useDispatch()
    const [fetchMode, setFetchMode] = useState<"id"|"cap"|"vol">("id")

    const loadWatchlist = async () => {
        const res = await getItem()
        dispatch(setWatchList(res))
      }      

    const fetchCoins = async ()=> {
        const fetchedCoinData = await getAllCoins(fetchMode)
        setCoinData(fetchedCoinData)
        setLoading(false)
    }

    useEffect(()=>{
        !loading && setLoading(true)
        fetchCoins()
    }, [fetchMode])

    useEffect(() => {
        loadWatchlist()
    }, [])

    return (
    <Box width="full" height="full" _dark={{bg: 'dark.50'}}>
        <StatusBar
            barStyle={`${colorMode === "light" ? "dark-content" : "light-content"}`}
        />
        <Appbar/>
        <Tags handlePress={setFetchMode}/>
        <ScrollView>
            <VStack pb={4}>
                {
                    loading ?
                    Array.from(Array(6).keys()).map( i=> 
                        <Center key={i}>
                            <HStack width="92%" alignItems="center" justifyContent="space-between"
                                    borderBottomWidth={1} paddingY={5} 
                                    _dark={{borderColor: "coolGray.600"}} _light={{borderColor: "warmGray.200"}}
                            >
                                <HStack  space="1" alignItems="center">
                                    <Skeleton _light={{startColor: "warmGray.200"}} _dark={{startColor: "dark.100"}} rounded="full" width={10} height={10} />
                                    <Skeleton.Text _light={{startColor: "warmGray.200"} as ISkeletonProps } _dark={{startColor: "dark.100"} as ISkeletonProps } lines={2} width={20}/>
                                </HStack>
    
                                <Skeleton rounded="lg" _light={{startColor: "warmGray.200"}} _dark={{startColor: "dark.100"}} style={{width: 120}}/>
    
                                <Skeleton.Text _light={{startColor: "warmGray.200"} as ISkeletonProps } _dark={{startColor: "dark.100"} as ISkeletonProps } 
                                    lines={2} width={12}
                                />
                            </HStack>
                        </Center> 
                    ) :
                    coinData && coinData.map( eachCoin => 
                        <CoinList key={eachCoin.id} coinObject={eachCoin}/>
                    )
                }
            </VStack>
        </ScrollView>
    </Box>
    )
}

export default MainScreen