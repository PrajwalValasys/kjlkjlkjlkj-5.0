import React from "react";
import { Globe } from "lucide-react";

interface IntegrationItem {
  name: string;
  logo: string;
  description: string;
  color: string;
}

export function IntegrationsFooter() {
  const integrations: IntegrationItem[] = [
    {
      name: "Salesforce",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
      description: "CRM Integration",
      color: "bg-blue-500",
    },
    {
      name: "HubSpot",
      logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
      description: "Marketing Automation",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-sm font-semibold text-valasys-gray-900 flex items-center justify-center space-x-2">
          <Globe
            className="h-4 w-4 text-valasys-blue animate-spin"
            style={{ animationDuration: "6s" }}
          />
          <span>Powered by 50+ Integrations</span>
        </h3>
        <p className="text-valasys-gray-600 text-xs">
          Connect seamlessly with your existing tech stack
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {integrations.map((integration, index) => (
          <div
            key={integration.name}
            className={`bg-white/90 rounded-xl p-3 text-center transition-all duration-300 group shadow-sm border border-valasys-gray-200 ${
              index % 2 === 0 ? "delay-100" : "delay-200"
            }`}
          >
            <div className="h-9 w-9 mx-auto mb-2 bg-white rounded-lg p-2 group-hover:scale-105 transition-all duration-200 shadow">
              <img
                src={integration.logo}
                alt={integration.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.parentElement as HTMLElement).innerHTML =
                    `<div class='w-full h-full ${integration.color} rounded flex items-center justify-center text-white text-xs font-bold'>${integration.name[0]}</div>`;
                }}
              />
            </div>
            <div className="font-medium text-valasys-gray-900 text-xs">
              {integration.name}
            </div>
            <div className="text-[10px] text-valasys-gray-600">
              {integration.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IntegrationsFooter;
