// components/design-system/TrailCard.tsx
import { Card } from "@/components/ui/card"

interface TrailCardProps {
    title: string;
    description: string;
    cta: string;
    icon?: React.ReactNode;
}

export function TrailCard({ title, description, cta, icon }: TrailCardProps) {
    return (
        <Card className="p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{description}</p>
            <a href="#" className="mt-4 inline-block text-sm font-medium text-black underline">
                {cta}
            </a>
        </Card>
    );
}