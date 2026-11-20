import { Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const iconLink =
  "grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition hover:-translate-y-0.5 hover:border-white/25 hover:text-white";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 text-center sm:px-6">
        <div className="flex gap-3">
          <a href={profile.github.url} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLink}>
            <GithubIcon className="size-4" />
          </a>
          <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconLink}>
            <LinkedinIcon className="size-4" />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className={iconLink}>
            <Mail className="size-4" aria-hidden />
          </a>
        </div>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
