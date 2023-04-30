import { Button, Tooltip } from 'antd';
import React from 'react';
import { ActionsContainer, Props } from './ActionsContainer';
import { useStatus } from '@/ui/component/WalletConnect/useStatus';

export const ProcessActions: React.FC<Props> = ({
  onSubmit,
  onCancel,
  account,
  disabledProcess,
  tooltipContent,
  enableTooltip,
}) => {
  const status = useStatus(account);

  return (
    <ActionsContainer onCancel={onCancel}>
      <Tooltip
        overlayClassName="rectangle sign-tx-forbidden-tooltip"
        title={enableTooltip ? tooltipContent : null}
      >
        <div>
          <Button
            disabled={status !== 'CONNECTED' || disabledProcess}
            type="ghost"
            size="large"
            className="w-[244px] h-[48px] border-blue-light text-blue-light"
            onClick={onSubmit}
          >
            Begin signing process
          </Button>
        </div>
      </Tooltip>
    </ActionsContainer>
  );
};
