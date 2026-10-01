import { LegalPlaceholder, legalMetadata } from "@/components/legal/legal-placeholder";

export function generateMetadata({ params }: PageProps<"/[locale]/privacy">) {
  return legalMetadata(params, "privacy");
}

export default function Page({ params }: PageProps<"/[locale]/privacy">) {
  return <LegalPlaceholder params={params} doc="privacy" />;
}
