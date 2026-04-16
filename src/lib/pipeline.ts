export interface PipelineStage {
  number: number;
  label: string;
  shortLabel: string;
}

const PROSPECT_STAGES: PipelineStage[] = [
  { number: 1, label: "Opening Meeting", shortLabel: "Opening" },
  { number: 2, label: "Discovery", shortLabel: "Discovery" },
  { number: 3, label: "Strategy Session", shortLabel: "Strategy" },
  { number: 4, label: "Closing Meeting", shortLabel: "Closing" },
  { number: 5, label: "Onboarding", shortLabel: "Onboarding" },
];

const MEETING_TYPE_TO_STAGE: Record<string, number> = {
  "Opening Meeting": 1,
  "Discovery": 2,
  "Strategy Session": 3,
  "Closing Meeting": 4,
  "Onboarding": 5,
};

export function getMeetingStage(meetingType: string): { stage: PipelineStage; isProspect: true } | { stage: null; isProspect: false; meetingType: string } {
  const stageNum = MEETING_TYPE_TO_STAGE[meetingType];
  if (stageNum) {
    return { stage: PROSPECT_STAGES[stageNum - 1], isProspect: true };
  }
  return { stage: null, isProspect: false, meetingType };
}

export function getProspectStages(): PipelineStage[] {
  return PROSPECT_STAGES;
}
