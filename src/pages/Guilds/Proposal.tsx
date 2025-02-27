import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import styled from 'styled-components';
import useEtherSWR from 'ether-swr';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import { IconButton } from '../../components/Guilds/common/Button';
import { Box } from '../../components/Guilds/common/Layout';
import ProposalInfoCard from '../../components/Guilds/ProposalPage/ProposalInfoCard';
import ProposalVoteCard from '../../components/Guilds/ProposalPage/ProposalVoteCard';
import ProposalStatus from '../../components/Guilds/ProposalStatus';
import ProposalActionsCard from '../../components/Guilds/ProposalPage/ProposalActionsCard';
import UnstyledLink from '../../components/Guilds/common/UnstyledLink';
import AddressButton from '../../components/Guilds/AddressButton';
import ProposalDescription from '../../components/Guilds/ProposalPage/ProposalDescription';

const PageContainer = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;

  @media only screen and (min-width: 768px) {
    grid-template-columns: minmax(0, 1fr) 300px;
  }
`;

const SidebarContent = styled(Box)`
  @media only screen and (min-width: 768px) {
    margin-left: 1rem;
  }
`;

const PageContent = styled(Box)`
  @media only screen and (min-width: 768px) {
    margin-right: 1rem;
  }
`;

const PageHeader = styled(Box)`
  margin-bottom: 1rem;
`;

const PageTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;

  @media only screen and (min-width: 768px) {
    font-size: 1.4rem;
    font-weight: 700;
  }

  margin: 0;
  margin: 1rem 0;
`;

const StyledIconButton = styled(IconButton)`
  padding: 0;
  margin-top: 5px;
`;

const ProposalActionsWrapper = styled(Box)`
  margin-top: 2rem;
`;
const ProposalStatusWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderTopRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProposalPage: React.FC = () => {
  const {
    chain_name: chainName,
    guild_id: guildId,
    proposal_id: proposalId,
  } = useParams<{
    chain_name: string;
    guild_id?: string;
    proposal_id?: string;
  }>();

  const { data: proposal, error } = useEtherSWR([
    guildId,
    'getProposal',
    proposalId,
  ]);

  if (error) {
    return (
      <div>
        We ran into some issues trying to load this proposal. Please try again
        later.
      </div>
    );
  }

  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <HeaderTopRow>
            <UnstyledLink to={`/${chainName}/${guildId}`}>
              <StyledIconButton variant="minimal" iconLeft>
                <FiArrowLeft /> DXdao
              </StyledIconButton>
            </UnstyledLink>

            <ProposalStatusWrapper>
              <ProposalStatus proposalId={proposalId} bordered hideTime />
            </ProposalStatusWrapper>
          </HeaderTopRow>
          <PageTitle>{proposal?.title || <Skeleton />}</PageTitle>
        </PageHeader>

        <AddressButton address={proposal?.creator} />

        <ProposalDescription />

        <ProposalActionsWrapper>
          <ProposalActionsCard />
        </ProposalActionsWrapper>
      </PageContent>
      <SidebarContent>
        <ProposalInfoCard />
        <ProposalVoteCard />
      </SidebarContent>
    </PageContainer>
  );
};

export default ProposalPage;
