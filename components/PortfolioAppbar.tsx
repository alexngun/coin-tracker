import { Box, VStack, Heading, Text  } from 'native-base'
import LegendBar from '../components/LegendBar'
import * as React from 'react'

type Props = {}

function PortfolioAppbar({}: Props) {

    const date = new Date()

    return (
        <VStack px={3} pb={2} _dark={{bg: "dark.100"}} _light={{bg: "coolGray.300"}}>
            <Box width="full" height={10} flexDirection="row" alignItems="center" justifyContent="space-between">
                <Heading>Portfolio</Heading>
                <Text fontSize="sm">{date.toDateString()}</Text>
            </Box>
        </VStack>

    )
}

export default PortfolioAppbar