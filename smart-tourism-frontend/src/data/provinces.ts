import type { Province } from "../types/province";

export const provinces: Province[] = [
  { id: "koshi", name: "Koshi", capital: "Biratnagar", description: "Nepal's easternmost province, spanning Everest and Kanchenjunga high country down to the eastern Terai." },
  { id: "madhesh", name: "Madhesh", capital: "Janakpur", description: "Terai plains province along the southern border, centred on Janakpur's temple culture." },
  { id: "bagmati", name: "Bagmati", capital: "Hetauda", description: "Home to the Kathmandu Valley, its UNESCO heritage sites, and the Chitwan lowlands." },
  { id: "gandaki", name: "Gandaki", capital: "Pokhara", description: "Lakeside Pokhara and the Annapurna, Manaslu, and Mustang trekking regions." },
  { id: "lumbini", name: "Lumbini", capital: "Deukhuri", description: "Named for the Buddha's birthplace; spans the mid-western Terai and hills." },
  { id: "karnali", name: "Karnali", capital: "Birendranagar", description: "Nepal's largest and most remote province, home to Rara Lake and Dolpo." },
  { id: "sudurpashchim", name: "Sudurpashchim", capital: "Godawari", description: "The far-western province, from the Terai wetlands to the Api Himal." },
];

export function getProvinceById(id: string): Province | undefined {
  return provinces.find((p) => p.id === id);
}
