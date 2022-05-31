import { Box, VStack, Heading, Text  } from 'native-base'
import LegendBar from '../components/LegendBar'
import * as React from 'react'

type Props = {}

function WatchlistAppbar({}: Props) {

    const date = new Date()

    return (
        <VStack px={3} _dark={{bg: "dark.100"}} _light={{bg: "coolGray.200"}}>
            <Box width="full" height={10} flexDirection="row" alignItems="center" justifyContent="space-between">
                <Heading>Watch List</Heading>
                <Text fontSize="sm">{date.toDateString()}</Text>
            </Box>
            <LegendBar/>
        </VStack>

    )
}

export default WatchlistAppbar