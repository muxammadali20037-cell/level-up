import { Fragment } from "react";

/** Renders copy with the brand word "LEVEL" highlighted, e.g. "…qaysi LEVELdasan?". */
export function BrandText({ text, className = "text-primary" }: { text: string; className?: string }) {
  const parts = text.split(/(LEVEL)/);
  return (
    <>
      {parts.map((part, index) =>
        part === "LEVEL" ? (
          <span key={index} className={className}>
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
