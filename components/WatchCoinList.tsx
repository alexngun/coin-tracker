import { HStack, VStack, Image, Text, Center, Box, useColorMode } from 'native-base'
import { Dimensions, TouchableOpacity } from 'react-native'
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ChartPathProvider, ChartPath } from "@rainbow-me/animated-charts"
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import * as React from 'react'
import type { coinsData } from '../screens/MainScreen'

const { width } = Dimensions.get("window")
const THRESH_HOLD = -width * 0.2
const LIST_HEIGHT = 75

const trimArray : (arr: Array<number>)=>Array<number> = arr => arr.filter( (_, index)=>index%7===0 )

function CoinList( { coinObject, onDismiss } : { coinObject : coinsData, onDismiss?: ( task:string )=>void }  ) {

    const { 
        id, name, image, symbol, current_price, market_cap_rank, market_cap, price_change_24h,
        price_change_percentage_24h, sparkline_in_7d, high_24h, low_24h, total_volume, max_supply 
    } = coinObject

    const translateX = useSharedValue(0)
    const itemHeight = useSharedValue(LIST_HEIGHT)
    const itemOpacity = useSharedValue(1)
    const { colorMode } = useColorMode()
    const navigation = useNavigation()
    const isDown = price_change_percentage_24h < 0
    const trimmedArray = trimArray(sparkline_in_7d.price)

    const PanGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onActive: (event)=>{ translateX.value = event.translationX < 0 ? event.translationX : 0},
        onEnd: ()=>{
            const shouldBeDismissed = translateX.value < THRESH_HOLD
            if(shouldBeDismissed) {
                itemHeight.value = withTiming(0)
                itemOpacity.value = withTiming(0)
                translateX.value = withTiming(-width, undefined, (isFinished)=>{
                    if(isFinished && onDismiss) {
                        runOnJS(onDismiss)(id)
                    }
                })
                return
            } 

            translateX.value = withTiming(0)
        }
    })

    const rStyle = useAnimatedStyle(()=> ({
        transform: [{
            translateX: translateX.value
        }]
    }))

    const rRightIconStyle = useAnimatedStyle(()=> {
        const opacity = withTiming(
            translateX.value < THRESH_HOLD ? 1 : 0
        )
        return { opacity }
    })

    const rCoinContainerStyle = useAnimatedStyle(()=> {
        return {
            height: itemHeight.value,
            opacity: itemOpacity.value
        }
    })

    return (
    <Center w="full">
        <Animated.View style={[rCoinContainerStyle]}>
            <Box zIndex={2} w="full">
            <PanGestureHandler onGestureEvent={PanGesture}>
            <Animated.View style={[rStyle]}>
                <Center width="full">
                    <HStack justifyContent="space-between" alignItems="center"
                        borderBottomWidth={1} w="94%" h="full"
                        _dark={{borderColor: "dark.200", bg: "dark.50"}} _light={{borderColor: "warmGray.200", bg: "warmGray.100"}}
                    >
                        <TouchableOpacity onPress={()=>navigation.navigate(
                             "Detail" as never, {
                                coinId: id, marketCap: market_cap, high: high_24h, 
                                low: low_24h, volume: total_volume, supply: max_supply, change: price_change_24h
                                } as never
                        )}>
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
                                </HStack>     
                            </VStack>
                            <MaterialIcons color={colorMode=="light"?"#0077e6":"#addbff"} name='arrow-forward-ios'/>
                        </HStack>
                        </TouchableOpacity>

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
                            <Text fontSize="xs" bold letterSpacing="sm" noOfLines={1}>$ {current_price}</Text>
                            <HStack alignItems="center" space={1}>
                                {
                                    price_change_percentage_24h < 0 ?
                                    <>
                                        <AntDesign name="caretdown" color="#ef4444"/>
                                        <Text letterSpacing="xs" fontSize="xs" color="#ef4444">
                                            {price_change_percentage_24h.toFixed(2)}%
                                        </Text>
                                    </> :
                                    <>
                                        <AntDesign name="caretup" color="#16a34a"/>
                                        <Text letterSpacing="xs" fontSize="xs" color="#16a34a">
                                            {price_change_percentage_24h.toFixed(2)}%
                                        </Text>
                                    </>
                                }
                            </HStack>
                        </VStack>
                    </HStack>
                </Center>
            </Animated.View>
            </PanGestureHandler>
            </Box>
            <Center position="absolute" right={6} px={5} roundedRight="xl" zIndex={1} h="90%">
                <Animated.View style={[rRightIconStyle]}>
                    <Feather color="red" size={24} name='trash-2'/>
                </Animated.View>
            </Center>
        </Animated.View>
    </Center>
    )
}

export default CoinList