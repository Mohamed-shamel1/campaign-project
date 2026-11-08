export type CarrierType = 'فودافون' | 'أورنج' | 'إتصالات' | 'وي' | 'دولي / أخرى';

export type ContactStatus = 'valid' | 'invalid' | 'duplicate';

export interface NormalizedContact {
  id: string;
  name: string;
  rawPhone: string;
  normalizedPhone: string;
  isValid: boolean;
  isDuplicate: boolean;
  status: ContactStatus;
  errorMessage?: string;
  carrier?: CarrierType;
  extraFields?: Record<string, string>;
}

export interface ImportSummary {
  fileName: string;
  fileSize: number;
  totalRows: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
  columns: string[];
  selectedPhoneColumn: string;
  selectedNameColumn: string;
}

export type CampaignStatus = 'draft' | 'ready' | 'scheduled' | 'completed' | 'failed';

export interface CampaignMedia {
  url: string; // Data URL or object URL
  name: string;
  size: number;
  type: string;
}

export interface CampaignStats {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  messageText: string;
  media?: CampaignMedia | null;
  recipients: NormalizedContact[];
  importSummary?: ImportSummary;
  stats: CampaignStats;
}

export interface WAPilotConfig {
  apiUrl: string;
  instanceId: string;
  isConfigured: boolean;
  isConnected: boolean;
  status: 'not_configured' | 'pending_backend' | 'connected' | 'error';
  statusMessage: string;
  lastChecked?: string;
}

export interface AppSettings {
  pharmacyName: string;
  defaultCountryCode: string;
  wapilot: WAPilotConfig;
}

