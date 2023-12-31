"use client"
// REACT
import {useEffect, useState} from 'react'
// CONTEXT
import useCarMaintenanceBook from '@/hooks/useCarMaintenanceBook'
// Chackra UI
import {Box, SimpleGrid, Text, Image, Flex, Badge, Center} from '@chakra-ui/react'
//COMPONENT
import DetailView from '@/components/maintenance/DetailView/DetailView'
import { readContract  } from '@wagmi/core'
import { contractAbiCarMaintenanceLoyalty, contractAddressCarMaintenanceLoyalty } from '@/constants/index'

const ListBookCar = () => {
    /* State & Context */
    const { userAddress, tokens } = useCarMaintenanceBook()
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const [userTokens, setUserTokens] = useState([]);
    const selectedToken = tokens.find((token) => token.id === selectedTokenId);
    const [cagnotteOfTokenUser, setCagnotteOfTokenUser] =  useState('')
    const [balanceOfToken, setBalanceOfToken] =  useState('')

    const handleCardClick = (tokenId) => {
        setSelectedTokenId(tokenId);
    };

    const handleCloseDetails = () => {
        setSelectedTokenId(null);
    };

    const cagnotteOfTokenERC20 =  async () => {
        const number = await readContract({
            address: contractAddressCarMaintenanceLoyalty,
            abi: contractAbiCarMaintenanceLoyalty,
            functionName: 'totalTokens',
            args: [userAddress]
        });
        setCagnotteOfTokenUser(number.toString())
    }

    const balanceOfTokenERC20 =  async () => {
        const number = await readContract({
            address: contractAddressCarMaintenanceLoyalty,
            abi: contractAbiCarMaintenanceLoyalty,
            functionName: 'balanceOf',
            args: [userAddress]
        });
        setBalanceOfToken(number.toString())
    }

    useEffect(() => {
        cagnotteOfTokenERC20()
    }, [])

    useEffect(() => {
        const tokensUser = tokens.filter((token) => token.owner === userAddress);
        console.log(tokensUser)
        setUserTokens(tokensUser);
        cagnotteOfTokenERC20()
        balanceOfTokenERC20()
    }, [tokens, userAddress]);

    return (
        <>
            {selectedTokenId ? (
                <DetailView selectedToken={selectedToken} onClose={handleCloseDetails} />
            ) : (
                <>
                    <Flex p="1rem" width='100%' alignItems={'center'}>
                        <Box width='50%' paddingRight='2rem'>
                            <Text  as='b' >Votre cagnotte : {cagnotteOfTokenUser} ACLT</Text>
                        </Box>
                        <Box width='50%' paddingRight='2rem'>
                            <Text  as='b' >Vos tokens : {balanceOfToken} ACLT</Text>
                        </Box>
                    </Flex>
                    {(userTokens.length > 0) ? (
                        <SimpleGrid columns={2} spacing={4} margin={4}>
                            {userTokens.map((token) => (
                                <Box key={token.id} borderWidth="1px" borderRadius="lg">
                                    <Box onClick={() => handleCardClick(token.id)} cursor="pointer">
                                        <Image src={token.image} alt={`Car ${token.id}`} maxWidth="250px" loading="lazy" />
                                    </Box>
                                    <Box p="6">
                                        <Box onClick={() => handleCardClick(token.id)} cursor="pointer">
                                            <Flex align="baseline">
                                                <Badge borderRadius="full" px="2" colorScheme="teal">
                                                    {token.brand}
                                                </Badge>
                                                <Text ml={2} textTransform="uppercase" fontSize="sm" fontWeight="bold" color="teal.800">
                                                    {token.model}
                                                </Text>
                                            </Flex>
                                        </Box>
                                        <Box>
                                            <Text mt={2} color="gray.600">
                                                ID: {token.id.toString()}
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </SimpleGrid>
                    ) : (
                        <>
                            <Center>
                                <Text>Vous n'avez aucun carnet de véhicule venant de chez nous</Text>
                            </Center>
                        </>
                    )}
                </>
                
            )}
        </>
    )
}

export default ListBookCar
