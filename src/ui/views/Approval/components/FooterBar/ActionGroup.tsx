import { KEYRING_CLASS, WALLET_BRAND_TYPES } from '@/constant';
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

  if (account.type === KEYRING_CLASS.PRIVATE_KEY) {
    return <SubmitActions {...props} />;
  }
  if (account.type === KEYRING_CLASS.WALLETCONNECT) {
    return <WalletConnectProcessActions {...props} />;
  }

  return <ProcessActions {...props} />;
};
