import { ScrollView, Center, Divider, Text, HStack, Box, useColorMode, Skeleton, VStack, Button } from 'native-base'
import PortfolioAppbar from '../components/PortfolioAppbar'
import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { getOneCoinData } from '../services/request'
import type { coinsData } from './MainScreen'
import { useSelector } from 'react-redux'
import { selectPortfolioList } from '../redux/portfolioSlicer'
import { SimpleLineIcons } from '@expo/vector-icons'
import { VictoryPie } from 'victory-native'
import PortfolioCoinList from '../components/PortfolioCoinList'
import Animated, { FadeOut, Layout } from 'react-native-reanimated'
import { position } from 'native-base/lib/typescript/theme/styled-system'

type Props = {}

function PortfolioScreen({}: Props) {
    
    const portfolio = useSelector(selectPortfolioList)
    const { colorMode } = useColorMode()
    const [loading, setLoading] = useState<boolean>(true)
    const [coinData, setCoinData] = useState< Array<coinsData> | null>(null)
    const [refresh, setRefresh] = useState<boolean>(false);

    var balance : number = 0
    var origin : number = 0
    var absProfit: number = 0

    const fetchCoins = async () => {

        setLoading(true)
        var temp : Array<coinsData> = []

        for(var i = 0; i < portfolio.length; i++ ) {
            const result = await getOneCoinData(portfolio[i].id)
            temp.push({
                id: result.id.charAt(0).toUpperCase() + result.id.slice(1),
                symbol: result.symbol,
                name: result.name,
                image: result.image.small,
                current_price: result.market_data.current_price.usd,
                market_cap: result.market_data.market_cap.usd,
                total_volume: result.market_data.total_volume.usd,
                high_24h: result.market_data.high_24h.usd,
                low_24h: result.market_data.low_24h.usd,
                price_change_24h: result.market_data.price_change_24h,
                price_change_percentage_24h: result.market_data.price_change_percentage_24h,
            })
        }

        setCoinData(temp)
        setLoading(false)
    }

    const generateChartData = () : {x:string, y:number}[] => {
        var buffer : {x:string, y:number}[] = []

        if(!coinData)
            return []

        for(var i = 0; i < portfolio.length; i++) {      
            for(var j = 0; j < coinData.length; j++) {
                if(portfolio[i].id == coinData[j].id.toLowerCase()){
                    buffer.push({
                        x: coinData[j].symbol.toUpperCase(),
                        y: parseFloat((portfolio[i].amount*coinData[j].current_price).toFixed(2))
                    })
                    break
                }
            }
        }
        
        return buffer
    }

    const chartData = coinData ? generateChartData() : []

    useEffect(() => {
        fetchCoins()
    }, [refresh])

    if(coinData) {
        for(var i = 0; i < portfolio.length; i++ ) {
            const target = coinData.filter(c=>c.id.toLowerCase()==portfolio[i].id)[0]
            balance += (portfolio[i].amount * target.current_price)
            origin += (portfolio[i].amount * portfolio[i].boughtPrice)
            absProfit += Math.abs((portfolio[i].amount * target.current_price) - (portfolio[i].amount * portfolio[i].boughtPrice))
        }
    }

  return (
    <Box width="full" height="full"
        _dark={{bg: "dark.50"}} _light={{bg: "coolGray.100"}}
    >
        <PortfolioAppbar/>

        {
            loading ? 
            <Box h="full">
                <Center w="full" h="35%">
                    <Skeleton rounded="md" mt={5} w="93%" h="full"/>
                </Center>
                <HStack space={5} mt={5} px={3} alignItems="center" justifyContent="space-between">
                    <Skeleton rounded="md" flex={1} h={100}/>
                    <Skeleton rounded="md" flex={1} h={100}/>
                </HStack>
                <Center w="full" h="35%" mt={3}>
                    <Skeleton rounded="md" mt={5} w="93%" h="full"/>
                </Center>
                
            </Box>
 :
            portfolio.length > 0 ?
                <ScrollView w="full">
                <VStack w="full" space={5}>
                    <Center w="full" mt={5}>
                        <Box w="92%" rounded="md" _light={{bg:"white"}} _dark={{bg:"dark.200"}}>
                            <Text position="absolute" mt={2} pl={3} _dark={{color: "gray.400"}} _light={{color: "gray.600"}}>
                                Portfolio Composition
                            </Text>
                            <Center w="full" position="absolute" top={8} px={3}><Divider/></Center>
                            <Center>
                                <Center position="absolute">
                                    <Text _dark={{color: "gray.400"}} _light={{color: "gray.600"}}>Market Worth</Text>
                                    <Text bold fontSize="2xl">{parseInt(balance.toFixed(0)).toLocaleString('en-US')} </Text>
                                </Center>
                                <VictoryPie
                                    colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
                                    data={chartData}
                                    radius={120}
                                    innerRadius={80}
                                    labelRadius={130}
                                    labels={({ datum }) => `${datum.x}\n$${datum.y.toFixed(0)}`}
                                    style={{ 
                                        labels: { fill: colorMode=="light"?"#404040":"white", fontSize: 14 } 
                                    }}
                                />
                            </Center>
                        </Box>
                    </Center>
                    <Center>
                        <HStack w="92%" space={5} alignItems="center" justifyContent="space-between">
                            <Box rounded="md" _light={{bg:"white"}} _dark={{bg:"dark.200"}} p={2} flex={1}>
                                <Text _dark={{color: "gray.400"}} _light={{color: "gray.600"}}>
                                    Principle
                                </Text>
                                <Text fontSize="xl" mt={2} bold letterSpacing="sm">
                                $ {origin.toLocaleString('en-US')}
                                </Text>
                                <Divider my={2}/>
                                <HStack alignItems="center" space={1} justifyContent="space-between">
                                    <Text _dark={{color: "gray.400"}} _light={{color: "gray.600"}} letterSpacing="sm" fontSize="xs">Assets</Text>
                                    <Text bold letterSpacing="sm" fontSize="xs">{coinData!.length}</Text>
                                </HStack>
                            </Box>
                            <Box rounded="md" _light={{bg:"white"}} _dark={{bg:"dark.200"}} p={2} flex={1}>
                                <Text _dark={{color: "gray.400"}} _light={{color: "gray.600"}}>
                                    Profit
                                </Text>
                                <Text mt={2} fontSize="xl" bold letterSpacing="sm"
                                    color={ balance >= origin ? "green.600" : "red.600"}
                                >
                                $ {(balance - origin).toLocaleString("en-US")} 
                                </Text>
                                <Divider my={2}/>
                                <HStack alignItems="center" space={1} justifyContent="space-between">
                                    <Text _dark={{color: "gray.400"}} _light={{color: "gray.600"}} letterSpacing="sm" fontSize="xs">Return</Text>
                                    {
                                        balance >= origin ?
                                            <HStack alignItems="center" space={1}>
                                                <SimpleLineIcons color="green" name="arrow-up"/>
                                                <Text bold color="green.600" letterSpacing="sm" fontSize="xs"> 
                                                    { coinData && (((balance - origin)/origin)*100).toFixed(2) }%
                                                </Text>
                                            </HStack>
                                            :
                                            <HStack alignItems="center" space={1}>
                                                <SimpleLineIcons color="red" name="arrow-down"/>
                                                <Text bold color="red.600" letterSpacing="sm" fontSize="xs"> 
                                                    { coinData && (((balance - origin)/origin)*100).toFixed(2) }%
                                                </Text>
                                            </HStack>
                                    }
                                </HStack>
                            </Box>
                        </HStack>
                    </Center>
                    <Center w="full">
                        <Button w="93%" onPress={()=>setRefresh(s=>!s)} >Refresh</Button>
                    </Center>
                    <Center w="full" mb={10}>
                        <Box rounded="md" _light={{bg:"white"}} _dark={{bg:"dark.200"}} w="92%" overflow="hidden">
                            <HStack space={1} py={2} alignItems="center" justifyContent="space-between">
                                <Text letterSpacing="xs" _dark={{color: "gray.400"}} _light={{color: "gray.600"}} fontSize="sm" pl={3} w={24}>Asset</Text>
                                <Text letterSpacing="xs" _dark={{color: "gray.400"}} _light={{color: "gray.600"}} fontSize="sm" pl={1} flex={1}>Profit Composition</Text>
                                <Text letterSpacing="xs" _dark={{color: "gray.400"}} _light={{color: "gray.600"}} fontSize="sm" w={16}>Profit{"\n"}Principal</Text>
                            </HStack>

                            <Center mx={2}>
                            <Divider/>
                            </Center>

                            <VStack>
                                {portfolio && portfolio.map(
                                    (coin,i) =>
                                    <Animated.View
                                        key={coin.id}
                                        layout={Layout}
                                        exiting={FadeOut}
                                    >
                                        <PortfolioCoinList 
                                            total={absProfit} 
                                            coinObject={coinData!.filter(c=>c.id.toLowerCase()==coin.id)[0]} 
                                            original={coin.boughtPrice} 
                                            qty={coin.amount}
                                        />
                                    </Animated.View>
                                        
                                )}
                            </VStack>
                        </Box>
                    </Center>
                </VStack>
                </ScrollView> :
                <Center h="100%">
                    <Text bold fontSize="lg">Your portfolio is empty</Text>
                </Center>
        }

        
    </Box>
  )
}
  
export default PortfolioScreen