import { Image, HStack, Text, Box, useColorMode, Skeleton } from 'native-base'
import { useEffect, useState } from 'react'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { selectWatchlist, addToWatchlist, removeFromWatchlist } from '../redux/watchlistSlicer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react'

interface Props {
    image: string | undefined,
    symbol: string | undefined,
    marketRank: number | undefined,
    loading: boolean,
    id: string
}

function Appbar({ image, symbol, marketRank, loading, id }: Props ) {

    const navigation = useNavigation()
    const { colorMode } = useColorMode()
    const watchlist = useSelector(selectWatchlist)
    const [starType, setStarType] = useState<boolean>(false)
    
    const dispatch = useDispatch()

    const storeItem = async (item: string) => {
        try {
            const oldWatchlist : string | null = await AsyncStorage.getItem("@watchlist")
            var jsonOldWatchlist = oldWatchlist != null ? JSON.parse(oldWatchlist) : null

            if(jsonOldWatchlist == null || jsonOldWatchlist.length == 0) {
                await AsyncStorage.setItem("@watchlist", JSON.stringify([item]))
                return
            }

            jsonOldWatchlist.push(item)
            await AsyncStorage.setItem("@watchlist", JSON.stringify(jsonOldWatchlist))
                
        } catch (e) {
            console.log(e)
        }
    }

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

    const handleAdd = async () => {
        await storeItem(id)
        dispatch(addToWatchlist(id))
        setStarType(true)
    }

    const handleRemove = async () => {
        await deleteItem(id)
        dispatch(removeFromWatchlist(id))
        setStarType(false)
    }


    useEffect(() => {
        setStarType(watchlist.includes(id))
    }, [loading])
    
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
                            alt={symbol}
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

            {
                loading ? 
                <Skeleton rounded="full" width={8} height={8} startColor={colorMode==="light"?"warmGray.300":"coolGray.600"}/>:
                starType ?
                <TouchableOpacity onPress={handleRemove}>
                    <AntDesign color="#eab308" name="star" size={22}/>
                </TouchableOpacity>:
                <TouchableOpacity onPress={handleAdd}>
                    <AntDesign color={colorMode === "light" ? "black" : "white"}  name="staro" size={22}/>
                </TouchableOpacity>
            }
            

        </HStack>
    )
}

export default Appbar