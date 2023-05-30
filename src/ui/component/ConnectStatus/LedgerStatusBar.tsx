import React from 'react';
import { CommonStatusBar } from './CommonStatusBar';
import { LedgerSignal } from './LedgerSignal';
import { useLedgerStatusWithEvent } from './useLedgerStatusWithEvent';

interface Props {
  className?: string;
}

export const LedgerStatusBar: React.FC<Props> = ({ className }) => {
  const { status, content, onClickConnect } = useLedgerStatusWithEvent();

  return (
    <CommonStatusBar
      Signal={<LedgerSignal size="small" />}
      className={className}
      onClickButton={onClickConnect}
      ButtonText={<>{status === 'DISCONNECTED' && 'Connect'}</>}
      Content={content}
    />
  );
};
