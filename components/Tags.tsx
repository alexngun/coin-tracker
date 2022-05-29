import { HStack, Badge, Text, useColorMode } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import React from 'react'

type Props = { handlePress: React.Dispatch<React.SetStateAction<'cap'|'vol'|'id'>>}

function Tags({handlePress}: Props) {

    const { colorMode } = useColorMode()

    return (
    <HStack py={2} px={2} space={2} alignItems="center">
        <Feather color={colorMode==="light"?"black":"white"} name="filter" size={16}/>
        <Text fontSize="xs">Sort by</Text>
        <TouchableOpacity onPress={()=>handlePress('id')}>
            <Badge variant="subtle" rounded="lg" alignSelf="center" _light={{bg: "coolGray.300",}} _dark={{bg: "dark.400"}}>
                <Text fontSize="xs">Default</Text>
            </Badge>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handlePress('cap')}>
            <Badge variant="subtle" rounded="lg" alignSelf="center" _light={{bg: "coolGray.300",}} _dark={{bg: "dark.400"}}>
                <Text fontSize="xs">Market Cap</Text>
            </Badge>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handlePress('vol')}>
            <Badge variant="subtle" rounded="lg" alignSelf="center" _light={{bg: "coolGray.300",}} _dark={{bg: "dark.400"}}>
                <Text fontSize="xs">Volume</Text>
            </Badge>
        </TouchableOpacity>
    </HStack>
  )
}

export default Tags