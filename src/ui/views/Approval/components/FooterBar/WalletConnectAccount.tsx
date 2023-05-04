import { Account } from '@/background/service/preference';
import { KEYRINGS_LOGOS, WALLET_BRAND_CONTENT } from '@/constant';
import { SessionSignal } from '@/ui/component/WalletConnect/SessionSignal';
import { useDisplayBrandName } from '@/ui/component/WalletConnect/useDisplayBrandName';
import { useStatus } from '@/ui/component/WalletConnect/useStatus';
import { useWalletConnectIcon } from '@/ui/component/WalletConnect/useWalletConnectIcon';
import { useCommonPopupView } from '@/ui/utils';
import { Chain } from '@debank/common';
import { Button } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { CommonAccount } from './CommonAccount';

export interface Props {
  account: Account;
  chain?: Chain;
}

export const WalletConnectAccount: React.FC<Props> = ({ account, chain }) => {
  const [pendingConnect, setPendingConnect] = React.useState(false);
  const { setVisible, setAccount } = useCommonPopupView();
  const { address, brandName, type } = account;
  const brandIcon = useWalletConnectIcon({
    address,
    brandName,
    type,
  });
  const addressTypeIcon = React.useMemo(
    () =>
      brandIcon ||
      WALLET_BRAND_CONTENT?.[brandName]?.image ||
      KEYRINGS_LOGOS[type],
    [type, brandName, brandIcon]
  );
  const [displayBrandName, realBrandName] = useDisplayBrandName(
    brandName,
    address
  );
  const status = useStatus(
    {
      address,
      brandName,
    },
    pendingConnect
  );

  React.useEffect(() => {
    if (status === 'CONNECTED') {
      setPendingConnect(false);
    }
  }, [status]);

  const tipStatus = React.useMemo(() => {
    if (status === 'CHAIN_ERROR' && !chain) {
      return 'CONNECTED';
    }
    switch (status) {
      case 'ACCOUNT_ERROR':
        return 'ACCOUNT_ERROR';
      case 'CHAIN_ERROR':
        return 'CHAIN_ERROR';
      case undefined:
      case 'DISCONNECTED':
      case 'RECEIVED':
      case 'REJECTED':
      case 'BRAND_NAME_ERROR':
        return 'DISCONNECTED';

      default:
        return 'CONNECTED';
    }
  }, [status, chain]);
  const TipContent = () => {
    switch (tipStatus) {
      case 'ACCOUNT_ERROR':
        return (
          <div className="text-orange">
            <div>Connected but unable to sign.</div>
            <div>Please switch to the correct address in mobile wallet</div>
          </div>
        );
      case 'CHAIN_ERROR':
        return (
          <div className="text-orange">
            <div>Connected but unable to sign.</div>
            <div>Please switch to {chain?.name} in mobile wallet</div>
          </div>
        );
      case 'DISCONNECTED':
        return (
          <div className="text-red-forbidden">
            Not connected to {displayBrandName}
          </div>
        );

      default:
        return (
          <div className="text-gray-subTitle">
            Connected to {displayBrandName}
          </div>
        );
    }
  };

  const handleButton = () => {
    setAccount({
      address,
      brandName,
      realBrandName,
    });
    if (tipStatus === 'DISCONNECTED') {
      setVisible('WalletConnect');
      setPendingConnect(true);
    } else if (tipStatus === 'ACCOUNT_ERROR') {
      setVisible('SwitchAddress');
    } else if (tipStatus === 'CHAIN_ERROR') {
      setVisible('SwitchChain');
    }
  };

  return (
    <CommonAccount
      customSignal={
        <SessionSignal
          pendingConnect={pendingConnect}
          isBadge
          address={address}
          brandName={brandName}
        />
      }
      tip={<TipContent />}
      icon={addressTypeIcon}
      footer={
        tipStatus === 'DISCONNECTED' && (
          <Button
            onClick={handleButton}
            className="w-full h-[40px] mt-[12px]"
            type="primary"
          >
            Connect
          </Button>
        )
      }
    >
      <div
        onClick={handleButton}
        className={clsx(
          'underline cursor-pointer',
          'absolute right-[8px] top-[-1px]',
          'text-13'
        )}
      >
        {tipStatus === 'ACCOUNT_ERROR' && 'How to switch'}
        {tipStatus === 'CHAIN_ERROR' && 'How to switch'}
      </div>
    </CommonAccount>
  );
};
