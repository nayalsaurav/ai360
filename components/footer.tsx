import Link from "next/link";
import { Github, Linkedin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#1E1E1E]">
              Impact of AI on Global Market
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              © 2025 Global AI Insights. All rights reserved.
              <br />
              Developed by{" "}
              <span className="font-medium text-primary">Saurav Nayal</span>.
            </p>
          </div>

          {/* Navigation Section */}
          <div>
            <h4 className="font-semibold mb-4 text-[#1E1E1E]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#dashboard"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#utilities"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  AI Utilities
                </Link>
              </li>
              <li>
                <Link
                  href="#insights"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h4 className="font-semibold mb-4 text-[#1E1E1E]">Connect</h4>
            <div className="flex gap-4">
              <Link
                href="https://www.linkedin.com/in/sauravnayal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://github.com/sauravnayal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://impactofai.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Website</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          Designed & Built with ❤️ using Next.js, TailwindCSS, and OpenAI APIs
        </div>
      </div>
    </footer>
  );
}
