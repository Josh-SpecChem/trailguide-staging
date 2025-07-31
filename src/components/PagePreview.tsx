// components/PagePreview.tsx
import React from "react";

export default function PagePreview({ html }: { html: string }) {
    return (
        <div
            className="prose max-w-none px-6 py-10"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}