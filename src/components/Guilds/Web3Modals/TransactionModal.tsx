import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import PendingCircle from 'components/common/PendingCircle';
import { Modal, ModalProps } from '../common/Modal';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { Button } from '../common/Button';
import { FiX } from 'react-icons/fi';
import { Circle, Flex } from '../common/Layout';
import { getBlockchainLink } from '../../../utils';
import { getChains } from '../../../provider/connectors';
import { useWeb3React } from '@web3-react/core';

export const ModalButton = styled(Button)`
  margin: 0 0 16px 0;
  width: 90%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  :hover:enabled {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

type ContainerTextProps = {
  variant?: 'regular' | 'medium' | 'bold';
};

const variantStyles = (variant = 'regular') =>
  ({
    regular: css`
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
    `,
    medium: css`
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
    `,

    bold: css`
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
    `,
  }[variant]);

export const ContainerText = styled(Flex)<ContainerTextProps>`
  font-family: Inter;
  margin: 4px;
  font-style: normal;
  color: ${props => props.color || '#000000'};
  text-decoration: none;
  ${({ variant }) => variantStyles(variant)}
`;

ContainerText.defaultProps = {
  variant: 'primary',
};

export const Container = styled.div`
  margin: 0.5rem 0 1rem 0;
`;

export const Header = styled(Flex)`
  margin-top: 2rem;
`;

enum TransactionModalView {
  Confirm,
  Submit,
  Reject,
}

type TransactionModalProps = {
  message: string;
  transactionHash: string;
  txCancelled: boolean;
} & Pick<ModalProps, 'onCancel'>;

const TransactionModal: React.FC<TransactionModalProps> = ({
  message,
  transactionHash,
  txCancelled,
  onCancel,
}) => {
  const { chainId } = useWeb3React();
  const modalView = useMemo<TransactionModalView>(() => {
    if (txCancelled) {
      return TransactionModalView.Reject;
    } else if (transactionHash) {
      return TransactionModalView.Submit;
    } else {
      return TransactionModalView.Confirm;
    }
  }, [txCancelled, transactionHash]);

  const [header, children, footerText] = useMemo(() => {
    let header: JSX.Element, children: JSX.Element, footerText: string;

    switch (modalView) {
      case TransactionModalView.Confirm:
        header = (
          <Header>
            <PendingCircle height="86px" width="86px" color="black" />
          </Header>
        );
        children = (
          <Flex>
            <Container>
              <ContainerText variant="bold">
                Waiting For Confirmation
              </ContainerText>
              <ContainerText variant="medium">{message}</ContainerText>
            </Container>
            <ContainerText variant="medium" color="grey">
              Confirm this Transaction in your Wallet
            </ContainerText>
          </Flex>
        );
        break;
      case TransactionModalView.Submit:
        header = (
          <Header>
            <Circle>
              <AiOutlineArrowUp size={40} />
            </Circle>
          </Header>
        );

        const networkName = getChains().find(
          chain => chain.id === chainId
        ).name;
        children = (
          <Flex>
            <ContainerText variant="bold">Transaction Submitted</ContainerText>
            <Container>
              <ContainerText
                as="a"
                variant="regular"
                color="grey"
                href={getBlockchainLink(transactionHash, networkName)}
                target="_blank"
              >
                View on Block Explorer
              </ContainerText>
            </Container>
          </Flex>
        );
        footerText = 'Close';
        break;
      case TransactionModalView.Reject:
        header = (
          <Header>
            <Circle>
              <FiX size={40} />
            </Circle>
          </Header>
        );
        children = (
          <Flex>
            <ContainerText variant="bold">Transaction Rejected</ContainerText>
          </Flex>
        );
        footerText = 'Dismiss';
        break;
    }

    return [header, children, footerText];
  }, [modalView, chainId, message, transactionHash]);

  return (
    <Modal
      isOpen={!!message}
      onDismiss={onCancel}
      children={children}
      contentHeader={header}
      cross
      hideHeader
      showSecondaryHeader
      onCancel={onCancel}
      maxWidth={300}
      cancelText={footerText}
    />
  );
};

export default TransactionModal;
