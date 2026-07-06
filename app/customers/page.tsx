"use client";

import { CrudManager } from "@/components/CrudManager";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { useOwnerOps } from "@/components/DataProvider";
import type { Customer } from "@/lib/types";

function CustomersContent() {
  const { data, setData } = useOwnerOps();
  return (
    <>
      <SectionHeader eyebrow="Customer File" title="Customers" description="Keep contact details, job context, and relationship notes in one place." />
      <CrudManager<Customer>
        rows={data.customers}
        setRows={(customers) => setData((current) => ({ ...current, customers }))}
        title="Customer records"
        emptyState="No customers yet."
        emptyRow={() => ({ id: crypto.randomUUID(), name: "", email: "", phone: "", address: "", notes: "" })}
        fields={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "address", label: "Address" },
          { key: "notes", label: "Notes", type: "textarea" }
        ]}
      />
    </>
  );
}

export default function CustomersPage() {
  return (
    <PageFrame>
      <CustomersContent />
    </PageFrame>
  );
}
