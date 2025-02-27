import { useEffect, useState } from 'react';
import { useERC20Guild } from '../contracts/useContract';
import { Proposal } from '../../../types/types.guilds';
import { mapStructToProposal } from '../../../utils/guildsProposals';

export interface useProposalsReturns {
  proposals: Proposal[];
  error: null | Error;
  loading: boolean;
}

export const useProposals = (contractAddress: string): useProposalsReturns => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const contract = useERC20Guild(contractAddress);

  useEffect(() => {
    if (!contract) return;

    const getProposals = async () => {
      try {
        setLoading(true);
        const ids = await contract.getProposalsIds();
        const proposals = await Promise.all(
          ids.map(async id => {
            const data = await contract.getProposal(id);
            return mapStructToProposal(data, id);
          })
        );
        setError(null);
        setProposals(proposals);
      } catch (e) {
        setError(e);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    getProposals();
  }, [contract]);

  return {
    proposals,
    loading,
    error,
  };
};
