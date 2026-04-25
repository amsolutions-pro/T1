import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold text-white">ArmenSTEM</p>
            <p className="mt-2 max-w-xs text-sm text-slate-400">
              Cours particuliers en visio par des professeurs arméniens d&apos;élite en STEM et échecs.
            </p>
          </div>

          <nav aria-label="Pied de page — informations légales">
            <p className="text-sm font-semibold text-white">Informations légales</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="hover:text-white">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-white">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@armenstem.fr"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  hello@armenstem.fr
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/armenstem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Linkedin className="h-4 w-4" aria-hidden />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
          © {year} ArmenSTEM. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
