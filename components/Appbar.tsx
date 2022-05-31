import { HStack, Box, useColorMode, Input, VStack, Heading, Text  } from 'native-base'
import * as React from 'react'
import { FontAwesome } from '@expo/vector-icons'

type Props = {}

function Appbar({}: Props) {

    const { colorMode } = useColorMode()
    const date = new Date()

    return (
        <VStack px={3} pb={3} _dark={{bg: "dark.100"}} _light={{bg: "coolGray.200"}}>
            <Box width="full" height={10} flexDirection="row" alignItems="center" justifyContent="space-between">
                <Heading>Crypto Assets </Heading>
                <Text fontSize="sm">{date.toDateString()}</Text>
            </Box>
            <HStack alignItems="center" space={1} rounded="lg" h={8} _dark={{bg: 'coolGray.600'}} _light={{bg: 'warmGray.100'}} px={2}>
                <FontAwesome color={colorMode == "light" ? 'black' : '#e5e5e5'} name="search" size={18}/>
                <Input width="full" placeholderTextColor={colorMode == "light" ? 'black' : '#e5e5e5'} 
                    variant="unstyled" placeholder='Search'
                />
            </HStack>
        </VStack>

    )
}

export default Appbar