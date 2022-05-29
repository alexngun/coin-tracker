import { Image, HStack, Text, Box, useColorMode, Input, Skeleton } from 'native-base'
import React from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import coin from '../assets/mock/crypto.json'
import { useNavigation } from '@react-navigation/native'

interface Props {
    image: string | undefined,
    symbol: string | undefined,
    marketRank: number | undefined,
    loading: boolean
}

function Appbar({ image, symbol, marketRank, loading }: Props ) {

    const navigation = useNavigation()
    const { colorMode } = useColorMode()

    return (
        <HStack alignItems="center" paddingX={5} justifyContent="space-between" height="12" width="full"
            _dark = {{bg: "dark.100"}} _light = {{bg: "coolGray.200"}}
        >
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <HStack alignItems="center">
                    <Ionicons color={colorMode === "light" ? "black" : "white"} size={22} name="chevron-back-outline"/>
                </HStack>
            </TouchableOpacity>
            <HStack  space="1" alignItems="center">
                { loading ? 
                    <>
                        <Skeleton rounded="full" width={8} height={8} startColor={colorMode==="light"?"warmGray.300":"coolGray.600"}/>
                        <Skeleton rounded="xl" height={6} width={12} startColor={colorMode==="light"?"warmGray.300":"coolGray.600"}/>
                    </> :
                    <>
                        <Image 
                            source={{uri: image}}
                            alt={coin.symbol}
                            width={6}
                            height={6}
                            rounded={50}
                        />
                        <HStack alignItems='center' space={1}>
                            <Text fontSize="md" bold>{symbol ?.toUpperCase()}</Text>
                            <Text fontSize="xs" bold 
                                _light={{bg: 'warmGray.300'}}
                                _dark={{bg: 'coolGray.600'}}
                                rounded="xl" paddingX={1}
                            > 
                                #{marketRank}
                            </Text>
                        </HStack>
                    </>

                }
            </HStack>
            <AntDesign color={colorMode === "light" ? "black" : "white"}  name="staro" size={22}/>

        </HStack>
    )
}

export default Appbar