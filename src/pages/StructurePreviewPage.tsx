import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { MockBanner } from "@/components/common/MockBanner";
import { SpecTable } from "@/components/common/SpecTable";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";
import { StructureViewer } from "@/modules/viewer3d/StructureViewer";
import { deriveGeometry, getSelectedLayout } from "@/modules/model/derive";
import type { Project } from "@/types";
import { fmtNum } from "@/utils/format";
import { t } from "@/data/strings/en";

export function StructurePreviewPage({ project, full = false }: { project: Project; full?: boolean }) {
  const geo = deriveGeometry(project);
  const layout = getSelectedLayout(project);

  return (
    <div className="space-y-6">
      <PageHeader
        code={full ? "Step 07" : "Step 04"}
        title={full ? t.nav.model : t.nav.preview}
        description={full ? "Parametric 3D model. Geometry will be supplied by the 3D Engine." : "Simplified parametric preview of panels, steel frame and footings derived from the selected layout."}
      />
      <MockBanner>{full ? "3D Engine not connected — showing simplified parametric preview geometry." : "Preview geometry is schematic (mock member sizes). Member sections come from the Steel Design Engine later."}</MockBanner>
      <div className="grid gap-4 lg:grid-cols-4">
        <StructureViewer project={project} showPresets={full} className="h-[420px] lg:col-span-3 lg:h-[560px]" />
        <Card className="h-fit">
          <CardHeader className="border-b"><CardTitle className="text-sm">Derived Geometry</CardTitle></CardHeader>
          <CardContent>
            {geo && layout ? (
              <SpecTable rows={[
                { label: "Layout", value: layout.label },
                { label: "Tables", value: geo.tableCount },
                { label: "Table width", value: fmtNum(geo.tableWidthM, 2), unit: "m" },
                { label: "Table depth (slope)", value: fmtNum(geo.tableDepthM, 2), unit: "m" },
                { label: "Tilt", value: geo.tiltDeg, unit: "°" },
                { label: "Front clearance", value: geo.frontClearanceM, unit: "m" },
                { label: "Columns", value: geo.columnsTotal },
                { label: "Rafters", value: geo.raftersTotal },
                { label: "Purlins", value: geo.purlinsTotal },
                { label: "Footings", value: geo.footingsTotal },
              ]} />
            ) : (
              <p className="text-sm text-muted-foreground">No layout selected.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <WorkflowStepper projectId={project.id} step={full ? "model" : "preview"} nextDisabled={!layout} />
    </div>
  );
}
