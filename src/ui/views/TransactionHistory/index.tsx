import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet } from 'ui/utils';
import { Empty } from 'ui/component';
import { TransactionGroup } from 'background/service/transactionHistory';
import './style.less';
import { Account } from '@/background/service/preference';
import { TransactionItem } from './TransactionItem';

const TransactionHistory = () => {
  const wallet = useWallet();
  const { t } = useTranslation();
  const [completeList, setCompleteList] = useState<TransactionGroup[]>([]);

  const init = async () => {
    const account = await wallet.syncGetCurrentAccount<Account>()!;
    const { completeds } = await wallet.getTransactionHistory(account.address);
    setCompleteList(completeds);
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="tx-history">
      {completeList.length > 0 && (
        <div className="tx-history__completed">
          {completeList.map((item) => (
            <TransactionItem
              item={item}
              key={`${item.chainId}-${item.nonce}`}
              canCancel={false}
            />
          ))}
        </div>
      )}
      {completeList.length <= 0 && (
        <Empty
          title={t('No signed transactions yet')}
          desc={t('All transactions signed via Rabby will be listed here.')}
          className="pt-[108px]"
        ></Empty>
      )}
    </div>
  );
};

export default TransactionHistory;
