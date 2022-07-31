import styles from 'styles/Home.module.scss'
import data from '../info/data.json';
import { ethers } from 'ethers'
import ThemeToggleButton from 'components/Theme/ThemeToggleButton'
import ThemeToggleList from 'components/Theme/ThemeToggleList'
import { useState, useEffect } from 'react'
import { useNetwork, useSwitchNetwork, useAccount, useBalance } from 'wagmi'
import ConnectWallet from 'components/Connect/ConnectWallet'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit'
import { useSignMessage } from 'wagmi'
// import GreeterArtifact from '../../../artifacts/contracts/Greeter.sol/Greeter.json';
import {Greeter__factory} from '../typechain';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className={styles.header}>
      <div>
        <ThemeToggleList />
      </div>
      <div className="flex items-center">
        <ThemeToggleButton /> header <ThemeToggleList />
      </div>

      <div className="flex items-center">
        <ThemeToggleButton />
        <ThemeToggleList />
      </div>
    </header>
  )
}

function Main() {
  
  // greeter.greet
  const [greet, setgreet] = useState("Hi");
  let contract;
  async function checkIfWalletIsConnected() {
    const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum obejct: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("Signer", signer);
    
    contract = Greeter__factory.connect(data.contractAddress, signer);
    console.log(await contract.greet());
    setgreet(await contract.greet() as string);
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  console.log(data.contractAddress);
  
  
  const { address, isConnected, connector } = useAccount()
  const { chain, chains } = useNetwork()
  const { isLoading: isNetworkLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    addressOrName: address,
  })

  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()
  return (
    <main className={styles.main + ' space-y-6'}>
      <div className="text-center">
        <p className="font-medium">My DAPP</p>
      </div>

      <div>
        <h4 className="text-center text-sm font-medium">demo: ConnectWalletBtn Full</h4>
        <div className="flex w-full flex-col items-center">
          <ConnectWallet />
        </div>
      </div>

      <div>
        <h4 className="text-center text-sm font-medium">demo: useModal (rainbowkit ^0.4.3)</h4>
        <div className="flex w-full flex-col items-center">
          {openConnectModal && (
            <button
              onClick={openConnectModal}
              type="button"
              className="m-1 rounded-lg bg-orange-500 py-1 px-3 text-white transition-all duration-150 hover:scale-105"
            >
              useConnectModal
            </button>
          )}

          {openAccountModal && (
            <button
              onClick={openAccountModal}
              type="button"
              className="m-1 rounded-lg bg-orange-500 py-1 px-3 text-white transition-all duration-150 hover:scale-105"
            >
              useAccountModal
            </button>
          )}

          {openChainModal && (
            <button
              onClick={openChainModal}
              type="button"
              className="m-1 rounded-lg bg-orange-500 py-1 px-3 text-white transition-all duration-150 hover:scale-105"
            >
              useChainModal
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl rounded-xl bg-sky-500/10 p-6 text-center">
        <dl className={styles.dl}>
          <dt>Connector</dt>
          <dd>
            {connector?.name}
            {!address && (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <span onClick={openConnectModal} className="cursor-pointer hover:underline">
                    Not connected, connect wallet
                  </span>
                )}
              </ConnectButton.Custom>
            )}
          </dd>
          <dt>Connected Network</dt>
          <dd>{chain ? `${chain?.id}: ${chain?.name}` : 'n/a'}</dd>
          <dt>Switch Network</dt>
          <dd className="flex flex-wrap justify-center">
            {isConnected &&
              chains.map(x => (
                <button
                  disabled={!switchNetwork || x.id === chain?.id}
                  key={x.id}
                  onClick={() => switchNetwork?.(x.id)}
                  className={
                    (x.id === chain?.id ? 'bg-green-500' : 'bg-blue-500 hover:scale-105') +
                    ' m-1 rounded-lg py-1 px-3 text-white transition-all duration-150'
                  }
                >
                  {x.name}
                  {isNetworkLoading && pendingChainId === x.id && ' (switching)'}
                </button>
              ))}
            <ConnectWallet show="disconnected" />
          </dd>
          <dt>Account</dt>
          <dd className="break-all">{address ? `${address}` : 'n/a'}</dd>
          <dt>Balance</dt>
          <dd className="break-all">
            {isBalanceLoading ? 'loading' : balance ? `${balance?.formatted} ${balance?.symbol}` : 'n/a'}
          </dd>
          <dt>Sign Message</dt>
          <dd className="break-all">{address ? <SignMsg /> : 'n/a'} </dd>
        </dl>
      </div>
      {address && (
        <div className='flex items-center justify-center min-h-screen from-teal-100 via-teal-300 to-teal-500 bg-gradient-to-br w-screen'>
        <div className="flex flex-col items-center justify-center relative">

                <div
                    id="partnerCard"
                    className="bg-[#1c1c1c] text-gray-50 overflow-hidden rounded-md max-w-sm p-2 min-h-[500px] flex flex-col"
                >
                    <div>
                        <h3 className="text-left pl-8 pb-4 pt-2 text-xl">
                            Greeting App
                        </h3>
                    </div>

                    <div className="flex items-center justify-center bg-[#2a2a2a] min-h-[200px]">

                            
                             <img
                                    src="https://media.istockphoto.com/photos/hand-is-turning-a-dice-and-changes-the-word-meet-to-greet-picture-id1084115310?k=20&m=1084115310&s=612x612&w=0&h=TwrnLk7i0jdfixAxbJdd8_LF9ZOnkvM-1DGn-_VELHA="
                                    alt="EasyCode"
                                    className="w-100 object-cover"
                                />

                    </div>
                    <div className="grid grid-cols-4">
                        <div className="p-4 pr-0 text-lg col-span-3">
                                <h4 className="font-bold">
                                 Current Greetings:
                                </h4>

                                <p>{greet}</p>
                        </div>
                    
                    </div>

                    
                </div>

        </div>
</div>
      )
      

      }
    </main>
  )
}

function SignMsg() {
  const [msg, setMsg] = useState('Dapp Starter')
  
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: msg,
  })
  const signMsg = () => {
    if (msg) {
      signMessage()
    }
  }

  return (
    <>
      <p>
        <input value={msg} onChange={e => setMsg(e.target.value)} className="rounded-lg p-1" />
        <button
          disabled={isLoading}
          onClick={() => signMsg()}
          className="ml-1 rounded-lg bg-blue-500 py-1 px-2 text-white transition-all duration-150 hover:scale-105"
        >
          Sign
        </button>
      </p>
      <p>
        {isSuccess && <span>Signature: {data}</span>}
        {isError && <span>Error signing message</span>}
      </p>
    </>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <ThemeToggleList />
      </div>
      <div className="flex items-center">
        <ThemeToggleButton /> footer <ThemeToggleList />
      </div>

      <div className="flex items-center">
        <ThemeToggleButton />
        <ThemeToggleList />
      </div>
    </footer>
  )
}
function addressOrName(address: string, addressOrName: any) {
  throw new Error('Function not implemented.');
}

