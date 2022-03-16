import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react';

import HelpIcon from '@assets/icons/help-icon';
import PlusIcon from '@assets/icons/plus-icon';
import BeproLogo from '@assets/icons/bepro-logo';
import BeproLogoBlue from '@assets/icons/bepro-logo-blue';
import BeproSmallLogo from '@assets/icons/bepro-small-logo';
import ExternalLinkIcon from '@assets/icons/external-link-icon';

import Button from '@components/button';
import HelpModal from '@components/help-modal';
import Translation from '@components/translation';
import InternalLink from '@components/internal-link';
import NetworkIdentifier from '@components/network-identifier';
import WrongNetworkModal from '@components/wrong-network-modal';
import ClosedNetworkAlert from '@components/closed-network-alert';
import ConnectWalletButton from '@components/connect-wallet-button';
import BalanceAddressAvatar from '@components/balance-address-avatar';
import ReadOnlyButtonWrapper from '@components/read-only-button-wrapper';
import TransactionsStateIndicator from '@components/transactions-state-indicator';

import { useAuthentication } from '@contexts/authentication';

import { truncateAddress } from '@helpers/truncate-address';
import { formatNumberToNScale } from '@helpers/formatNumber';

import useNetwork from '@x-hooks/use-network';

import { BEPRO_NETWORK_NAME, IPFS_BASE } from 'env';

const CURRENCY = process.env.NEXT_PUBLIC_NATIVE_TOKEN_NAME;
const REQUIRED_NETWORK = process.env.NEXT_PUBLIC_NEEDS_CHAIN_NAME;

export default function MainNav() {
  const { pathname } = useRouter()

  const [showHelp, setShowHelp] = useState(false)
  
  const { wallet } = useAuthentication()
  const { network, getURLWithNetwork } = useNetwork()

  const isNetworksPage = ['/networks', '/new-network'].includes(pathname)

  return (
    <div className={`main-nav d-flex flex-column ${isNetworksPage && 'bg-shadow' || 'bg-primary'}`}>
      {network?.isClosed && <ClosedNetworkAlert />}
        
      <div className={`d-flex flex-row align-items-center justify-content-between px-3 ${wallet?.address ? 'py-0' : 'py-3'}`}>
        <div className="d-flex">
          <InternalLink href={getURLWithNetwork('/', {network: network?.name})} icon={isNetworksPage ? <BeproLogoBlue /> : (network?.name !== BEPRO_NETWORK_NAME ? <Image src={`${IPFS_BASE}/${network?.fullLogo}`} width={104} height={32} /> : <BeproLogo aria-hidden={true} />)} className="brand" nav active brand />
          {!isNetworksPage && <ul className="nav-links">
            <li>
              <InternalLink href={getURLWithNetwork('/developers')} label={<Translation label={'main-nav.developers'} />} nav uppercase />
            </li>

            <li>
              <InternalLink href={getURLWithNetwork('/council')} label={<Translation label={'main-nav.council'} />} nav uppercase />
            </li>

            <li>
              <InternalLink href={getURLWithNetwork('/oracle')} label={<Translation label={'main-nav.Oracle'} />} nav uppercase />
            </li>

            <li>
              <InternalLink href={'/networks'} label={'Networks'} nav uppercase />
            </li>
          </ul> || '' }
        </div>

        <div className="d-flex flex-row align-items-center">
          <a href="https://support.bepro.network/en/articles/5595864-using-the-testnet" className='d-flex align-items-center mr-3 text-decoration-none text-white text-uppercase main-nav-link opacity-75 opacity-100-hover' target="_blank">
            <span><Translation label={'main-nav.get-started'} /></span>
            <ExternalLinkIcon className="ml-1"/>
          </a>

          { !isNetworksPage &&
          <ReadOnlyButtonWrapper>
            <InternalLink href={getURLWithNetwork('/create-bounty')} icon={<PlusIcon />} label={<Translation label={'main-nav.create-bounty'} />} className="mr-2 read-only-button" iconBefore nav uppercase />
          </ReadOnlyButtonWrapper>
          || <InternalLink href="/new-network" icon={<PlusIcon />} label={'New Network'} className="mr-2" iconBefore nav uppercase />
          }

          <Button onClick={() => setShowHelp(true)}  className="ms-2 me-4 opacity-75 opacity-100-hover" transparent rounded><HelpIcon /></Button>

          <WrongNetworkModal requiredNetwork={REQUIRED_NETWORK} />

          <ConnectWalletButton>
            <div className="d-flex account-info align-items-center">

              <TransactionsStateIndicator />

              <NetworkIdentifier />

              <InternalLink href={getURLWithNetwork('/account')} icon={<BeproSmallLogo />} label={formatNumberToNScale(wallet?.balance?.bepro || 0)} className="mx-3" transparent nav />

              <InternalLink href={getURLWithNetwork('/account')} icon={<BalanceAddressAvatar address={truncateAddress(wallet?.address || '', 4)} balance={wallet?.balance?.eth} currency={CURRENCY} />} className="meta-info d-flex align-items-center" />
            </div>
          </ConnectWalletButton>
        </div>

        <HelpModal show={showHelp} onCloseClick={() => setShowHelp(false)} />
      </div>
  </div>
  )
}

