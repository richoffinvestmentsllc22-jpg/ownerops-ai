"use client";

import { OwnerAgent } from "@/components/OwnerAgent";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";

function AgentContent() {
  const { data } = useOwnerOps();

  return (
    <>
      <SectionHeader
        eyebrow="AI Agent"
        title="Get help while running the business"
        description="The agent reads the workspace you have in the app and recommends the next move. This first version works without sending private data to an external AI API."
      />
      <OwnerAgent data={data} />
    </>
  );
}

export default function AgentPage() {
  return (
    <PageFrame>
      <AgentContent />
    </PageFrame>
  );
}
