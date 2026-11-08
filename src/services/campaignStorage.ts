import { Campaign } from '../types';

const STORAGE_KEY_CAMPAIGNS = 'whatsapp_campaigns_store_v1';

type Listener = (campaigns: Campaign[]) => void;

class CampaignStorageManager {
  private listeners: Set<Listener> = new Set();
  private cache: Campaign[] | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): Campaign[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
      if (data) {
        this.cache = JSON.parse(data);
        return this.cache || [];
      }
    } catch (e) {
      console.warn('Failed to parse stored campaigns', e);
    }
    this.cache = [];
    return [];
  }

  private persist(campaigns: Campaign[]): void {
    this.cache = campaigns;
    try {
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
    } catch (e) {
      console.warn('Failed to save campaigns to localStorage', e);
    }
    this.notify();
  }

  private notify(): void {
    const list = this.getCampaigns();
    this.listeners.forEach(fn => fn(list));
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.getCampaigns());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCampaigns(): Campaign[] {
    if (!this.cache) {
      return this.loadFromStorage();
    }
    return [...this.cache];
  }

  public getCampaignById(id: string): Campaign | undefined {
    return this.getCampaigns().find(c => c.id === id);
  }

  public saveCampaign(campaign: Campaign): Campaign {
    const list = this.getCampaigns();
    const index = list.findIndex(c => c.id === campaign.id);
    
    if (index >= 0) {
      list[index] = { ...campaign, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(campaign);
    }

    this.persist(list);
    return campaign;
  }

  public deleteCampaign(id: string): boolean {
    const list = this.getCampaigns();
    const filtered = list.filter(c => c.id !== id);
    if (filtered.length !== list.length) {
      this.persist(filtered);
      return true;
    }
    return false;
  }
}

export const campaignStorage = new CampaignStorageManager();

