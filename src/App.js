import {WagmiConfig,createClient,defaultChains,configureChains} from 'wagmi';
import { Profile } from './Profile';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { Buffer } from "buffer";

//Necessary to solve an error
Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

//setting a provider for the connectors
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: process.env.REACT_APP_API_KEY }),
  publicProvider(),
]);

//setting the connectors with an if clause depending on the client device type
const isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)
const connectors= [
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'wagmi',
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  })
];
if(isMobile==null){
  connectors.push(
    new MetaMaskConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    })
  );
};

//creating a client with wagmi framework
const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

//rendering the app
function App() {
  return (
    <WagmiConfig client={client}>
      <Profile />
    </WagmiConfig>
  )
}

export default App;