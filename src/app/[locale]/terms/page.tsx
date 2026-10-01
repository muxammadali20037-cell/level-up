import { LegalPlaceholder, legalMetadata } from "@/components/legal/legal-placeholder";

export function generateMetadata({ params }: PageProps<"/[locale]/terms">) {
  return legalMetadata(params, "terms");
}

export default function Page({ params }: PageProps<"/[locale]/terms">) {
  return <LegalPlaceholder params={params} doc="terms" />;
}
