import { Button, Tooltip } from 'antd';
import React from 'react';
import { ActionsContainer } from './ActionsContainer';
import { useStatus } from '@/ui/component/WalletConnect/useStatus';
import { Account } from '@/background/service/preference';

export interface Props {
  onProcess(): void;
  onCancel(): void;
  account: Account;
  disabledProcess: boolean;
  enableTooltip?: boolean;
  tooltipContent?: string;
}

export const ProcessActions: React.FC<Props> = ({
  onProcess,
  onCancel,
  account,
  disabledProcess,
  tooltipContent,
  enableTooltip,
}) => {
  const status = useStatus(account);

  return (
    <ActionsContainer onClickCancel={onCancel}>
      <Tooltip
        overlayClassName="rectangle sign-tx-forbidden-tooltip"
        title={enableTooltip ? tooltipContent : null}
      >
        <div>
          <Button
            disabled={status !== 'CONNECTED' || disabledProcess}
            type="ghost"
            size="large"
            className="w-[244px] h-[40px] border-blue-light text-blue-light"
            onClick={onProcess}
          >
            Begin signing process
          </Button>
        </div>
      </Tooltip>
    </ActionsContainer>
  );
};
