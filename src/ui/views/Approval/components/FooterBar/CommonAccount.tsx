import React from 'react';
import clsx from 'clsx';

export interface Props {
  icon: string;
  signal?: 'CONNECTED' | 'DISCONNECTED';
  customSignal?: React.ReactNode;
  tip?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export const CommonAccount: React.FC<Props> = ({
  icon,
  tip,
  signal,
  customSignal,
  children,
  footer,
}) => {
  const bgColor = React.useMemo(() => {
    switch (signal) {
      case 'CONNECTED':
        return 'bg-green';

      case 'DISCONNECTED':
        return 'bg-gray-comment';

      default:
        return;
    }
  }, [signal]);

  return (
    <section>
      <div className={clsx('space-x-6 flex items-start', 'relative')}>
        <div className="relative mt-[-2px]">
          <img src={icon} className="w-[24px] h-[24px]" />
          {customSignal}
          {signal && (
            <div
              className={clsx(
                'rounded-full',
                'w-[8px] h-[8px]',
                'right-[-2px] bottom-[-2px] absolute',
                'border border-white',
                bgColor
              )}
            />
          )}
        </div>
        <div className="text-13 font-medium w-full">{tip}</div>
        {children}
      </div>
      {footer}
    </section>
  );
};
