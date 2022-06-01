import { HStack, Box, useColorMode, Input, VStack, Heading, Text, Menu  } from 'native-base'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { getTrueAllCoins } from '../services/request'
import { useNavigation } from '@react-navigation/native'

type Props = {}

function Appbar({}: Props) {

    const { colorMode } = useColorMode()
    const [onSearch, setOnSearch] = useState<boolean>(false);
    const inputRef = React.useRef()
    const [searchList, setSearchList] = useState<Array<{id:string, symbol:string, name:string}>>([]);
    const [showList, setShowList] = useState<Array<{id:string, symbol:string, name:string}>>([]);
    const navigation = useNavigation()
    
    const date = new Date()

    const fetchAllCoins = async () => {
        const fetchedAllCoins : Array<{id:string, symbol:string, name:string}> = await getTrueAllCoins()
        fetchedAllCoins.sort((x,y)=>x.name.length-y.name.length)
        setSearchList(fetchedAllCoins)
    }

    const handleSearching = (text: string) => {
        if(text!="") {
            setOnSearch(true)
            const tempList = searchList.filter(item=>{
                return item.name.toLowerCase().includes(text.toLowerCase()) || 
                       item.symbol.toLowerCase().includes(text.toLowerCase()) ||
                       item.id.toLowerCase().includes(text.toLowerCase())
            })
            setShowList(tempList.slice(0,8))
        }
            
        if(text=="")
            setOnSearch(false)
    }


    useEffect(()=>{
        fetchAllCoins()
    },[])

    return (
        <VStack px={3} pb={3} _dark={{bg: "dark.100"}} _light={{bg: "coolGray.300"}}>
            <Box width="full" height={10} flexDirection="row" alignItems="center" justifyContent="space-between">
                <Heading>Crypto Assets</Heading>
                <Text fontSize="sm">{date.toDateString()}</Text>
            </Box>
            <HStack alignItems="center" space={1} rounded="lg" h={8} _dark={{bg: 'coolGray.600'}} _light={{bg: 'warmGray.100'}} px={2}>
                <FontAwesome color={colorMode == "light" ? 'black' : '#e5e5e5'} name="search" size={18}/>
                <Input ref={inputRef} flex={1} placeholderTextColor={colorMode == "light" ? 'black' : '#e5e5e5'} 
                    variant="unstyled" placeholder='Search' onChangeText={handleSearching}
                />
            </HStack>
            {
                onSearch && 
                <Menu.Group title='Search result' >
                    {showList.map(item=>
                        <Menu.Item onPress={()=>navigation.navigate("Detail" as never, {
                            coinId: item.id
                            } as never)} key={item.id}
                        >
                            {item.name}
                        </Menu.Item>
                    )}
                </Menu.Group>
            }


        </VStack>

    )
}

export default Appbar