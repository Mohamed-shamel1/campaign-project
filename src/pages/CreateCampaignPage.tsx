import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../hooks/useCampaigns';
import { Step1Info } from '../components/campaigns/Step1Info';
import { Step2Import } from '../components/campaigns/Step2Import';
import { Step3Compose } from '../components/campaigns/Step3Compose';
import { Step4Preview } from '../components/campaigns/Step4Preview';
import { Step5Review } from '../components/campaigns/Step5Review';
import { Button } from '../components/common/Button';
import {
  NormalizedContact,
  ImportSummary,
  CampaignMedia,
  Campaign,
} from '../types';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  UploadCloud,
  MessageSquare,
  Eye,
  ShieldCheck,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'معلومات الحملة', icon: Megaphone },
  { id: 2, title: 'استيراد جهات الاتصال', icon: UploadCloud },
  { id: 3, title: 'صياغة الرسالة', icon: MessageSquare },
  { id: 4, title: 'المعاينة الحية', icon: Eye },
  { id: 5, title: 'المراجعة والتأكيد', icon: ShieldCheck },
];

export const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveCampaign } = useCampaigns();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [contacts, setContacts] = useState<NormalizedContact[]>([]);
  const [messageText, setMessageText] = useState('');
  const [media, setMedia] = useState<CampaignMedia | null>(null);

  const validContacts = contacts.filter(c => c.isValid && !c.isDuplicate);

  // Step Validation logic
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return campaignName.trim().length > 0;
      case 2:
        return contacts.length > 0 && validContacts.length > 0;
      case 3:
        return messageText.trim().length > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleImportComplete = (summary: ImportSummary, parsedContacts: NormalizedContact[]) => {
    setImportSummary(summary);
    setContacts(parsedContacts);
  };

  const handleSaveCampaign = (asStatus: 'draft' | 'ready') => {
    setIsSaving(true);

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: campaignName.trim(),
      description: description.trim() || undefined,
      status: asStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageText: messageText.trim(),
      media,
      recipients: contacts,
      importSummary: importSummary || undefined,
      stats: {
        total: validContacts.length,
        sent: 0,
        delivered: 0,
        read: 0,
        failed: 0,
      },
    };

    saveCampaign(newCampaign);
    setIsSaving(false);
    navigate(`/campaigns/${newCampaign.id}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Top Stepper */}
      <div className="bg-white p-3 sm:p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        {/* Mobile Step Info Bar */}
        <div className="sm:hidden flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
          <span className="font-bold text-brand-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-[11px]">
              {currentStep}
            </span>
            {STEPS[currentStep - 1].title}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">خطوة {currentStep} من 5</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-4 relative">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                onClick={() => {
                  // Only allow clicking already completed steps or current step
                  if (step.id < currentStep) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex flex-col items-center text-center cursor-pointer transition-all ${
                  step.id < currentStep ? 'opacity-90 hover:opacity-100' : ''
                }`}
              >
                {/* Circle Icon */}
                <div
                  className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all mb-1 sm:mb-2 shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-brand-700 text-white ring-2 sm:ring-4 ring-brand-100'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Step Title */}
                <span
                  className={`text-[9px] sm:text-xs font-semibold truncate max-w-full ${
                    isCurrent
                      ? 'text-brand-900 font-bold'
                      : isCompleted
                      ? 'text-emerald-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>

                <span className="text-[10px] text-slate-400 hidden sm:inline mt-0.5">
                  خطوة {step.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[380px] sm:min-h-[420px]">
        {currentStep === 1 && (
          <Step1Info
            name={campaignName}
            description={description}
            onChangeName={setCampaignName}
            onChangeDescription={setDescription}
          />
        )}

        {currentStep === 2 && (
          <Step2Import
            summary={importSummary}
            contacts={contacts}
            onImportComplete={handleImportComplete}
          />
        )}

        {currentStep === 3 && (
          <Step3Compose
            messageText={messageText}
            media={media}
            onChangeMessageText={setMessageText}
            onUpdateMedia={setMedia}
          />
        )}

        {currentStep === 4 && (
          <Step4Preview
            campaignName={campaignName}
            messageText={messageText}
            media={media}
            contacts={contacts}
            onGoToStep={step => setCurrentStep(step)}
          />
        )}

        {currentStep === 5 && (
          <Step5Review
            campaignName={campaignName}
            description={description}
            messageText={messageText}
            media={media}
            summary={importSummary}
            contacts={contacts}
            onConfirmAndSave={handleSaveCampaign}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Navigation Footer Controls */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              الخطوة السابقة
            </Button>
          ) : (
            <div />
          )}
        </div>

        <div className="w-full sm:w-auto">
          {currentStep < 5 && (
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={!canProceed()}
              onClick={handleNext}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold"
            >
              المتابعة للخطوة التالية
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
