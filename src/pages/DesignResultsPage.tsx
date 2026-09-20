import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { MockBanner } from "@/components/common/MockBanner";
import { SpecTable, type SpecRow } from "@/components/common/SpecTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";
import { deriveArrayPowerW, deriveGeometry, getSelectedLayout } from "@/modules/model/derive";
import { getPanel } from "@/data/panelLibrary";
import { DESIGN_CONSTANTS } from "@/data/designConstants";
import type { Project, ResultStatus } from "@/types";
import { fmtKWp, fmtNum } from "@/utils/format";
import { t } from "@/data/strings/en";

interface ResultCard {
  title: string;
  status: ResultStatus;
  engine: string;
  rows: SpecRow[];
}

export function DesignResultsPage({ project }: { project: Project }) {
  const panel = getPanel(project.array.panelId);
  const layout = getSelectedLayout(project);
  const geo = deriveGeometry(project);
  const hasRun = !!project.designRun;
  const cfg = project.designConfiguration;
  const m = { steelGrade: cfg.steelGrade, concreteGrade: cfg.concreteGrade, rebarGrade: cfg.rebarGrade, concreteCoverMm: cfg.concreteCoverMm };

  const pendingStatus: ResultStatus = hasRun ? "pending" : "not_calculated";
  const nc = (label: string): SpecRow => ({ label, value: <span className="text-muted-foreground">—</span> });

  const cards: ResultCard[] = [
    {
      title: "Project Information", status: "ready", engine: "Input Engine",
      rows: [
        { label: "Project", value: project.name },
        { label: "Type", value: t.projectTypes[project.type] },
        { label: "Governorate", value: project.governorate ?? "—" },
        { label: "Design status", value: t.status[project.designStatus] },
      ],
    },
    {
      title: "PV Array", status: "ready", engine: "Panel Library / Array Engine",
      rows: [
        { label: "Panels", value: project.array.panelCount },
        { label: "Module", value: `${panel.powerW} W (mock dims)` },
        { label: "DC power", value: fmtKWp(deriveArrayPowerW(project)) },
        { label: "Layout", value: layout?.label ?? "—" },
      ],
    },
    {
      title: "Structure Geometry", status: geo ? "ready" : "not_calculated", engine: "Geometry Engine",
      rows: geo
        ? [
            { label: "Tables", value: geo.tableCount },
            { label: "Table width", value: fmtNum(geo.tableWidthM, 2), unit: "m" },
            { label: "Tilt", value: geo.tiltDeg, unit: "°" },
            { label: "Columns / Rafters / Purlins", value: `${geo.columnsTotal} / ${geo.raftersTotal} / ${geo.purlinsTotal}` },
          ]
        : [nc("Geometry")],
    },
    {
      title: "Steel Members", status: pendingStatus, engine: "Steel Design Engine",
      rows: [{ label: "Steel grade", value: m.steelGrade }, nc("Column section"), nc("Rafter section"), nc("Purlin section"), nc("Utilisation ratios")],
    },
    {
      title: "Foundations", status: pendingStatus, engine: "Foundation Engine",
      rows: [{ label: "Type", value: DESIGN_CONSTANTS.foundation.type }, { label: "Concrete", value: m.concreteGrade }, { label: "Count", value: geo?.footingsTotal ?? "—" }, nc("Footing dimensions"), nc("Bearing check")],
    },
    {
      title: "Anchor Bolts", status: pendingStatus, engine: "Anchor Bolt Engine",
      rows: [nc("Bolt diameter"), nc("Bolt grade"), nc("Embedment"), nc("Tension / shear check")],
    },
    {
      title: "Base Plates", status: pendingStatus, engine: "Base Plate Engine",
      rows: [{ label: "Steel grade", value: m.steelGrade }, nc("Plate size"), nc("Plate thickness"), nc("Bearing check")],
    },
    {
      title: "Reinforcement", status: pendingStatus, engine: "Rebar Engine",
      rows: [{ label: "Rebar grade", value: m.rebarGrade }, { label: "Cover", value: m.concreteCoverMm, unit: "mm" }, nc("Bar size & spacing"), nc("Rebar weight")],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader code="Step 06" title={t.nav.results} description="Summary of model-derived data and engine output status. No engineering checks are reported until the engines are implemented." />
      <MockBanner>Engineering domains show Pending / Not Calculated by design. The platform never displays PASS/FAIL results from placeholder engines.</MockBanner>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.title} className="gap-2">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between text-sm">
                {c.title} <StatusBadge status={c.status} />
              </CardTitle>
              <div className="font-mono text-[10px] text-muted-foreground">{c.engine}</div>
            </CardHeader>
            <CardContent><SpecTable rows={c.rows} /></CardContent>
          </Card>
        ))}
      </div>
      <WorkflowStepper projectId={project.id} step="results" />
    </div>
  );
}
