"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Extra, Roadmap, Step, Topic } from "@/lib/roadmap";

/*
  Self-paced roadmap: timeline at a glance -> expandable steps (topics inside) -> job-ready kit.
  Progress (done topics + checklist) lives in this browser only; the page works fine without it.
*/

const Chevron = ({ open }: { open: boolean }) => (
  <svg className={`rm-chev${open ? " open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

const RES_LABEL: Record<string, string> = {
  video: "Video",
  docs: "Docs",
  book: "Book",
  free: "Free",
  repo: "Repo",
  certification: "Cert",
  paid: "Paid",
};
const resTag = (label: string) => RES_LABEL[label.toLowerCase().split(/[\s/(]/)[0]] ?? label;

function useProgress(slug: string) {
  const key = `cc-roadmap:${slug}`;
  const [done, setDone] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setDone(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* private mode / blocked storage: progress just isn't saved */
    }
  }, [key]);
  const toggle = useCallback(
    (id: string) =>
      setDone((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        try {
          localStorage.setItem(key, JSON.stringify([...next]));
        } catch {
          /* ignore */
        }
        return next;
      }),
    [key],
  );
  const reset = useCallback(() => {
    setDone(new Set());
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, [key]);
  return { done, toggle, reset };
}

function TopicCard({ t, done, onToggle }: { t: Topic; done: boolean; onToggle: () => void }) {
  return (
    <article className={`rm-topic${done ? " done" : ""}`} id={t.id}>
      <header className="rm-topic-head">
        <h4>{t.name}</h4>
        <button type="button" className="rm-done" aria-pressed={done} onClick={onToggle}>
          <span className="rm-box">{done && <Check />}</span>
          {done ? "Done" : "Mark done"}
        </button>
      </header>
      {t.learn && (
        <div className="rm-learn">
          <span className="rm-label">Kya seekhna</span>
          <div className="rm-rich" dangerouslySetInnerHTML={{ __html: t.learn.html }} />
        </div>
      )}
      <div className="rm-fields">
        {t.fields
          .filter((f) => f.kind === "why" || f.kind === "depth" || f.kind === "other")
          .map((f) => (
            <div key={f.label} className="rm-field">
              <span className="rm-label">{f.label}</span>
              <div className="rm-rich" dangerouslySetInnerHTML={{ __html: f.html }} />
            </div>
          ))}
      </div>
      {t.resources.length > 0 && (
        <div className="rm-res">
          <span className="rm-label">Kahan se padhna hai</span>
          <ul>
            {t.resources.map((r) => (
              <li key={r.label}>
                <span className="rm-res-tag">{resTag(r.label)}</span>
                <span className="rm-rich" dangerouslySetInnerHTML={{ __html: r.html }} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="rm-do">
        {t.fields
          .filter((f) => f.kind === "practice" || f.kind === "project" || f.kind === "outcome")
          .map((f) => (
            <div key={f.label} className={`rm-do-item ${f.kind}`}>
              <span className="rm-label">{f.label}</span>
              <div className="rm-rich" dangerouslySetInnerHTML={{ __html: f.html }} />
            </div>
          ))}
      </div>
    </article>
  );
}

function StepPanel({
  s,
  open,
  onOpen,
  done,
  toggle,
}: {
  s: Step;
  open: boolean;
  onOpen: () => void;
  done: Set<string>;
  toggle: (id: string) => void;
}) {
  const count = s.items.filter((t) => done.has(t.id)).length;
  const complete = count === s.items.length && s.items.length > 0;
  return (
    <section className={`rm-step${open ? " open" : ""}${complete ? " complete" : ""}`} id={s.id}>
      <button type="button" className="rm-step-head" aria-expanded={open} aria-controls={`${s.id}-body`} onClick={onOpen}>
        <span className="rm-num">{complete ? <Check /> : s.n}</span>
        <span className="rm-step-text">
          <span className="rm-step-title">{s.title}</span>
          <span className="rm-step-sub">{s.topics.join(" · ")}</span>
        </span>
        <span className="rm-count">
          {count}/{s.items.length}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="rm-step-body" id={`${s.id}-body`}>
          {s.items.map((t) => (
            <TopicCard key={t.id} t={t} done={done.has(t.id)} onToggle={() => toggle(t.id)} />
          ))}
        </div>
      )}
    </section>
  );
}

function ExtraPanel({ x, open, onOpen, done, toggle }: { x: Extra; open: boolean; onOpen: () => void; done: Set<string>; toggle: (id: string) => void }) {
  return (
    <section className={`rm-extra${open ? " open" : ""}`} id={x.id}>
      <button type="button" className="rm-extra-head" aria-expanded={open} onClick={onOpen}>
        <span>{x.title}</span>
        {x.checklist && (
          <span className="rm-count">
            {x.checklist.filter((_, i) => done.has(`${x.id}-${i}`)).length}/{x.checklist.length}
          </span>
        )}
        <Chevron open={open} />
      </button>
      {open &&
        (x.checklist ? (
          <ul className="rm-checklist">
            {x.checklist.map((c, i) => {
              const id = `${x.id}-${i}`;
              const on = done.has(id);
              return (
                <li key={id}>
                  <button type="button" className={`rm-check${on ? " on" : ""}`} aria-pressed={on} onClick={() => toggle(id)}>
                    <span className="rm-box">{on && <Check />}</span>
                    <span dangerouslySetInnerHTML={{ __html: c }} />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="d-md rm-extra-body" dangerouslySetInnerHTML={{ __html: x.html }} />
        ))}
    </section>
  );
}

export function RoadmapView({ r }: { r: Roadmap }) {
  const { done, toggle, reset } = useProgress(r.slug);
  const [openSteps, setOpenSteps] = useState<Set<string>>(new Set());
  const [openExtras, setOpenExtras] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState(0);

  const allTopicIds = useMemo(() => r.steps.flatMap((s) => s.items.map((t) => t.id)), [r.steps]);
  const doneTopics = allTopicIds.filter((id) => done.has(id)).length;
  const pct = allTopicIds.length ? Math.round((doneTopics / allTopicIds.length) * 100) : 0;
  const nextStep = r.steps.find((s) => s.items.some((t) => !done.has(t.id)));

  const flip = (set: Set<string>, id: string) => {
    const n = new Set(set);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  };

  const goTo = useCallback((id: string) => {
    setOpenSteps((p) => new Set(p).add(id));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    history.replaceState(null, "", `#${id}`);
  }, []);

  // open the step / kit section named in the URL hash (shared links)
  useEffect(() => {
    const open = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (!h) return;
      if (h.startsWith("step-")) setOpenSteps((p) => new Set(p).add(h));
      else if (r.extras.some((x) => x.id === h)) setOpenExtras((p) => new Set(p).add(h));
      else return;
      requestAnimationFrame(() => document.getElementById(h)?.scrollIntoView({ block: "start" }));
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [r.extras]);

  const allOpen = openSteps.size === r.steps.length;

  return (
    <div className="rm">
      {/* ---------- hero ---------- */}
      <header className="rm-hero">
        <p className="rm-eyebrow">Career roadmap {String(r.ep).padStart(2, "0")}</p>
        <h1 className="rm-h1">{r.role}</h1>
        <div className="rm-hero-text">
        <p className="rm-lead">{r.lead}</p>
        <ul className="rm-facts">
          <li>
            <b>{r.steps.length}</b> steps
          </li>
          <li>
            <b>{r.topicCount}</b> topics
          </li>
          <li>Free resources</li>
          <li>Self-paced</li>
        </ul>
        </div>
        <div className="rm-progress" aria-label="Your progress">
          <div className="rm-progress-top">
            <span>
              Your progress: <b>{doneTopics}</b> / {allTopicIds.length} topics
            </span>
            {doneTopics > 0 && (
              <button type="button" className="rm-link" onClick={reset}>
                Reset
              </button>
            )}
          </div>
          <div className="rm-bar">
            <span style={{ width: `${pct}%` }} />
          </div>
          <div className="rm-progress-cta">
            {nextStep ? (
              <button type="button" className="d-btn primary" onClick={() => goTo(nextStep.id)}>
                {doneTopics === 0 ? "Step 1 se shuru karo" : `Continue: Step ${nextStep.n} · ${nextStep.title}`}
              </button>
            ) : (
              <span className="rm-allset">Saare steps done. Ab projects aur interview prep pe focus karo.</span>
            )}
            <span className="rm-hint">Progress sirf isi browser mein save hota hai.</span>
          </div>
        </div>
      </header>

      {/* ---------- about the role ---------- */}
      <section className="rm-block" aria-labelledby="rm-about">
        <h2 className="rm-h2" id="rm-about">
          Role samjho
        </h2>
        <div className="rm-tabs" role="tablist">
          {r.about.map((a, i) => (
            <button key={a.title} type="button" role="tab" aria-selected={tab === i} className="d-tab" aria-pressed={tab === i} onClick={() => setTab(i)}>
              {a.title}
            </button>
          ))}
        </div>
        <div className="rm-card d-md" role="tabpanel" dangerouslySetInnerHTML={{ __html: r.about[tab].html }} />
      </section>

      {/* ---------- timeline ---------- */}
      <section className="rm-block" aria-labelledby="rm-glance">
        <h2 className="rm-h2" id="rm-glance">
          Roadmap ek nazar mein
        </h2>
        <p className="rm-sub" dangerouslySetInnerHTML={{ __html: r.glanceIntro }} />
        <ol className="rm-timeline">
          <li className="rm-tl-cap">Start</li>
          {r.steps.map((s) => {
            const c = s.items.filter((t) => done.has(t.id)).length;
            const complete = c === s.items.length;
            return (
              <li key={s.id} className={`rm-tl-item${complete ? " complete" : ""}`}>
                <span className="rm-tl-dot">{complete ? <Check /> : s.n}</span>
                <button type="button" className="rm-tl-card" onClick={() => goTo(s.id)}>
                  <span className="rm-tl-title">{s.title}</span>
                  <span className="rm-tl-chips">
                    {s.topics.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                  <span className="rm-tl-open">Topics dekho →</span>
                </button>
              </li>
            );
          })}
          <li className="rm-tl-cap end">Job-ready</li>
        </ol>
        <div className="rm-note d-md" dangerouslySetInnerHTML={{ __html: r.glanceAfter }} />
      </section>

      {/* ---------- steps + side nav ---------- */}
      <div className="rm-layout" id="steps">
        <aside className="rm-side" aria-label="Steps">
          <p className="rm-side-h">Steps</p>
          <ol>
            {r.steps.map((s) => {
              const complete = s.items.every((t) => done.has(t.id));
              return (
                <li key={s.id}>
                  <button type="button" className={complete ? "complete" : ""} onClick={() => goTo(s.id)}>
                    <span className="rm-side-n">{complete ? <Check /> : s.n}</span>
                    {s.title}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="rm-side-h">Job-ready kit</p>
          <ol>
            {r.extras.map((x) => (
              <li key={x.id}>
                <a
                  href={`#${x.id}`}
                  onClick={() => setOpenExtras((p) => new Set(p).add(x.id))}
                >
                  {x.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="rm-main">
          <div className="rm-block-head">
            <h2 className="rm-h2">Step by step</h2>
            <button type="button" className="rm-link" onClick={() => setOpenSteps(allOpen ? new Set() : new Set(r.steps.map((s) => s.id)))}>
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
          <p className="rm-sub">Step pe click karo, uske topics khulenge. Har topic: kya seekhna, kyun, kahan se, practice aur mini project.</p>
          <div className="rm-steps">
            {r.steps.map((s) => (
              <StepPanel key={s.id} s={s} open={openSteps.has(s.id)} onOpen={() => setOpenSteps((p) => flip(p, s.id))} done={done} toggle={toggle} />
            ))}
          </div>

          {r.allInOne && (
            <div className="rm-allinone">
              <h3>{r.allInOne.title}</h3>
              <div className="d-md" dangerouslySetInnerHTML={{ __html: r.allInOne.html }} />
            </div>
          )}

          <div className="rm-block-head" style={{ marginTop: 56 }}>
            <h2 className="rm-h2">Job-ready kit</h2>
          </div>
          <p className="rm-sub">Padhai ke saath ye bhi: kaise padhna hai, practice, projects, interview aur job apply karna.</p>
          <div className="rm-extras">
            {r.extras.map((x) => (
              <ExtraPanel key={x.id} x={x} open={openExtras.has(x.id)} onOpen={() => setOpenExtras((p) => flip(p, x.id))} done={done} toggle={toggle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
