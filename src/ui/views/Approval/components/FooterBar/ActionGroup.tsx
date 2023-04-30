import { KEYRING_CLASS } from '@/constant';
import React from 'react';
import { ProcessActions } from './ProcessActions';
import { SubmitActions } from './SubmitActions';
export { Props } from './ActionsContainer';
import { Props } from './ActionsContainer';

export const ActionGroup: React.FC<Props> = (props) => {
  const { account } = props;
  return (
    <div>
      {account.type === KEYRING_CLASS.WALLETCONNECT && (
        <ProcessActions {...props} />
      )}
      {account.type === KEYRING_CLASS.PRIVATE_KEY && (
        <SubmitActions {...props} />
      )}
    </div>
  );
};
