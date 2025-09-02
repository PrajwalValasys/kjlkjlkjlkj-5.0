import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-2xl flex items-center justify-center mb-4">
              <Construction className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-valasys-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-valasys-gray-600 mb-6">{description}</p>
            <p className="text-sm text-valasys-gray-500">
              Continue prompting to fill in this page content!
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
