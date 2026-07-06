import type { Opportunity } from "@/lib/types";

export type OpportunityStage = Opportunity["stage"];

export const workflowStages: Array<{
  key: OpportunityStage;
  label: string;
  detail: string;
  probability: number;
  nextLabel?: string;
}> = [
  { key: "lead", label: "Lead", detail: "New possible work that needs qualification.", probability: 25, nextLabel: "Start estimate" },
  { key: "estimate", label: "Estimate", detail: "Scope and price are being built.", probability: 45, nextLabel: "Send proposal" },
  { key: "proposal", label: "Proposal", detail: "Price and scope are in front of the client.", probability: 65, nextLabel: "Move to negotiation" },
  { key: "negotiation", label: "Negotiation", detail: "Client is asking questions or adjusting scope.", probability: 80, nextLabel: "Mark won" },
  { key: "won", label: "Won", detail: "Client said yes. Convert into scheduled work.", probability: 100, nextLabel: "Schedule work" },
  { key: "scheduled", label: "Scheduled", detail: "The job is booked and ready to start.", probability: 100, nextLabel: "Start work" },
  { key: "in_progress", label: "In Progress", detail: "The job is actively being completed.", probability: 100, nextLabel: "Complete job" },
  { key: "completed", label: "Completed", detail: "Work is done. Ask for review, repeat work, or referral.", probability: 100 },
  { key: "lost", label: "Lost", detail: "Closed out without winning the work.", probability: 0 }
];

export const activeWorkflowStages = workflowStages.filter((stage) => stage.key !== "lost");

export function stageInfo(stage: OpportunityStage) {
  return workflowStages.find((item) => item.key === stage) ?? workflowStages[0];
}

export function nextStage(stage: OpportunityStage): OpportunityStage | null {
  const activeIndex = activeWorkflowStages.findIndex((item) => item.key === stage);
  if (activeIndex === -1 || activeIndex === activeWorkflowStages.length - 1) return null;
  return activeWorkflowStages[activeIndex + 1].key;
}

export function stageOptions() {
  return workflowStages.map((stage) => ({ value: stage.key, label: stage.label }));
}
