import { Button, Tooltip } from 'antd';
import React from 'react';
import { ActionsContainer } from './ActionsContainer';
import { useSessionStatus } from '@/ui/component/WalletConnect/useSessionStatus';
import { Account } from '@/background/service/preference';
import { useSessionChainId } from '@/ui/component/WalletConnect/useSessionChainId';
import { Chain } from '@debank/common';
import clsx from 'clsx';

export interface Props {
  onProcess(): void;
  onCancel(): void;
  account: Account;
  disabledProcess: boolean;
  enableTooltip?: boolean;
  tooltipContent?: string;
  chain?: Chain;
}

export const ProcessActions: React.FC<Props> = ({
  onProcess,
  onCancel,
  account,
  disabledProcess,
  tooltipContent,
  enableTooltip,
  chain,
}) => {
  const status = useSessionStatus(account);
  const sessionChainId = useSessionChainId(account);

  return (
    <ActionsContainer onClickCancel={onCancel}>
      <Tooltip
        overlayClassName="rectangle sign-tx-forbidden-tooltip"
        title={enableTooltip ? tooltipContent : null}
      >
        <div>
          <Button
            disabled={
              status !== 'CONNECTED' ||
              (chain && sessionChainId !== chain.id) ||
              disabledProcess
            }
            type="ghost"
            className={clsx(
              'w-[244px] h-[48px] border-blue-light text-blue-light',
              'hover:bg-[#8697FF1A] active:bg-[#0000001A]',
              'disabled:bg-transparent disabled:opacity-40 disabled:hover:bg-transparent',
              'rounded-[8px]'
            )}
            onClick={onProcess}
          >
            Begin signing process
          </Button>
        </div>
      </Tooltip>
    </ActionsContainer>
  );
};
