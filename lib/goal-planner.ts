import { industries } from "@/lib/industry-packs";
import type { OwnerOpsData, Task } from "@/lib/types";

function tomorrow() {
  return new Date(Date.now() + 86400000).toISOString().slice(0, 10);
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function goalSummary(data: OwnerOpsData) {
  const goal = data.profile.goal.trim();
  const activeOpportunities = data.opportunities.filter((opp) => !["completed", "lost"].includes(opp.stage));
  const pipelineValue = activeOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = activeOpportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0);
  const openTasks = data.tasks.filter((task) => task.status === "todo").length;

  return {
    goal: goal || `Set a goal for ${industries[data.profile.industry].label}.`,
    pipelineValue,
    weightedValue,
    activeOpportunities: activeOpportunities.length,
    openTasks
  };
}

export function suggestedGoalTasks(data: OwnerOpsData): Task[] {
  const goal = data.profile.goal.toLowerCase();
  const industry = data.profile.industry;
  const industryLabel = industries[industry].label;
  const baseTasks: Array<Omit<Task, "id">> = [];

  if (!data.profile.goal.trim()) {
    baseTasks.push({
      title: "Set a clear 30-day business goal",
      dueDate: tomorrow(),
      priority: "high",
      status: "todo",
      notes: "Add a specific revenue, booking, lead, or completion goal in Settings so the assistant can personalize the workflow."
    });
  }

  if (includesAny(goal, ["revenue", "$", "sales", "month", "income", "profit"])) {
    baseTasks.push({
      title: "Review pricing against the monthly revenue goal",
      dueDate: tomorrow(),
      priority: "high",
      status: "todo",
      notes: `Use Pricing and Tools to confirm the ${industryLabel} offer can realistically support the saved goal.`
    });
  }

  if (includesAny(goal, ["lead", "client", "customer", "booking", "appointment"])) {
    baseTasks.push({
      title: "Move one qualified lead into Pipeline",
      dueDate: tomorrow(),
      priority: "high",
      status: "todo",
      notes: "Use Leads to qualify the next real prospect, then start an estimate or proposal workflow."
    });
  }

  if (includesAny(goal, ["recurring", "repeat", "retention", "membership"])) {
    baseTasks.push({
      title: "Create a repeat-client follow-up offer",
      dueDate: tomorrow(),
      priority: "medium",
      status: "todo",
      notes: "Use Outreach to send a reactivation or recurring-service message to past customers."
    });
  }

  if (industry === "food_vendors") {
    baseTasks.push({
      title: "Build the next event prep checklist",
      dueDate: tomorrow(),
      priority: "high",
      status: "todo",
      notes: "Confirm menu, ingredient quantities, packaging, staffing, booth fee, deposit, and expected sell-through."
    });
  }

  if (industry === "makeup_artists") {
    baseTasks.push({
      title: "Confirm the next booking details",
      dueDate: tomorrow(),
      priority: "high",
      status: "todo",
      notes: "Confirm client look, appointment time, location, deposit, travel fee, skin prep notes, and kit needs."
    });
  }

  if (baseTasks.length === 0) {
    baseTasks.push({
      title: `Plan the next ${industryLabel} workflow move`,
      dueDate: tomorrow(),
      priority: "medium",
      status: "todo",
      notes: "Use the saved goal to choose one lead, one pipeline step, and one client follow-up for the next 24 hours."
    });
  }

  const existingTitles = new Set(data.tasks.map((task) => task.title.toLowerCase()));
  return baseTasks
    .filter((task) => !existingTitles.has(task.title.toLowerCase()))
    .slice(0, 3)
    .map((task) => ({ id: crypto.randomUUID(), ...task }));
}

export function goalRecommendationText(data: OwnerOpsData) {
  const summary = goalSummary(data);
  const industry = industries[data.profile.industry].label;
  if (!data.profile.goal.trim()) {
    return `Set a specific goal in Settings first. Once the ${industry} goal is saved, OwnerOps can recommend the next tasks and workflow moves.`;
  }
  return `Your saved goal is: "${summary.goal}". Focus on the next task that increases pipeline value, moves one active job forward, or creates a repeat-client opportunity. Current weighted pipeline: $${Math.round(summary.weightedValue).toLocaleString()}.`;
}
