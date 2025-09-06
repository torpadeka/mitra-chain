import { Twitter, Linkedin, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background py-16 border-t-2 border-brand-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-primary font-bold text-2xl font-jetbrains-mono italic">
                MitraChain
              </span>
            </a>
            <p className="text-primary mb-6 max-w-md leading-relaxed">
              The future of franchising is here. Transparent, efficient, and
              community-owned marketplace for franchise opportunities on the
              blockchain.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-primary hover:text-brand-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary hover:text-brand-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary hover:text-brand-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary hover:text-brand-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-xl mb-4 text-primary font-jetbrains-mono">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/franchises"
                  className="text-neutral-700 hover:text-brand-300 transition-colors"
                >
                  Browse Franchises
                </a>
              </li>
              <li>
                <a
                  href="/how-it-works"
                  className="text-neutral-700 hover:text-brand-300 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-neutral-700 hover:text-brand-300 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-700 hover:text-brand-300 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-xl mb-4 text-primary font-jetbrains-mono">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-neutral-700 hover:text-brand-300 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-700 hover:text-brand-300 transition-colors"
                >
                  DAO Governance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-700 hover:text-brand-300 transition-colors"
                >
                  NFT Licenses
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-700 hover:text-brand-300 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-primary">
          <p className="font-jetbrains-mono text-md">
            &copy; 2024 MitraChain. All rights reserved. Built on Internet
            Computer Protocol.
          </p>
        </div>
      </div>
    </footer>
  );
}
