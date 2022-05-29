import { HStack, Pressable, Box, useColorMode, Input, VStack, Heading, Text  } from 'native-base'
import React from 'react'
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = {}

function Appbar({}: Props) {

    const { colorMode ,toggleColorMode } = useColorMode()
    const date = new Date()

    return (
        <VStack px={3} _dark={{bg: "dark.100"}} _light={{bg: "coolGray.200"}}>
            <Box width="full" height={10} flexDirection="row" alignItems="center" justifyContent="space-between">
                <Heading>Crypto Assets </Heading>
                <Text fontSize="sm">{date.toDateString()}</Text>
            </Box>
            <HStack alignItems="center"justifyContent="space-between" height="12" width="full">
                <HStack alignItems="center" style={{width: 330}} space={1} rounded="lg" h={8} _dark={{bg: 'coolGray.600'}} _light={{bg: 'warmGray.100'}} px={2}>
                    <FontAwesome color={colorMode == "light" ? 'black' : '#e5e5e5'} name="search" size={18}/>
                    <Input width={64} placeholderTextColor={colorMode == "light" ? 'black' : '#e5e5e5'} 
                        variant="unstyled" placeholder='Search'
                    />
                </HStack>
                
                <TouchableOpacity onPressOut={toggleColorMode}>
                    { colorMode == "light" ? 
                        <Feather color='black' size={20} name="moon" />:
                        <Entypo color='#e5e5e5' size={20} name="light-up" />
                    }
                </TouchableOpacity>
            </HStack>
        </VStack>

    )
}

export default Appbar