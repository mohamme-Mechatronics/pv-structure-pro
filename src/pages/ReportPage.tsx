import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { MockBanner } from "@/components/common/MockBanner";
import { SpecTable } from "@/components/common/SpecTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";
import { DESIGN_CONSTANT_ROWS } from "@/data/designConstants";
import { deriveArrayPowerW, deriveGeometry, getSelectedLayout } from "@/modules/model/derive";
import { getPanel } from "@/data/panelLibrary";
import type { EngineId } from "@/engines/types";
import type { Project, ResultStatus } from "@/types";
import { fmtKWp, fmtNum } from "@/utils/format";
import { t } from "@/data/strings/en";

const SECTIONS: { id: string; title: string; engineId: EngineId }[] = [
  { id: "project", title: "Project Information", engineId: "input" },
  { id: "criteria", title: "Design Criteria", engineId: "input" },
  { id: "array", title: "PV Array", engineId: "arrayLayout" },
  { id: "geometry", title: "Geometry", engineId: "geometry" },
  { id: "loads", title: "Loads", engineId: "load" },
  { id: "structural", title: "Structural Design", engineId: "steelDesign" },
  { id: "connections", title: "Connections", engineId: "connection" },
  { id: "foundation", title: "Foundation", engineId: "foundation" },
  { id: "reinforcement", title: "Reinforcement", engineId: "rebar" },
  { id: "anchors", title: "Anchor Bolts", engineId: "anchorBolt" },
  { id: "baseplates", title: "Base Plates", engineId: "basePlate" },
  { id: "drawings", title: "Drawings", engineId: "drawing" },
  { id: "bom", title: "BOM", engineId: "bom" },
];

export function ReportPage({ project }: { project: Project }) {
  const panel = getPanel(project.array.panelId);
  const layout = getSelectedLayout(project);
  const geo = deriveGeometry(project);
  const pending: ResultStatus = project.designRun ? "pending" : "not_calculated";

  const status = (id: string): ResultStatus =>
    id === "project" || id === "criteria" || id === "array" ? "ready" : id === "geometry" ? (geo ? "ready" : "not_calculated") : pending;

  const body = (id: string) => {
    switch (id) {
      case "project":
        return <SpecTable rows={[{ label: "Project", value: project.name }, { label: "Type", value: t.projectTypes[project.type] }, { label: "Governorate", value: project.governorate ?? "—" }, { label: "Project ID", value: project.id }]} />;
      case "criteria":
        return <SpecTable rows={DESIGN_CONSTANT_ROWS.map((r) => ({ label: `${r.group} · ${r.label}`, value: r.value }))} />;
      case "array":
        return <SpecTable rows={[{ label: "Panels", value: project.array.panelCount }, { label: "Module", value: `${panel.powerW} W (mock)` }, { label: "DC power", value: fmtKWp(deriveArrayPowerW(project)) }, { label: "Layout", value: layout?.label ?? "—" }, { label: "Available area", value: `${project.array.area.widthM} × ${project.array.area.lengthM} m` }]} />;
      case "geometry":
        return geo ? <SpecTable rows={[{ label: "Tables", value: geo.tableCount }, { label: "Table width", value: fmtNum(geo.tableWidthM, 2), unit: "m" }, { label: "Table depth", value: fmtNum(geo.tableDepthM, 2), unit: "m" }, { label: "Columns", value: geo.columnsTotal }, { label: "Footings", value: geo.footingsTotal }]} /> : <Placeholder />;
      default:
        return <Placeholder />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader code="Step 10" title={t.nav.report} description="Structural design report. Sections are assembled from engine outputs by the Report Engine." />
      <MockBanner>Report Engine pending — sections show model data where available and placeholders elsewhere.</MockBanner>
      <div className="grid gap-4 lg:grid-cols-4">
        <nav className="hidden lg:block">
          <div className="sticky top-16 rounded-sm border bg-card p-2 text-xs">
            <div className="mb-1 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Contents</div>
            {SECTIONS.map((s, i) => (
              <a key={s.id} href={`#rpt-${s.id}`} className="flex items-center justify-between rounded-sm px-2 py-1 hover:bg-accent">
                <span><span className="mr-2 font-mono text-muted-foreground">{i + 1}.</span>{s.title}</span>
              </a>
            ))}
          </div>
        </nav>
        <div className="space-y-4 lg:col-span-3">
          {SECTIONS.map((s, i) => (
            <Card key={s.id} id={`rpt-${s.id}`} className="scroll-mt-16 gap-2">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span><span className="mr-2 font-mono text-muted-foreground">{i + 1}.</span>{s.title}</span>
                  <StatusBadge status={status(s.id)} />
                </CardTitle>
              </CardHeader>
              <CardContent>{body(s.id)}</CardContent>
            </Card>
          ))}
        </div>
      </div>
      <WorkflowStepper projectId={project.id} step="report" />
    </div>
  );
}

function Placeholder() {
  return (
    <div className="rounded-sm border border-dashed p-6 text-center text-xs text-muted-foreground">
      Content will be generated automatically by the corresponding engineering engine.
    </div>
  );
}
