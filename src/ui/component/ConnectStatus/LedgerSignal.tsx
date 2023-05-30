import React from 'react';
import { Signal, Props } from '../Signal';
import { useLedgerStatusWithEvent } from './useLedgerStatusWithEvent';

export const LedgerSignal: React.FC<Omit<Props, 'color'>> = (props) => {
  const { status } = useLedgerStatusWithEvent();

  const signalColor = React.useMemo(() => {
    switch (status) {
      case undefined:
      case 'DISCONNECTED':
        return 'gray';

      default:
        return 'green';
    }
  }, [status]);

  return <Signal {...props} className="mt-[7px]" color={signalColor} />;
};
