import { TouchableOpacity } from 'react-native'
import { HStack, useColorMode } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Entypo, Feather } from '@expo/vector-icons'

type Props = {}

function Navbar({}: Props) {

    const { colorMode, toggleColorMode } = useColorMode()
    const navigation = useNavigation()

    return (
    <HStack py={4} h="8%" justifyContent="space-evenly" _light={{bg: "warmGray.50"}} _dark={{bg: "dark.200"}}>
        <TouchableOpacity onPress={()=>navigation.navigate("Home" as never)}>
            <AntDesign color={colorMode==="light"?"black":"white"} size={22} name='home'/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("Watchlist" as never)}>
            <AntDesign color={colorMode==="light"?"black":"white"} size={22} name='hearto'/>
        </TouchableOpacity>
        <TouchableOpacity>
            <AntDesign color={colorMode==="light"?"black":"white"} size={22} name='wallet'/>
        </TouchableOpacity>
        <TouchableOpacity onPressOut={toggleColorMode}>
            { colorMode == "light" ? 
                <Feather color='black' size={20} name="moon" />:
                <Entypo color='#e5e5e5' size={20} name="light-up" />
            }
        </TouchableOpacity>
    </HStack>
    )
}

export default Navbar