import { Box, ScrollView, VStack, HStack, Center, Skeleton, ISkeletonProps, StatusBar, useColorMode, Spinner, Text } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import WatchlistAppbar from '../components/WatchlistAppbar'
import WatchCoinList from '../components/WatchCoinList'
import { getOneCoinData } from '../services/request'
import type { coinsData } from './MainScreen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react'
import { selectWatchlist } from '../redux/watchlistSlicer'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromWatchlist } from '../redux/watchlistSlicer'

type Props = {}

const deleteItem = async (item: string) => {
    try {
        const oldWatchlist : string | null = await AsyncStorage.getItem("@watchlist")
        var jsonOldWatchlist = oldWatchlist != null ? JSON.parse(oldWatchlist) : null

        if(jsonOldWatchlist == null || jsonOldWatchlist.length == 0)
            return

        const deletedList = jsonOldWatchlist.filter( (ele:string)=>ele!=item )
        await AsyncStorage.setItem("@watchlist", JSON.stringify(deletedList))
            
    } catch (e) {
        console.log(e)
    }
}


function WatchListScreen({}: Props) {

    const watchlist = useSelector(selectWatchlist)
    const dispatch = useDispatch()
    const { colorMode } = useColorMode()
    const [loading, setLoading] = useState<boolean>(true)
    const [coinData, setCoinData] = useState<Array<coinsData> | null>(null);

    const onDismiss = useCallback(async (task: string)=>{
        await deleteItem(task)
        dispatch(removeFromWatchlist(task))
    }, [])

    const fetchCoins = async () => {
        var temp : Array<coinsData> = []

        for(var i = 0; i < watchlist.length; i++ ) {
            const result = await getOneCoinData(watchlist[i])
            temp.push({
                id: result.id,
                symbol: result.symbol,
                name: result.name,
                image: result.image.small,
                current_price: result.market_data.current_price.usd,
                market_cap: result.market_data.market_cap.usd,
                total_volume: result.market_data.total_volume.usd,
                high_24h: result.market_data.high_24h.usd,
                low_24h: result.market_data.low_24h.usd,
                market_cap_rank: result.market_cap_rank,
                price_change_percentage_24h: result.market_data.price_change_percentage_24h,
                sparkline_in_7d: result.market_data.sparkline_7d,
                max_supply: result.market_data.max_supply,
                price_change_24h: result.market_data.price_change_24h
            })
        }
        setCoinData(temp)
        setLoading(false)
    }

    useEffect(()=>{
        fetchCoins()
    }, [])

    return (
    <Box width="full" height="full"
        _dark={{bg: "dark.50"}} _light={{bg: "warmGray.100"}}
    >
        <StatusBar
            barStyle={`${colorMode === "light" ? "dark-content" : "light-content"}`}
        />
        <WatchlistAppbar/>
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
                    coinData && coinData.length>0 ? 
                        coinData.map( eachCoin => 
                            <WatchCoinList onDismiss={onDismiss} key={eachCoin.id} coinObject={eachCoin}/>
                        ) :
                        <Center mt="80%">
                            <Text bold fontSize="xl">No Items</Text>
                        </Center>
                }
            </VStack>
        </ScrollView>
    </Box>
    )
}

export default WatchListScreen