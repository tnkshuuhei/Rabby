import { KEYRING_CLASS } from '@/constant';
import React from 'react';
import { ProcessActions } from './ProcessActions';
import { SubmitActions } from './SubmitActions';
export { Props } from './ActionsContainer';
import { Props } from './ActionsContainer';
import { useStatus } from '@/ui/component/WalletConnect/useStatus';

const WalletConnectProcessActions: React.FC<Props> = ({
  disabledProcess,
  ...props
}) => {
  const status = useStatus(props.account);

  return (
    <ProcessActions
      disabledProcess={disabledProcess || status !== 'CONNECTED'}
      {...props}
    />
  );
};

export const ActionGroup: React.FC<Props> = (props) => {
  const { account } = props;
  return (
    <div>
      {account.type === KEYRING_CLASS.WALLETCONNECT && (
        <WalletConnectProcessActions {...props} />
      )}
      {account.type === KEYRING_CLASS.HARDWARE.LEDGER && (
        <ProcessActions {...props} />
      )}
      {account.type === KEYRING_CLASS.HARDWARE.ONEKEY && (
        <ProcessActions {...props} />
      )}
      {account.type === KEYRING_CLASS.HARDWARE.TREZOR && (
        <ProcessActions {...props} />
      )}
      {account.type === KEYRING_CLASS.PRIVATE_KEY && (
        <SubmitActions {...props} />
      )}
    </div>
  );
};
