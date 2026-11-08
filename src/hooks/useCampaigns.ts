import { useState, useEffect } from 'react';
import { Campaign } from '../types';
import { campaignStorage } from '../services/campaignStorage';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => campaignStorage.getCampaigns());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = campaignStorage.subscribe(updated => {
      setCampaigns(updated);
    });
    return unsubscribe;
  }, []);

  const saveCampaign = (campaign: Campaign) => {
    return campaignStorage.saveCampaign(campaign);
  };

  const deleteCampaign = (id: string) => {
    return campaignStorage.deleteCampaign(id);
  };

  const getCampaign = (id: string) => {
    return campaignStorage.getCampaignById(id);
  };

  return {
    campaigns,
    isLoading,
    setIsLoading,
    saveCampaign,
    deleteCampaign,
    getCampaign,
  };
}

