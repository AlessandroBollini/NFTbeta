import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { Alchemy, Network } from "alchemy-sdk";
import './App.css';

//configurations for alchemy-sdk
const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    network: Network.MATIC_MAINNET
};
const alchemy = new Alchemy(config);

export function Profile() {

    const { address, isConnected } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { disconnect } = useDisconnect();
    const [owners,setOwners]=useState([]);

    //function to be called when the connection button is pressed, input data is the connector chosen
    function connection(connector){
        connect({connector});
        fetchOwners();
    }

    //function to fetch owners data from alchemy API
    const fetchOwners=()=>{
        const contract="0xc16ed03d58Ad3D8b629D8B14eef651dAbCDA44ec";
        alchemy.nft.getOwnersForContract(contract)
        .then((res)=>{
            console.log("data fetched from alchemy");
            setOwners(res.owners);
        })
        .catch(err=>{
            console.error(err);
        });
    }
    
    //page to be rendered when the connection is established
    if (isConnected) {
        return (
            <div className='connectorsBox'>
                <div className='data'>{ensName ? `${ensName} (${address})` : address}</div>
                <div className='data'>NFT owned: {JSON.stringify(owners.includes(address.toLowerCase()))}</div>
                <button className='connectorButton' onClick={disconnect}>Disconnect</button>
            </div>
        )
    }
    //page to be rendered to choose a connector
    return (
        <div className='connectorsBox'>
            {connectors.map((connector) => (
                <><button className='connectorButton'
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connection(connector)}
                >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isLoading &&
                        connector.id === pendingConnector?.id &&
                        ' (connecting)'}
                </button><br></br></>
            ))}

            {error && <div>{error.message}</div>}
        </div>
    );
}
