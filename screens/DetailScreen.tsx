import { Box, Flex, Text, HStack, Center, Skeleton, useColorMode, StatusBar, VStack, View } from 'native-base'
import React, { useEffect, useState } from 'react'
import DetailAppbar from '../components/DetailAppbar'
import { AntDesign } from '@expo/vector-icons'
import { ChartPathProvider, ChartPath, ChartDot, ChartYLabel, ChartXLabel } from "@rainbow-me/animated-charts"
import { TouchableOpacity, Dimensions } from 'react-native'
import { getDetailedCoinData, getMarketData } from '../services/request'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

const {width: SIZE} = Dimensions.get('window')
type RootStackParamList = { Home: undefined, Profile: { coinId: string,  marketCap: number, high: number, low: number, volume: number, supply: number, change: number} }
type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>

interface coinType {
    id: string,
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

enum choices {
    oneD = '1D',
    oneW = '1W',
    oneM = '1M',
    halfY = '0.5Y',
    oneY = '1Y',
    twoY = '2Y',
    AllTime = 'ALL'
}

type marketDataType = { prices: Array<Array<number>> }

function DetailScreen( {route, navigation} : Props ) {

    const { colorMode } = useColorMode()
    const [myCoin, setMyCoin] = useState<coinType | null >(null);
    const [marketData, setMarketData] = useState<marketDataType | null>(null);
    const [fetchInterval, setFetchInterval] = useState<choices>(choices.oneD);
    const [loading, setLoading] = useState<boolean>(true)

    const handleChangeInterval = (interval : choices)=>setFetchInterval(interval)
    
    const fetchCoinData = async () => {
        const fetchedCoinData = !myCoin && await getDetailedCoinData(route.params.coinId.toLowerCase())
        const fetchedMarketData = await getMarketData(route.params.coinId.toLowerCase(), fetchInterval)
        fetchedCoinData && setMyCoin(fetchedCoinData)
        setMarketData(fetchedMarketData)
        setLoading(false)
    }

    const formatUSD = (value: string) => {
        'worklet';
        if ( value === '') {
            return `USD ${myCoin ? myCoin.market_data.current_price.usd : ''}`;
        }
        var formattedValue = parseFloat(value) > 100 ? parseFloat(value).toFixed(0) : parseFloat(value).toPrecision(6) 
            
        return `USD ${formattedValue}`
    }

    const formatDate = (value: string) => {
        'worklet';
        if ( value == '') {
            return `${new Date().toDateString()}`
        }

        var selectedDate = new Date(parseInt(value))
        return selectedDate.toDateString()
    }

    const formatTime = (value: string) => {
        'worklet';
        if ( value == '') {
            return ''
        }

        var selectedDate = new Date(parseInt(value))
        const hours = `0${selectedDate.getHours()}`.slice(-2)
        const minutes = `0${selectedDate.getMinutes()}`.slice(-2)
        return `${hours}:${minutes}`
    }

    const formatNumber = (value: number, roundingPoint: number) : string =>  {

        if(value == undefined)
            return "n/a"

        if(value > 1e9)
            return `${(value/1e9).toFixed(roundingPoint)}B`
        else if(value > 1e6)
            return `${(value/1e6).toFixed(roundingPoint)}M`
        else if(value > 1e3)
            return `${(value/1e3).toFixed(roundingPoint)}K`
        else
            return value.toFixed(roundingPoint)
    } 

    const getYAxisLabelValues = () => {

        if(!marketData)
            return

        const xlabels = marketData.prices.map(xylabel=>xylabel[1])
        let minValue = Math.min(...xlabels)
        let maxValue = Math.max(...xlabels)
        let midValue = (minValue + maxValue) / 2

        let higherMidValue = (maxValue + midValue) / 2
        let lowerMidValue = (minValue + midValue) / 2

        return [
            formatNumber(maxValue, 2),
            formatNumber(higherMidValue, 2),
            formatNumber(lowerMidValue, 2),
            formatNumber(minValue, 2),
        ]

    }

    useEffect(() => {
        fetchCoinData()
    }, [fetchInterval])

    const isIntervalDown = marketData ? marketData.prices[0][1] > marketData.prices.slice(-1)[0][1] : false
    const percentageChange =  marketData && (marketData.prices.slice(-1)[0][1] - marketData.prices[0][1]) / marketData.prices[0][1]
    var str: string = "Last "

    switch(fetchInterval) {
        case choices.oneD:
            str += "24 hrs"
            break
        case choices.oneW:
            str += "7 days"
            break
        case choices.oneM:
            str += "1 month"
            break
        case choices.halfY:
            str += "6 months"
            break
        case choices.oneY:
            str += "1 year"
            break
        case choices.twoY:
            str += "2 years"
            break;
        case choices.AllTime:
            str = "All Time"
        default:
            str += ""
            break
    }

    return (
    <Box width="full" height="full" _dark={{bg: "dark.50"}}>
       <StatusBar
            barStyle={`${colorMode === "light" ? "dark-content" : "light-content"}`}
        />
        <DetailAppbar loading={loading} image={myCoin?.image.small} id={myCoin?.id}
            symbol={myCoin?.symbol} marketRank={myCoin?.market_data.market_cap_rank}
        />     
        <Center mt={3}>
            {
                loading ? 
                <VStack  w="full" px={3} my={2}>
                    <HStack justifyContent="space-between" >
                        <Skeleton.Text lines={2} style={{height: 50}} startColor={colorMode==="light"?"warmGray.300":"coolGray.600"} width={20} />
                        <Skeleton startColor={colorMode==="light"?"warmGray.300":"coolGray.600"} style={{width: 100}} rounded="xl" height={10}/>
                    </HStack>
                    <Skeleton rounded="lg" startColor={colorMode==="light"?"warmGray.300":"coolGray.600"} style={{height: 260}} width={SIZE * 0.95} />
                </VStack>
                 :
                <ChartPathProvider
                    data={{
                        points: marketData?.prices.map(price=>({x: price[0], y: price[1]})),
                        smoothingStrategy: 'bezier'
                    }}
                >
                    <HStack w="full" px={3} my={2} justifyContent="space-between" alignItems="center">
                        <Flex direction="column">
                            <Text fontSize="xs">{myCoin?.name}</Text>
                            <ChartYLabel style={{fontWeight: 'bold', fontSize: 30, color: colorMode=="light"?"black":"white"}} format={formatUSD}/>
                            <ChartXLabel style={{ color: colorMode=="light"?"black":"white" }} format={formatDate}/>
                        </Flex>
                        <VStack space="1">       
                            <HStack alignItems="center" space={1} px={2} py={1}
                                bg={isIntervalDown ? "#ef4444" : "#16a34a"}
                                rounded="lg"
                            >
                                <AntDesign name={`${isIntervalDown ? 'caretdown' : 'caretup'}`}
                                        color="#fef2f2"
                                />
                                <Text fontSize="lg" color="#fef2f2">
                                    {percentageChange && (percentageChange*100).toPrecision(3)}%
                                </Text>
                            </HStack>
                            <Text bold>{str}</Text>
                        </VStack>
                    </HStack>
                    

                    <HStack mt={2} space={5} w="full" justifyContent="space-around" _dark={{bg: "dark.100"}} py={4} >

                        <VStack width="10%" position="absolute" top={0} bottom={0} py={4} justifyContent="space-between">
                            {getYAxisLabelValues()?.map((item, index)=>{
                                return (
                                    <Text letterSpacing="xs" fontSize="xs" key={index}>{item}</Text>
                                )
                            })}
                        </VStack>

                        <Box>
                            <HStack top={3} w="100%" height={SIZE/2} position="absolute">
                                <VStack flex={1}>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1} borderLeftWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1} borderLeftWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderWidth={1} ></Box>
                                </VStack>
                                <VStack flex={1}>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1} borderBottomWidth={1}></Box>
                                </VStack>
                                <VStack flex={1}>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1} borderBottomWidth={1}></Box>
                                </VStack>
                                <VStack flex={1}>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1} borderBottomWidth={1}></Box>
                                </VStack>
                                <VStack flex={1}>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1}></Box>
                                    <Box flex={1} borderColor={colorMode=='light'?'warmGray.300':'dark.200'} borderTopWidth={1} borderRightWidth={1} borderBottomWidth={1}></Box>
                                </VStack>
                            </HStack>
                            
                            <ChartPath 
                                selectedStrokeWidth={3} 
                                strokeWidth={3} height={SIZE/2} 
                                stroke={isIntervalDown ? "#ef4444" : "#16a34a"}  
                                width={SIZE * 0.8}
                            />
                            <ChartDot style={{backgroundColor: colorMode == 'light' ? '#444444' : "#cccccc"}} size={15}>
                                <Center position="absolute" w={16} h={6} p={1} rounded="md" left={-25} top={-30} _light={{bg: "warmGray.200"}} _dark={{bg: "coolGray.600"}}>
                                    <ChartXLabel style={{fontWeight: 'bold',  color: colorMode=="light"?"black":"white" }} format={formatTime}/>
                                </Center>
                            </ChartDot>
                        </Box>

                    </HStack>


 
                    <HStack mt={2} space="5" alignItems="center">
                        <TouchableOpacity onPress={()=>handleChangeInterval(choices.oneD)}>
                            <Center rounded="md" p={1} _light={{bg: "warmGray.200"}} _dark={{bg: "dark.200"}}>
                                <Text > 1D </Text>
                            </Center>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleChangeInterval(choices.oneW)}>
                            <Center rounded="md" p={1} _light={{bg: "warmGray.200"}} _dark={{bg: "dark.200"}}>
                                <Text > 1W </Text>
                            </Center>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleChangeInterval(choices.oneM)}>
                            <Center rounded="md" p={1} _light={{bg: "warmGray.200"}} _dark={{bg: "dark.200"}}>
                                <Text > 1M </Text>
                            </Center>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleChangeInterval(choices.halfY)}>
                            <Center rounded="md" p={1} _light={{bg: "warmGray.200"}} _dark={{bg: "dark.200"}}>
                                <Text > 6M </Text>
                            </Center>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleChangeInterval(choices.oneY)}>
                            <Center rounded="md" p={1} _light={{bg: "warmGray.200"}} _dark={{bg: "dark.200"}}>
                                <Text > 1Y </Text>
                            </Center>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleChangeInterval(choices.twoY)}>
                            <Center rounded="md" p={1} _light={{bg: "warmGray.200"}} _dark={{bg: "dark.200"}}>
                                <Text > 2Y </Text>
                            </Center>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleChangeInterval(choices.AllTime)}>
                            <Center rounded="md" p={1} _light={{bg: "warmGray.200"}} _dark={{bg: "dark.200"}}>
                                <Text > ALL </Text>
                            </Center>
                        </TouchableOpacity>
                    </HStack>

                    <HStack mt={3} space={1} justifyContent="space-between" alignItems="center" w="full" px={3} py={3} _light={{bg: "dark.700"}} _dark={{bg: "dark.100"}}>
                        <VStack flex={1} space="5" borderRightWidth={2} _light={{borderColor: "warmGray.300"}} _dark={{borderColor: "dark.300"}} pr={2}>
                            <HStack justifyContent="space-between" justifyItems="center" alignItems="center">
                                <Text fontSize="xs">High</Text> 
                                <Text bold letterSpacing="xs">{route.params.high}</Text> 
                            </HStack>
                            <HStack flex={1} justifyContent="space-between" justifyItems="center">
                                <Text fontSize="xs">Cap</Text> 
                                <Text bold letterSpacing="xs">{formatNumber(route.params.marketCap, 1)}</Text> 
                            </HStack>
                        </VStack>
                        <VStack flex={1} space="5" borderRightWidth={2} _light={{borderColor: "warmGray.300"}} _dark={{borderColor: "dark.300"}} pr={2}>
                            <HStack justifyContent="space-between" justifyItems="center">
                                <Text fontSize="xs">Low</Text> 
                                <Text bold letterSpacing="xs">{route.params.low}</Text> 
                            </HStack>
                            <HStack flex={1} justifyContent="space-between" justifyItems="center">
                                <Text fontSize="xs">Supply</Text> 
                                <Text bold letterSpacing="xs">{formatNumber(route.params.supply, 1)}</Text> 
                            </HStack>
                        </VStack>
                        <VStack flex={1} space="5">
                            <HStack justifyContent="space-between" justifyItems="center">
                                <Text fontSize="xs">Change</Text> 
                                <Text bold letterSpacing="xs">{formatNumber(route.params.change, 3)}</Text> 
                            </HStack>
                            <HStack justifyContent="space-between" justifyItems="center">
                                <Text fontSize="xs">Volume</Text> 
                                <Text bold letterSpacing="xs" >{formatNumber(route.params.volume, 1)}</Text> 
                            </HStack>
                        </VStack>
                    </HStack>
                    
                </ChartPathProvider>
            }

            

        </Center>
    </Box>
    )
}

export default DetailScreen