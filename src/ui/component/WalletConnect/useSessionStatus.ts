import { EVENTS, WALLET_BRAND_TYPES } from '@/constant';
import eventBus from '@/eventBus';
import { isSameAddress, useWallet } from '@/ui/utils';
import { WALLETCONNECT_SESSION_STATUS_MAP } from '@rabby-wallet/eth-walletconnect-keyring';
import React from 'react';

type Status = keyof typeof WALLETCONNECT_SESSION_STATUS_MAP;
/**
 * WalletConnect connect status
 * if account is not provided, it will return the status no matter which account is connected
 * if account is provided, it will return the status of the provided account
 * @param account
 * @param pendingConnect - Update status only when it is CONNECTED
 */
export const useSessionStatus = (
  account?: { address: string; brandName: string },
  pendingConnect?: boolean
) => {
  const wallet = useWallet();
  const [status, setStatus] = React.useState<Status>();

  React.useEffect(() => {
    const handleSessionChange = (data: any) => {
      console.log(data);
      let updated: Status | undefined;
      if (
        !account ||
        !data.address ||
        (isSameAddress(data.address, account.address) &&
          data.brandName === account.brandName)
      ) {
        updated = data.status;
      } else if (
        data.brandName !== account.brandName &&
        data.brandName !== WALLET_BRAND_TYPES.WALLETCONNECT
      ) {
        updated = 'BRAND_NAME_ERROR';
      } else if (!isSameAddress(data.address, account.address)) {
        updated = 'ACCOUNT_ERROR';
      }

      if (pendingConnect) {
        if (updated === 'CONNECTED') {
          setStatus(updated);
        }
      } else {
        setStatus(updated);
      }
    };

    eventBus.addEventListener(
      EVENTS.WALLETCONNECT.SESSION_STATUS_CHANGED,
      handleSessionChange
    );

    return () => {
      eventBus.removeEventListener(
        EVENTS.WALLETCONNECT.SESSION_STATUS_CHANGED,
        handleSessionChange
      );
    };
  }, [account, pendingConnect]);

  React.useEffect(() => {
    if (account) {
      wallet
        .getWalletConnectSessionStatus(account.address, account.brandName)
        .then((result) => result && setStatus(result));
    }
  }, [account]);

  return status;
};
