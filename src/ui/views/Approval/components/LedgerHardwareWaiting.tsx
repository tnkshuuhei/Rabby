import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { matomoRequestEvent } from '@/utils/matomo-request';
import { Account } from 'background/service/preference';
import {
  CHAINS,
  WALLETCONNECT_STATUS_MAP,
  EVENTS,
  KEYRING_CLASS,
  KEYRING_CATEGORY_MAP,
} from 'consts';
import {
  useApproval,
  openInTab,
  openInternalPageInTab,
  useWallet,
  useCommonPopupView,
} from 'ui/utils';
import eventBus from '@/eventBus';
import stats from '@/stats';
import LedgerSVG from 'ui/assets/walletlogo/ledger.svg';
import {
  ApprovalPopupContainer,
  Props as ApprovalPopupContainerProps,
} from './Popup/ApprovalPopupContainer';

interface ApprovalParams {
  address: string;
  chainId?: number;
  isGnosis?: boolean;
  data?: string[];
  account?: Account;
  $ctx?: any;
  extra?: Record<string, any>;
}

const LedgerHardwareWaiting = ({ params }: { params: ApprovalParams }) => {
  const { setTitle } = useCommonPopupView();
  const [statusProp, setStatusProp] = React.useState<
    ApprovalPopupContainerProps['status']
  >('SENDING');
  const [content, setContent] = React.useState('');
  const [description, setDescription] = React.useState('');
  const wallet = useWallet();

  const [connectStatus, setConnectStatus] = useState(
    WALLETCONNECT_STATUS_MAP.WAITING
  );
  const [getApproval, resolveApproval, rejectApproval] = useApproval();
  const chain = Object.values(CHAINS).find(
    (item) => item.id === (params.chainId || 1)
  )!;
  const { t } = useTranslation();
  const [isSignText, setIsSignText] = useState(false);
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCancel = () => {
    rejectApproval('user cancel');
  };

  const handleOK = () => {
    window.close();
  };

  const handleRetry = async () => {
    const account = await wallet.syncGetCurrentAccount()!;
    setConnectStatus(WALLETCONNECT_STATUS_MAP.WAITING);
    await wallet.requestKeyring(account?.type || '', 'resend', null);
    message.success(t('Resent'));
  };

  const handleClickResult = () => {
    const url = chain.scanLink.replace(/_s_/, result);
    openInTab(url);
  };

  const init = async () => {
    const account = params.isGnosis
      ? params.account!
      : (await wallet.syncGetCurrentAccount())!;
    const approval = await getApproval();

    const isSignText = params.isGnosis
      ? true
      : approval?.data.approvalType !== 'SignTx';
    setIsSignText(isSignText);
    if (!isSignText) {
      const signingTxId = approval.data.params.signingTxId;
      // const tx = approval.data?.params;
      if (signingTxId) {
        // const { nonce, from, chainId } = tx;
        // const explain = await wallet.getExplainCache({
        //   nonce: Number(nonce),
        //   address: from,
        //   chainId: Number(chainId),
        // });

        const signingTx = await wallet.getSigningTx(signingTxId);

        if (!signingTx?.explain) {
          setErrorMessage('Failed to get explain');
          return;
        }

        const explain = signingTx.explain;

        stats.report('signTransaction', {
          type: account.brandName,
          chainId: chain.serverId,
          category: KEYRING_CATEGORY_MAP[account.type],
          preExecSuccess: explain
            ? explain?.calcSuccess && explain?.pre_exec.success
            : true,
          createBy: params?.$ctx?.ga ? 'rabby' : 'dapp',
          source: params?.$ctx?.ga?.source || '',
          trigger: params?.$ctx?.ga?.trigger || '',
        });
      }
    } else {
      stats.report('startSignText', {
        type: account.brandName,
        category: KEYRING_CATEGORY_MAP[account.type],
        method: params?.extra?.signTextMethod,
      });
    }
    eventBus.addEventListener(EVENTS.LEDGER.REJECT_APPROVAL, (data) => {
      rejectApproval(data, false, true);
    });
    eventBus.addEventListener(EVENTS.LEDGER.REJECTED, async (data) => {
      setErrorMessage(data);
      if (/DisconnectedDeviceDuringOperation/i.test(data)) {
        await rejectApproval('User rejected the request.');
        openInternalPageInTab('request-permission?type=ledger&from=approval');
      }
      setConnectStatus(WALLETCONNECT_STATUS_MAP.FAILD);
    });
    eventBus.addEventListener(EVENTS.SIGN_FINISHED, async (data) => {
      if (data.success) {
        setConnectStatus(WALLETCONNECT_STATUS_MAP.SIBMITTED);
        setResult(data.data);
        if (params.isGnosis) {
          const sigs = await wallet.getGnosisTransactionSignatures();
          if (sigs.length > 0) {
            await wallet.gnosisAddConfirmation(account.address, data.data);
          } else {
            await wallet.gnosisAddSignature(account.address, data.data);
            await wallet.postGnosisTransaction();
          }
        }
        matomoRequestEvent({
          category: 'Transaction',
          action: 'Submit',
          label: KEYRING_CLASS.HARDWARE.LEDGER,
        });
        const hasPermission = await wallet.checkLedgerHasHIDPermission();
        const isUseLedgerLive = await wallet.isUseLedgerLive();
        if (!hasPermission && !isUseLedgerLive) {
          await wallet.authorizeLedgerHIDPermission();
        }
        resolveApproval(data.data, false, false, approval.id);
      } else {
        setConnectStatus(WALLETCONNECT_STATUS_MAP.FAILD);
      }
    });
  };

  useEffect(() => {
    setTitle('Sign with Ledger');
    init();
  }, []);

  useEffect(() => {
    switch (connectStatus) {
      case WALLETCONNECT_STATUS_MAP.WAITING:
        setStatusProp('WAITING');
        setContent('Sending signing request...');
        setDescription('');
        break;
      case WALLETCONNECT_STATUS_MAP.FAILD:
        setStatusProp('REJECTED');
        setContent('Transaction rejected');
        setDescription(errorMessage);
        break;
      case WALLETCONNECT_STATUS_MAP.SIBMITTED:
        setStatusProp('RESOLVED');
        setContent('Transaction submitted');
        setDescription('');
        break;
      default:
        break;
    }
  }, [connectStatus, errorMessage]);

  return (
    <ApprovalPopupContainer
      brandUrl={LedgerSVG}
      status={statusProp}
      onRetry={handleRetry}
      onDone={handleOK}
      onCancel={handleCancel}
      description={
        <>
          {description}
          {description.includes('EthAppPleaseEnableContractData') && (
            <a
              className="underline text-blue-light block text-center mt-8"
              href="https://support.ledger.com/hc/en-us/articles/4405481324433-Enable-blind-signing-in-the-Ethereum-ETH-app?docs=true"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  e.currentTarget.href,
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
            >
              Blind Signature Tutorial from Ledger
            </a>
          )}
        </>
      }
      content={content}
      hasMoreDescription={statusProp === 'REJECTED'}
    />
  );
};

export default LedgerHardwareWaiting;
