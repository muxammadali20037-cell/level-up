import { LegalPlaceholder, legalMetadata } from "@/components/legal/legal-placeholder";

export function generateMetadata({ params }: PageProps<"/[locale]/help">) {
  return legalMetadata(params, "help");
}

export default function Page({ params }: PageProps<"/[locale]/help">) {
  return <LegalPlaceholder params={params} doc="help" />;
}
