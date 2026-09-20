import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Building2, Car, Check, Layers, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { ProjectSummary } from "@/components/common/ProjectSummary";
import { StatusBadge } from "@/components/common/StatusBadge";
import { GOVERNORATES } from "@/data/governorates";
import { PANEL_LIST } from "@/data/panelLibrary";
import { useProjectStore } from "@/store/projectStore";
import type { NewProjectInput, PanelId, ProjectType } from "@/types";
import {
  validateAreaLength,
  validateAreaWidth,
  validateGovernorate,
  validatePanelCount,
  validatePanelId,
  validateProjectName,
} from "@/lib/validation";
import { t } from "@/data/strings/en";
import { cn } from "@/lib/utils";

const TYPES: { type: ProjectType; icon: typeof Layers; desc: string; active: boolean }[] = [
  { type: "ground", icon: Layers, desc: "Ground-mounted fixed-tilt tables on steel frames with isolated footings.", active: true },
  { type: "elevated_rooftop", icon: Building2, desc: "Elevated frames over flat concrete roofs.", active: false },
  { type: "metal_roof", icon: Warehouse, desc: "Rail systems clamped to metal / zinc sheet roofs.", active: false },
  { type: "carport", icon: Car, desc: "Cantilever or portal carport canopies.", active: false },
];

const STEPS = ["Structure Type", "Project Name", "Governorate", "Solar Array", "Review"] as const;

interface Draft {
  type: ProjectType | null;
  name: string;
  governorate: string;
  panelCount: number;
  panelId: PanelId | null;
  widthM: number;
  lengthM: number;
}

const INITIAL: Draft = {
  type: null,
  name: "",
  governorate: "",
  panelCount: 48,
  panelId: "PV-650",
  widthM: 30,
  lengthM: 40,
};

function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function NewProjectPage() {
  const createProject = useProjectStore((s) => s.createProject);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [draft, setDraft] = useState<Draft>(INITIAL);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const errors = {
    name: validateProjectName(draft.name),
    governorate: validateGovernorate(draft.governorate || null),
    panelCount: validatePanelCount(draft.panelCount),
    panelId: validatePanelId(draft.panelId),
    widthM: validateAreaWidth(draft.widthM),
    lengthM: validateAreaLength(draft.lengthM),
  };

  const stepValid =
    step === 0 ? !!draft.type
    : step === 1 ? !errors.name
    : step === 2 ? !errors.governorate
    : step === 3 ? !errors.panelCount && !errors.panelId && !errors.widthM && !errors.lengthM
    : Object.values(errors).every((e) => e === null) && !!draft.type;

  const show = (key: keyof typeof errors) => (touched ? errors[key] : null);

  const goNext = () => {
    if (!stepValid) { setTouched(true); return; }
    setTouched(false);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const goBack = () => { setTouched(false); setStep((s) => Math.max(0, s - 1)); };

  const summaryDraft: NewProjectInput = {
    name: draft.name,
    type: draft.type ?? "ground",
    governorate: draft.governorate,
    panelCount: draft.panelCount,
    panelId: draft.panelId ?? "PV-650",
    area: { widthM: draft.widthM, lengthM: draft.lengthM },
  };

  const confirm = () => {
    if (!stepValid) { setTouched(true); return; }
    const p = createProject(summaryDraft);
    navigate({ to: "/projects/$projectId/info", params: { projectId: p.id } });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        code={`Step 00 · ${step + 1}/${STEPS.length}`}
        title={t.nav.newProject}
        description="Define the project parameters. System design constants are applied automatically on creation."
      />

      <ol className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={cn(
              "rounded-sm border px-2 py-1",
              i === step ? "border-primary bg-primary/10 text-primary" : i < step ? "text-muted-foreground" : "text-muted-foreground/60",
            )}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map(({ type, icon: Icon, desc, active }) => (
            <button
              key={type}
              disabled={!active}
              onClick={() => { set("type", type); setStep(1); }}
              className={cn(
                "group flex items-start gap-4 rounded-sm border bg-card p-4 text-left transition-colors",
                active ? "hover:border-primary hover:bg-accent/40" : "cursor-not-allowed opacity-60",
                draft.type === type && "border-primary bg-primary/10",
              )}
            >
              <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-sm border", active ? "border-primary/40 bg-primary/10 text-primary" : "text-muted-foreground")}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{t.projectTypes[type]}</span>
                  <StatusBadge status={active ? "active" : "comingSoon"} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <Card>
          <CardHeader className="border-b"><CardTitle className="text-sm">Project Name</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            <Label htmlFor="np-name">Project Name</Label>
            <Input id="np-name" autoFocus value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Aden Free Zone – 48 kWp" />
            <FieldError message={show("name")} />
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader className="border-b"><CardTitle className="text-sm">Governorate</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            <Label>Governorate</Label>
            <Select value={draft.governorate} onValueChange={(v) => set("governorate", v)}>
              <SelectTrigger className="w-full sm:w-80"><SelectValue placeholder="Select governorate" /></SelectTrigger>
              <SelectContent>
                {GOVERNORATES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError message={show("governorate")} />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b"><CardTitle className="text-sm">Array Size</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="np-count">Number of PV Panels</Label>
                <Input id="np-count" type="number" min={1} step={1} className="num" value={draft.panelCount}
                  onChange={(e) => set("panelCount", parseInt(e.target.value || "0", 10))} />
                <FieldError message={show("panelCount")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="np-w">Available Area Width (m)</Label>
                <Input id="np-w" type="number" min={0} step={0.5} className="num" value={draft.widthM}
                  onChange={(e) => set("widthM", parseFloat(e.target.value || "0"))} />
                <FieldError message={show("widthM")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="np-l">Available Area Length (m)</Label>
                <Input id="np-l" type="number" min={0} step={0.5} className="num" value={draft.lengthM}
                  onChange={(e) => set("lengthM", parseFloat(e.target.value || "0"))} />
                <FieldError message={show("lengthM")} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b"><CardTitle className="text-sm">Panel Power · Panel Library</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {PANEL_LIST.map((p) => (
                <button key={p.id} onClick={() => set("panelId", p.id)}
                  className={cn("rounded-sm border p-3 text-left transition-colors hover:border-primary", p.id === draft.panelId ? "border-primary bg-primary/10" : "bg-card")}>
                  <div className="flex items-center justify-between">
                    <span className="num text-lg font-semibold">{p.powerW} W</span>
                    <StatusBadge status="mock" />
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground">{p.id} · dimensions from library</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {step === 4 && (
        <Card className="max-w-2xl">
          <CardHeader className="border-b"><CardTitle className="text-sm">Review</CardTitle></CardHeader>
          <CardContent><ProjectSummary project={summaryDraft} /></CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" size="sm" onClick={goBack} disabled={step === 0}>
          <ArrowLeft className="size-4" /> {t.common.back}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button size="sm" onClick={goNext} disabled={!stepValid}>
            {t.common.next} <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={confirm} disabled={!stepValid}>
            <Check className="size-4" /> Create Project
          </Button>
        )}
      </div>
    </div>
  );
}
