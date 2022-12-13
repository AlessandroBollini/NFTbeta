import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi';
import { Alchemy, Network } from "alchemy-sdk";
import './App.css';

const config = {
    apiKey: "l6ZPirxmkFBjmMcFPjtd2Jp8zKrhxBCD",
    network: Network.MATIC_MAINNET
};
const alchemy = new Alchemy(config);

export function Profile() {
    const { address, isConnected } = useAccount();
    const { data: ensName } = useEnsName({ address });
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { disconnect } = useDisconnect();
    const [owners,setOwners]=useState([]);

    useEffect(()=>{
        console.log("data set");
        fetchOwners();
    },[]);

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
    
    if (isConnected) {
        return (
            <div className='connectorsBox'>
                {console.log("connection button pressed")}
                <div className='data'>{ensName ? `${ensName} (${address})` : address}</div>
                <div className='data'>NFT owned: {JSON.stringify(owners.includes(address.toLowerCase()))}</div>
                <button className='connectorButton' onClick={disconnect}>Disconnect</button>
            </div>
        )
    }
    return (
        <div className='connectorsBox'>
            {connectors.map((connector) => (
                <><button className='connectorButton'
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
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
