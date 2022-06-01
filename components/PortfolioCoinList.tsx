import { HStack, VStack, Image, Text, Progress, Center, Actionsheet, useDisclose, AlertDialog, Button, Input, InputLeftAddon } from 'native-base'
import { Dimensions, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as React from 'react'
import { useState } from 'react'
import type { coinsData } from '../screens/MainScreen'
import { useDispatch } from 'react-redux'
import { addToPortfolio, removeFromPortfolio } from '../redux/portfolioSlicer'
import AsyncStorage from '@react-native-async-storage/async-storage'

const storeItem = async (item: {id:string, boughtPrice:number, amount:number}) => {

    try {
        const oldPortfolio : string | null = await AsyncStorage.getItem("@portfolio")
        var jsonOldPortfolio = oldPortfolio != null ? JSON.parse(oldPortfolio) : null

        if(jsonOldPortfolio == null || jsonOldPortfolio.length == 0) {
            await AsyncStorage.setItem("@portfolio", JSON.stringify([item]))
            return
        }

        var isExist = false
        for(var i = 0; i < jsonOldPortfolio.length; i++){

            if(jsonOldPortfolio[i].id == item.id) {

                const newTotal = item.boughtPrice * item.amount
                const total = jsonOldPortfolio[i].boughtPrice * jsonOldPortfolio[i].amount
                const newBoughtPrice = (newTotal+total)/(item.amount+jsonOldPortfolio[i].amount)

                jsonOldPortfolio[i].boughtPrice = newBoughtPrice
                jsonOldPortfolio[i].amount += item.amount

                isExist = true
                break
            }
        }

        !isExist && jsonOldPortfolio.push(item)

        await AsyncStorage.setItem("@portfolio", JSON.stringify(jsonOldPortfolio))
            
    } catch (e) {
        console.log(e)
    }
}

const removeItem = async (item: {id:string, boughtPrice:number, amount:number}) => {

    try {
        const oldPortfolio : string | null = await AsyncStorage.getItem("@portfolio")
        var jsonOldPortfolio : null | {id:string, boughtPrice:number, amount:number}[] = oldPortfolio != null ? JSON.parse(oldPortfolio) : null

        if(jsonOldPortfolio == null || jsonOldPortfolio.length == 0)
            return
        
        for(var i = 0; i < jsonOldPortfolio.length; i++){

            if(jsonOldPortfolio[i].id == item.id) {

                if(item.amount >= jsonOldPortfolio[i].amount) {
                    return AsyncStorage.setItem("@portfolio", JSON.stringify(jsonOldPortfolio.filter( p=>p.id!==item.id )) )
                }

                const newTotal = item.boughtPrice * item.amount
                const total = jsonOldPortfolio[i].boughtPrice * jsonOldPortfolio[i].amount
                const newBoughtPrice = (total-newTotal)/(jsonOldPortfolio[i].amount-item.amount)

                jsonOldPortfolio[i].boughtPrice = newBoughtPrice
                jsonOldPortfolio[i].amount -= item.amount

                break
            }
        }

        await AsyncStorage.setItem("@watchlist", JSON.stringify(jsonOldPortfolio))
            
    } catch (e) {
        console.log(e)
    }
}

function CoinList( { coinObject, total, qty, original } : { coinObject : coinsData, total : number, qty: number, original: number }  ) {

    const { 
        id, name, image, symbol, current_price, market_cap, price_change_24h, price_change_percentage_24h,
        high_24h, low_24h, total_volume, max_supply
    } = coinObject

    const navigation = useNavigation()

    const currentTotal = qty && original ? qty * current_price : 0
    const principalTotal = qty && original ? qty * original : 0
    const profit = parseFloat((currentTotal - principalTotal).toFixed(0))
    const { isOpen, onOpen, onClose } = useDisclose();
    const [isModalOpen, setIsModalOpen] = useState({active:false, mode:false});
    const onModalClose = () => setIsModalOpen({
        active: false,
        mode: false
    });
    const cancelRef = React.useRef(null);
    const [amount, setAmount] = useState<string>(current_price.toString());
    const [asset, setAsset] = useState<string>("1");
    const dispatch = useDispatch()

    const handleLong = ()=> {
        setIsModalOpen({
            active: true,
            mode: true
        })
        onClose()
    }

    const handleShort = ()=> {
        setIsModalOpen({
            active: true,
            mode: false
        })
        onClose()
    }

    const handleDelete = ()=> {
        dispatch(removeFromPortfolio({
            id: id.toLowerCase(),
            boughtPrice: current_price,
            amount: Infinity
        }))
        removeItem({
            id: id.toLowerCase(),
            boughtPrice: current_price,
            amount: Infinity
        })
        onClose()
    }


    const handleAmountChange = (text: string )=> {
        const myAmount = parseFloat(text)
        if(!myAmount) {
            setAmount("")
            setAsset("0")
            return
        }
        setAmount(myAmount.toString())
        setAsset( (myAmount*(1/current_price)).toString() )
    }

    const handleAssetChange = (text: string) => {

        if ( text.charAt(text.length - 1) == '.' ) {
            setAsset(text)
            return
        }

        const myAsset = parseFloat(text)

        if(!myAsset) {
            setAsset("")
            setAmount("0")
            return
        }
        setAsset(myAsset.toString())
        setAmount((myAsset*current_price).toString())
    }

    const handleConfirm = () => {

        if(isModalOpen.mode) {
            dispatch(addToPortfolio({
                id: id.toLowerCase(),
                boughtPrice: current_price,
                amount: parseFloat(asset)
            }))
            storeItem({
                id: id.toLowerCase(),
                boughtPrice: current_price,
                amount: parseFloat(asset) 
            })
        } 
        else {
            dispatch(removeFromPortfolio({
                id: id.toLowerCase(),
                boughtPrice: current_price,
                amount: parseFloat(asset)
            }))
            removeItem({
                id: id.toLowerCase(),
                boughtPrice: current_price,
                amount: parseFloat(asset) 
            })
        }

        onModalClose()
    }

    return (
    
    <Center h={20} borderBottomWidth={1} _dark={{borderColor: "dark.300"}} _light={{borderColor: "warmGray.200"}}>
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isModalOpen.active} onClose={onModalClose}>
            <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>
                <HStack space="2" alignItems="center">
                    <Image
                        source={{uri:image}}
                        alt={symbol}
                        width={7}
                        height={7}
                        rounded={50}
                    />
                    <Text>{name}</Text>
                </HStack>
                </AlertDialog.Header>
            <AlertDialog.Body>
                <Text bold>Current Price ${current_price}</Text>
                <HStack w="100%" mt={3}>
                    <InputLeftAddon>
                        <Text fontSize="xs">USD</Text>
                    </InputLeftAddon>
                    <Input value={amount} onChangeText={handleAmountChange} w={{base: '70%', md: '100%'}}/>
                </HStack>
                <HStack w="100%" mt={3}>
                    <InputLeftAddon>
                        <Text fontSize="xs">{symbol.toUpperCase()}</Text>
                    </InputLeftAddon>
                    <Input value={asset.toString()} onChangeText={handleAssetChange} w={{base: '70%', md: '100%'}}/>
                </HStack>

            </AlertDialog.Body>
            <AlertDialog.Footer>
                <Button variant="unstyled" colorScheme="coolGray" onPress={onModalClose}>
                    Cancel
                </Button>
                <Button bg="amber.600" onPress={handleConfirm}>
                    {isModalOpen.mode?"Long":"Short"}
                </Button>
            </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
        <Actionsheet isOpen={isOpen} onClose={onModalClose} hideDragIndicator>
            <Actionsheet.Content borderTopRadius="0">
            <HStack w="100%" mt={2} h={60} space={2} px={4} justifyContent="center">
                <Image
                    source={{uri:image}}
                    alt={symbol}
                    width={7}
                    height={7}
                    rounded={50}
                />
                <Text fontSize="16" color="gray.500" 
                    _dark={{color: "gray.300"}}
                >
                    {id}
                </Text>
            </HStack>
            <Actionsheet.Item onPress={()=>{
                onClose()
                navigation.navigate(
                    "Detail" as never, {
                    coinId: id, marketCap: market_cap, high: high_24h, 
                    low: low_24h, volume: total_volume, supply: max_supply, change: price_change_24h
                    } as never
                )
            }}>
                Check
            </Actionsheet.Item>
            <Actionsheet.Item onPress={handleLong}>
                Long
            </Actionsheet.Item>
            <Actionsheet.Item onPress={handleShort}>
                Short
            </Actionsheet.Item>
            <Actionsheet.Item onPress={handleDelete}>
                Delete
            </Actionsheet.Item>
            <Actionsheet.Item onPress={onClose}>Cancel</Actionsheet.Item>
            </Actionsheet.Content>
        </Actionsheet>
        <TouchableOpacity onPress={onOpen}>
        <HStack justifyContent="space-between" alignItems="center" space={1} w="full">
            <HStack pl={2} space={1} alignItems="center" width={24}>
                <Image
                    source={{uri:image}}
                    alt={symbol}
                    width={7}
                    height={7}
                    rounded={50}
                />
                <VStack>
                    <Text letterSpacing="xs" fontSize="sm" bold>{symbol.toUpperCase()}</Text>
                    <HStack alignItems="center" space={1}>
                    {
                        price_change_percentage_24h && price_change_percentage_24h< 0 ?
                        <>
                            <AntDesign name="caretdown" color="#ef4444"/>
                            <Text letterSpacing="xs" fontSize="xs" color="#ef4444">
                                {price_change_percentage_24h?.toFixed(2)}%
                            </Text>
                        </> :
                        <>
                            <AntDesign name="caretup" color="#16a34a"/>
                            <Text letterSpacing="xs" fontSize="xs" color="#16a34a">
                                {price_change_percentage_24h?.toFixed(2)}%
                            </Text>
                        </>
                    }
                    </HStack>
                </VStack>
            </HStack>
            <Progress _filledTrack={{bg: profit>=0?"green.600":"red.500"}} _dark={{bg: "dark.600"}} size="xl" flex={1} value={ Math.abs((profit/total)*100) }/>
            <VStack ml={2} w={16}>
                <Text bold fontSize="sm" letterSpacing="xs" noOfLines={1} color={profit>=0?"green.600":"red.500"}>
                    ${Math.abs(profit)}
                </Text>
                <Text
                    _dark={{color: "gray.400"}} _light={{color: "gray.600"}}
                    fontSize="2xs" letterSpacing="xs" noOfLines={1}>
                    ${principalTotal.toFixed(0)}
                </Text>
            </VStack>
        </HStack> 
        </TouchableOpacity>
    </Center>

  

    )
}



export default CoinList