import React from 'react';
import clsx from 'clsx';
import { WALLET_BRAND_CONTENT } from '@/constant';
import { useCommonPopupView, useWallet } from '@/ui/utils';
import { useLedgerDeviceConnected } from '@/utils/ledger';

const LegerIcon = WALLET_BRAND_CONTENT.LEDGER.icon;

export const LedgerAccount: React.FC = () => {
  const wallet = useWallet();
  const { setVisible } = useCommonPopupView();
  const hasConnectedLedgerHID = useLedgerDeviceConnected();
  const [useLedgerLive, setUseLedgerLive] = React.useState(false);

  const status = React.useMemo(() => {
    if (useLedgerLive) {
      return 'CONNECTED';
    }
    return hasConnectedLedgerHID ? 'CONNECTED' : 'DISCONNECTED';
  }, [hasConnectedLedgerHID, useLedgerLive]);

  const bgColor = React.useMemo(() => {
    switch (status) {
      case undefined:
      case 'DISCONNECTED':
        return 'bg-gray-comment';

      default:
        return 'bg-green';
    }
  }, [status]);

  React.useEffect(() => {
    wallet.isUseLedgerLive().then(setUseLedgerLive);
  }, []);

  const handleConnect = () => {
    setVisible('Ledger');
  };

  const TipContent = () => {
    switch (status) {
      case 'DISCONNECTED':
        return (
          <div className="flex justify-between w-full">
            <div className="text-red-forbidden">Ledger is not connected</div>
            <div
              onClick={handleConnect}
              className={clsx('underline cursor-pointer', 'font-normal')}
            >
              Connect
            </div>
          </div>
        );

      default:
        return <div className="text-gray-subTitle">Ledger is connected</div>;
    }
  };

  return (
    <section>
      <div className={clsx('space-x-6 flex items-start', 'relative')}>
        <div className="relative mt-[-2px]">
          <img src={LegerIcon} className="w-[24px] h-[24px]" />
          <div
            className={clsx(
              'rounded-full',
              'w-[8px] h-[8px]',
              'right-[-2px] bottom-[-2px] absolute',
              'border border-white',
              bgColor
            )}
          />
        </div>
        <div className="text-13 font-medium w-full">
          <TipContent />
        </div>
      </div>
    </section>
  );
};
