import { HStack, VStack, Image, Text, Center, Box } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ChartPathProvider, ChartPath } from "@rainbow-me/animated-charts"

import type { coinsData } from '../screens/MainScreen'

const trimNumber : (num: number)=>string = num => {

    if( num > 1000000000000 )
        return (num/1000000000000).toFixed(2).toString() + ' T'

    if( num > 1000000000 )
        return (num/1000000000).toFixed(2).toString() + ' B'
        
    if( num > 1000000 )
        return (num/1000000).toFixed(2).toString() + ' M'

    if( num > 1000 )
        return (num/1000).toFixed(2).toString() + ' K'

    return num.toFixed(2).toString()

}

const trimArray : (arr: Array<number>)=>Array<number> = arr => arr.filter( (_, index)=>index%7===0 )

function CoinList( { coinObject } : { coinObject : coinsData}  ) {

    const { 
        id, name, image, symbol, current_price, market_cap_rank, market_cap, price_change_24h,
        price_change_percentage_24h, sparkline_in_7d, high_24h, low_24h, total_volume, max_supply 
    } = coinObject


    const trimmedMarketCap = trimNumber(market_cap)
    const navigation = useNavigation()
    const isDown = price_change_percentage_24h < 0
    const trimmedArray = trimArray(sparkline_in_7d.price)

    return (
    <TouchableOpacity onPress={()=>navigation.navigate( "Detail" as never, {
        coinId: id, marketCap: market_cap, high: high_24h, 
        low: low_24h, volume: total_volume, supply: max_supply, change: price_change_24h
        } as never)}
    >
    <Center>
        <HStack justifyContent="space-between" alignItems="center" 
            width="92%" borderBottomWidth={1} paddingY={3} 
            _dark={{borderColor: "dark.200"}} _light={{borderColor: "warmGray.200"}}
        >
            <HStack space={2} alignItems="center" width={32}>
                <Image
                    source={{uri:image}}
                    alt={symbol}
                    width={8}
                    height={8}
                    rounded={50}
                />
                <VStack>
                    <Text letterSpacing="xs" fontSize="sm" bold>{name}</Text>
                    <HStack space={1} alignItems="center">
                        <Text letterSpacing="xs" bold paddingX="1" borderRadius="2xl" 
                            _dark={{bg: "coolGray.500"}} _light={{bg: "warmGray.200"}} 
                            fontSize="2xs"
                        >
                            {market_cap_rank ? market_cap_rank : "n/a"}
                        </Text>
                        <Text letterSpacing="xs" fontSize="2xs">{symbol.toUpperCase()}</Text>
                        <HStack alignItems="center" space={1}>
                            {
                                price_change_percentage_24h < 0 ?
                                <>
                                    <AntDesign name="caretdown" color="#ef4444"/>
                                    <Text letterSpacing="xs" fontSize="2xs" color="#ef4444">
                                        {price_change_percentage_24h.toFixed(2)}%
                                    </Text>
                                </> :
                                <>
                                    <AntDesign name="caretup" color="#16a34a"/>
                                    <Text letterSpacing="xs" fontSize="2xs" color="#16a34a">
                                        {price_change_percentage_24h.toFixed(2)}%
                                    </Text>
                                </>
                            }
                        </HStack>
                    </HStack>     
                </VStack>
            </HStack>

            <ChartPathProvider
                data={{
                    points: trimmedArray.map((price, index)=>({x: index, y: price})),
                    smoothingStrategy: 'bezier'
                }}
            >
                <ChartPath
                    gestureEnabled={false}
                    selectedStrokeWidth={2} 
                    strokeWidth={2} height={30} 
                    stroke={isDown ? "#ef4444" : "#16a34a"}  
                    width={90}
                />
            </ChartPathProvider>

            <VStack width={16}>
                <Text fontSize="xs" bold letterSpacing="sm" noOfLines={1}>{current_price}</Text>
                <Text letterSpacing="xs" fontSize="2xs">{trimmedMarketCap}</Text>
            </VStack>
        </HStack>
    </Center>
    </TouchableOpacity>
    )
}

export default CoinList