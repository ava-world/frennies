import React from 'react';
import { Button, View, Text, StyleSheet, TextInput, Alert } from 'react';
import { useWeb3 } from './providers';
import { getContract, mintFriendshipNFT } from './contract';

const App = () => {
  const { connectWallet, address, signer } = useWeb3();
  const [friendAddress, setFriendAddress] = React.useState('');
  const [tokenURI, setTokenURI] = React.useState('');

  const handleMintNFT = async () => {
    if (!signer) {
      Alert.alert('Wallet not connected', 'Please connect your wallet first.');
      return;
    }

    if (!friendAddress || !tokenURI) {
      Alert.alert('Missing Information', 'Enter both friend address and token URI.');
      return;
    }

    try {
      const contract = getContract(signer);
      await mintFriendshipNFT(contract, friendAddress, tokenURI);
      Alert.alert('Success', 'Friendship NFT minted successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to mint NFT: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friendship Lock DApp</Text>

      <Button title="Connect Wallet" onPress={connectWallet} />
      {address ? <Text>Connected: {address}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Friend's Address"
        value={friendAddress}
        onChangeText={setFriendAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Token URI (IPFS link)"
        value={tokenURI}
        onChangeText={setTokenURI}
      />

      <Button title="Mint Friendship NFT" onPress={handleMintNFT} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default App;
