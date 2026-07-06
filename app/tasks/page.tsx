"use client";

import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import type { Task } from "@/lib/types";

function TasksContent() {
  const { data, setData } = useOwnerOps();
  return (
    <>
      <SectionHeader eyebrow="Follow-up System" title="Tasks" description="Create calls, follow-ups, estimates, admin work, and daily owner priorities." />
      <CrudManager<Task>
        rows={data.tasks}
        setRows={(tasks) => setData((current) => ({ ...current, tasks }))}
        title="Task records"
        emptyState="No tasks yet."
        emptyRow={() => ({ id: crypto.randomUUID(), title: "", dueDate: "", priority: "medium", status: "todo", notes: "" })}
        fields={[
          { key: "title", label: "Title" },
          { key: "dueDate", label: "Due Date", type: "date" },
          { key: "priority", label: "Priority", type: "select", options: ["low", "medium", "high"].map((value) => ({ label: value, value })) },
          { key: "status", label: "Status", type: "select", options: ["todo", "done"].map((value) => ({ label: value, value })) },
          { key: "notes", label: "Notes", type: "textarea" }
        ]}
      />
    </>
  );
}

export default function TasksPage() {
  return (
    <PageFrame>
      <TasksContent />
    </PageFrame>
  );
}
