import React from "react";

interface PartnerItem {
  name: string;
  logo: string;
  fallbackBg: string;
  tagline: string;
}

const partners: PartnerItem[] = [
  {
    name: "Bombora",
    logo: "https://logo.clearbit.com/bombora.com",
    fallbackBg: "bg-valasys-orange",
    tagline: "Intent Data",
  },
  {
    name: "G2 Reviews",
    logo: "https://logo.clearbit.com/g2.com",
    fallbackBg: "bg-valasys-blue",
    tagline: "Buyer Insights",
  },
];

export default function AssociationPartners() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {partners.map((p) => (
        <div
          key={p.name}
          className="bg-white/90 rounded-2xl p-5 text-center hover:bg-white transition-all duration-200 group shadow-lg border border-white/40 backdrop-blur-sm"
        >
          <div className="mx-auto mb-3 h-16 w-16 rounded-lg bg-white shadow-sm ring-1 ring-valasys-gray-200 flex items-center justify-center overflow-hidden group-hover:ring-valasys-orange/40">
            <img
              src={p.logo}
              alt={p.name}
              className="max-h-12 max-w-12 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.parentElement as HTMLElement).innerHTML =
                  `<div class='h-full w-full ${p.fallbackBg} rounded-lg flex items-center justify-center text-white text-base font-bold'>${p.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}</div>`;
              }}
            />
          </div>
          <div className="font-semibold text-valasys-gray-900 text-sm group-hover:text-valasys-orange transition-colors">
            {p.name}
          </div>
          <div className="text-xs text-valasys-gray-600">{p.tagline}</div>
        </div>
      ))}
    </div>
  );
}
