import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-purple-500/20 bg-gradient-to-b from-black to-purple-950/20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <div className="absolute inset-0 rounded bg-gradient-to-br from-purple-500 to-pink-500 opacity-50 blur" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded bg-black/80 border border-purple-400/50">
                  <Sparkles className="h-4 w-4 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text" />
                </div>
              </div>
              <span className="font-playfair text-lg font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                QuestGen
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              AI-powered assessment creation for modern educators.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="#features"
                  className="hover:text-purple-300 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-300 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-300 transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/legal"
                  className="hover:text-purple-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-300 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} QuestGen. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-purple-300 transition-colors"
              aria-label="Twitter"
            >
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-purple-300 transition-colors"
              aria-label="GitHub"
            >
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
