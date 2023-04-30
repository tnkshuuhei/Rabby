import { Button } from 'antd';
import React from 'react';
import { Account } from '@/background/service/preference';

export interface Props {
  onSubmit(): void;
  onCancel(): void;
  account: Account;
  disabledProcess: boolean;
  enableTooltip?: boolean;
  tooltipContent?: string;
  children?: React.ReactNode;
}

export const ActionsContainer: React.FC<Pick<Props, 'onCancel'>> = ({
  children,
  onCancel,
}) => {
  return (
    <div className="flex items-center gap-[16px]">
      {children}
      <Button
        type="ghost"
        className="w-[100px] h-[48px] border-blue-light text-blue-light"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
};
