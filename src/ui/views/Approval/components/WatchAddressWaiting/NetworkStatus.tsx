import React from 'react';
import { Account } from 'background/service/preference';
import { useSessionNetworkStatus } from '@/ui/component/WalletConnect/useSessionNetworkStatus';
import FastSVG from 'ui/assets/connect/fast.svg';
import LowSVG from 'ui/assets/connect/low.svg';
import LowerSVG from 'ui/assets/connect/lower.svg';

export interface Props {
  account: Account;
  className?: string;
}

export const NetworkStatus: React.FC<Props> = ({ account, className }) => {
  const networkStatus = useSessionNetworkStatus(account);

  const iconUrl = React.useMemo(() => {
    switch (networkStatus) {
      case 'FAST':
        return FastSVG;
      case 'LOW':
        return LowSVG;
      case 'LOWER':
      default:
        return LowerSVG;
    }
  }, [networkStatus]);

  return (
    <div className={className}>
      <img src={iconUrl} className="w-[20px] h-[20px]" />
    </div>
  );
};
