import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Layers,
  Lightbulb,
  ListChecks,
  Target,
  Trophy,
  UserRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { isTodo } from "@/data/types";
import { GithubIcon } from "@/components/icons";
import { ProjectMedia } from "@/components/ProjectMedia";
import { Chip, Container, Text } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const description = [project.description, project.summary].find((d) => !isTodo(d)) ?? `${project.title} — a project by ${profile.name}.`;
  return {
    title: project.title,
    description,
    openGraph: { title: `${project.title} — ${profile.name}`, description },
  };
}

function DetailCard({
  icon: IconComponent,
  title,
  tone,
  children,
}: {
  icon: LucideIcon;
  title: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="glass p-6 sm:p-7">
      <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-white">
        <span className={`grid size-9 place-items-center rounded-lg ${tone}`}>
          <IconComponent className="size-5" aria-hidden />
        </span>
        {title}
      </h2>
      <div className="text-[15px] leading-relaxed text-slate-300">{children}</div>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const codeUrl = isTodo(project.githubUrl) ? profile.github.url : project.githubUrl;
  const [cover, ...rest] = project.gallery;

  return (
    <article className="pt-28 pb-24">
      <Container className="max-w-5xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to Projects
        </Link>

        <header className="mt-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-eyebrow uppercase">
            <Text value={project.category} />
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{project.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
            <Text value={project.description} />
          </p>
          {project.role && (
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              <UserRound className="size-4 text-accent-cyan" aria-hidden />
              <span className="font-semibold text-white">My role:</span>
              <Text value={project.role} />
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-violet/25 transition hover:-translate-y-0.5"
            >
              <GithubIcon className="size-4" /> View Code
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30"
              >
                <ExternalLink className="size-4" aria-hidden /> Live Demo
              </a>
            )}
          </div>
        </header>

        <div className="glass relative mt-10 aspect-[16/9] overflow-hidden">
          <ProjectMedia
            src={cover?.src ?? project.thumbnail}
            alt={cover?.alt ?? `${project.title} screenshot`}
            sizes="(min-width: 1024px) 976px, 100vw"
            phone={project.phoneScreenshots}
            preload
          />
        </div>
        {rest.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {rest.map((img) => (
              <div key={img.src} className="glass relative aspect-[16/10] overflow-hidden">
                <ProjectMedia src={img.src} alt={img.alt} phone={project.phoneScreenshots} sizes="(min-width: 640px) 320px, 50vw" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <DetailCard icon={BookOpen} title="Overview" tone="bg-violet-500/15 text-violet-300">
              <Text value={project.overview} />
            </DetailCard>
          </div>
          <DetailCard icon={Target} title="Problem" tone="bg-rose-500/15 text-rose-300">
            <Text value={project.problem} />
          </DetailCard>
          <DetailCard icon={Lightbulb} title="Solution" tone="bg-amber-500/15 text-amber-300">
            <Text value={project.solution} />
          </DetailCard>
          <DetailCard icon={ListChecks} title="Key Features" tone="bg-emerald-500/15 text-emerald-300">
            <ul className="space-y-2">
              {project.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-300" />
                  <Text value={f} />
                </li>
              ))}
            </ul>
          </DetailCard>
          <DetailCard icon={Layers} title="Technology Stack" tone="bg-blue-500/15 text-blue-300">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </DetailCard>
          <div className="md:col-span-2">
            <DetailCard icon={Workflow} title="Development Process" tone="bg-cyan-500/15 text-cyan-300">
              <ol className="space-y-3">
                {project.process.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-gradient text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">
                      <Text value={step} />
                    </span>
                  </li>
                ))}
              </ol>
            </DetailCard>
          </div>
          <div className="md:col-span-2">
            <DetailCard icon={Trophy} title="Result" tone="bg-fuchsia-500/15 text-fuchsia-300">
              <Text value={project.result} />
            </DetailCard>
          </div>
        </div>
      </Container>
    </article>
  );
}
