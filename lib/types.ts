export type Business = {
  id: string
  user_id: string
  name: string
  industry: string
  city: string | null
  phone: string | null
  email: string | null
  website: string | null
  created_at: string
}

export type Lead = {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  source: string | null
  status: string
  estimated_value: number | null
  notes: string | null
  created_at: string
}

export type Customer = {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  lifetime_value: number | null
  notes: string | null
  created_at: string
}

export type Opportunity = {
  id: string
  user_id: string
  lead_id: string | null
  title: string
  stage: string
  value: number | null
  expected_close: string | null
  notes: string | null
  created_at: string
}

export type Task = {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  status: string
  priority: string
  related_type: string | null
  related_label: string | null
  created_at: string
}

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const
export const TASK_STATUSES = ["pending", "in_progress", "done"] as const
export const TASK_PRIORITIES = ["low", "medium", "high"] as const
