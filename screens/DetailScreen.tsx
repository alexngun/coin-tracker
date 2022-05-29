import { Box, Flex, Text, HStack, Center, Skeleton, useColorMode, StatusBar } from 'native-base'
import React, { useEffect, useState } from 'react'
import DetailAppbar from '../components/DetailAppbar'
import { AntDesign } from '@expo/vector-icons'
import { ChartPathProvider, ChartPath, ChartDot } from "@rainbow-me/animated-charts"
import { Dimensions } from 'react-native'
import { getDetailedCoinData, getMarketData } from '../services/request'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import coin from '../assets/mock/crypto.json'

const {width: SIZE} = Dimensions.get('window')
type RootStackParamList = { Home: undefined, Profile: { coinId: string } }
type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>

interface coinType {
    image: {
        large: string,
        small: string,
        thumb: string
    },
    name: string,
    symbol: string,
    market_data: {
        market_cap_rank: number,
        current_price: { usd: number },
        price_change_percentage_24h: number
    },
}

type marketDataType = { prices: Array<Array<number>> }

function DetailScreen( {route, navigation} : Props ) {

    const { colorMode } = useColorMode()
    const [myCoin, setMyCoin] = useState<coinType | null >(null);
    const [marketData, setMarketData] = useState<marketDataType | null>(null);
    
    const [loading, setLoading] = useState(true)
    
    const fetchCoinData = async () => {
        const fetchedCoinData = await getDetailedCoinData(route.params.coinId.toLowerCase())
        const fetchedMarketData = await getMarketData(route.params.coinId.toLowerCase(), "daily", 31)
        setMyCoin(fetchedCoinData)
        setMarketData(fetchedMarketData)
        setLoading(false)
    }

    useEffect(() => {
        fetchCoinData()
    }, [])

    const isDown = myCoin ? myCoin.market_data.price_change_percentage_24h < 0 : true

    return (
    <Box width="full" height="full" _dark={{bg: "dark.50"}}>
       <StatusBar
            barStyle={`${colorMode === "light" ? "dark-content" : "light-content"}`}
        />
        <DetailAppbar loading={loading} image={myCoin?.image.small}
            symbol={myCoin?.symbol} marketRank={myCoin?.market_data.market_cap_rank}
        />
        <Flex px={3} py={2} direction="row" alignItems="center" justifyContent="space-between">

            { loading ? 
                <>
                    <Skeleton.Text lines={2} style={{height: 50}} startColor={colorMode==="light"?"warmGray.300":"coolGray.600"} width={20} />
                    <Skeleton startColor={colorMode==="light"?"warmGray.300":"coolGray.600"} style={{width: 100}} rounded="xl" height={10}/>
                </> :
                <>
                    <Flex direction="column">
                        <Text fontSize="xs">{myCoin?.name}</Text>
                        <Text bold fontSize="3xl">USD {myCoin?.market_data.current_price.usd}</Text>
                    </Flex>
                    <HStack alignItems="center" space={1} px={2} py={1}
                        bg={isDown ? "#ef4444" : "#16a34a"}
                        rounded="lg"
                    >
                        <AntDesign name={`${isDown ? 'caretdown' : 'caretup'}`}
                                color="#fef2f2"
                        />
                        <Text fontSize="lg" color="#fef2f2">
                            {myCoin ?.market_data.price_change_percentage_24h.toFixed(2)}%
                        </Text>
                    </HStack>
                </>
            }        
        </Flex>
        <Center>
            {
                loading ? 
                <Skeleton rounded="lg" startColor={colorMode==="light"?"warmGray.300":"coolGray.600"} style={{height: 260}} width={SIZE * 0.95} /> :
                <ChartPathProvider
                    data={{
                        points: marketData?.prices.map(price=>({x: price[0], y: price[1]})),
                        smoothingStrategy: 'bezier'
                    }}
                >
                    <ChartPath 
                        selectedStrokeWidth={2} 
                        strokeWidth={2} height={SIZE/2} 
                        stroke={isDown ? "#ef4444" : "#16a34a"}  
                        width={SIZE * 0.95}
                    />
                    <ChartDot style={{backgroundColor: '#ef4444'}}/>
                </ChartPathProvider>
            }


        </Center>
    </Box>
    )
}

export default DetailScreen