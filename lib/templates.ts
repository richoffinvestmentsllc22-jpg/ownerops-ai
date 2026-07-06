import type { OwnerOpsData } from "@/lib/types";

type TemplateOptions = {
  recipientName?: string;
  service?: string;
  dateOption?: string;
};

export function firstName(name: string | undefined) {
  return (name?.trim().split(/\s+/)[0] || "there").replace(/[{}]/g, "");
}

export function defaultRecipientName(data: OwnerOpsData) {
  return data.leads[0]?.name || data.customers[0]?.name || "";
}

export function personalizeTemplate(template: string, data: OwnerOpsData, options: TemplateOptions = {}) {
  const recipient = options.recipientName || defaultRecipientName(data);
  const service = options.service || data.pricing.find((row) => row.industry === data.profile.industry)?.serviceName || "your service";
  const dateOption = options.dateOption || "this week";

  return template
    .replaceAll("{{first_name}}", firstName(recipient))
    .replaceAll("{{owner_name}}", data.profile.ownerName || "the owner")
    .replaceAll("{{business_name}}", data.profile.businessName || "our business")
    .replaceAll("{{service}}", service)
    .replaceAll("{{date_option}}", dateOption);
}
