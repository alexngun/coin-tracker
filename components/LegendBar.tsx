import { HStack, Box, Text } from 'native-base'

type Props = {}

function LegendBar({}: Props) {


  return (
    <HStack h={6} w="full" justifyContent="space-between">
        <Box w={32}>
            <Text fontSize="xs" bold>Cryto</Text>
        </Box>
        <Box w={90}>
            <Text fontSize="xs" bold>7-day-trend</Text>
        </Box>
        <Box w={16}>
            <Text fontSize="xs" bold>Price/24h</Text>
        </Box>
    </HStack>
  )
}

export default LegendBar