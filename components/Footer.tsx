import { Card, CardContent } from "@/components/ui/card";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 border-t border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Card className="bg-transparent border-none text-white">
          <CardContent>
            <h2 className="text-2xl font-bold">SunshineCBD</h2>
            <p className="text-gray-400 mt-2 max-w-sm">
              Dein zuverlässiger CBD-Shop für hochwertige Produkte. Entspannend, legal und cool – perfekt für deinen small Chill.
            </p>
          </CardContent>
        </Card>

        <ul className="space-y-2 md:space-y-0 md:space-x-6 flex flex-col md:flex-row items-center">
          <li>
            <a
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Kontaktformular
            </a>
          </li>
          <li>
            <a
              href="/impressum"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Impressum
            </a>
          </li>
          <li>
            <a
              href="/agbs"
              className="text-gray-400 hover:text-white transition-colors"
            >
              AGBs
            </a>
          </li>
          <li>
            <a
              href="/datenschutz"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Datenschutzerklärung
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
