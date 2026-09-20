import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/PageHeader";
import { MockBanner } from "@/components/common/MockBanner";
import { SpecTable } from "@/components/common/SpecTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";
import { PANEL_LIST, getPanel } from "@/data/panelLibrary";
import { useProjectStore } from "@/store/projectStore";
import { deriveArrayPowerW } from "@/modules/model/derive";
import type { Project } from "@/types";
import { fmtKWp, fmtNum } from "@/utils/format";
import { cn } from "@/lib/utils";
import { validateAreaLength, validateAreaWidth, validatePanelCount } from "@/lib/validation";
import { t } from "@/data/strings/en";

export function SolarArrayPage({ project }: { project: Project }) {
  const updateArray = useProjectStore((s) => s.updateArray);
  const { panelCount, panelId, area } = project.array;
  const panel = getPanel(panelId);
  const countError = validatePanelCount(panelCount);
  const widthError = validateAreaWidth(area.widthM);
  const lengthError = validateAreaLength(area.lengthM);
  const valid = !countError && !widthError && !lengthError;

  return (
    <div className="space-y-6">
      <PageHeader code="Step 02" title={t.nav.array} description="Define the PV array. Module dimensions are resolved from the central Panel Library — never entered manually." />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="border-b"><CardTitle className="text-sm">Array Size</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="count">Number of PV Panels</Label>
                <Input id="count" type="number" min={1} step={1} className="num" value={panelCount}
                  onChange={(e) => updateArray(project.id, { panelCount: Math.max(0, parseInt(e.target.value || "0", 10)) })} />
                {countError && <p className="text-xs text-destructive">{countError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Array DC Power</Label>
                <Input readOnly className="num bg-muted/50" value={fmtKWp(deriveArrayPowerW(project))} />
              </div>
              <div className="space-y-1.5">
                <Label>Array Weight (modules)</Label>
                <Input readOnly className="num bg-muted/50" value={`${fmtNum(panelCount * panel.weightKg, 0)} kg`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b"><CardTitle className="text-sm">Panel Selection · Panel Library</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {PANEL_LIST.map((p) => (
                <button key={p.id} onClick={() => updateArray(project.id, { panelId: p.id })}
                  className={cn("rounded-sm border p-3 text-left transition-colors hover:border-primary", p.id === panelId ? "border-primary bg-primary/10" : "bg-card")}>
                  <div className="flex items-center justify-between">
                    <span className="num text-lg font-semibold">{p.powerW} W</span>
                    <StatusBadge status="mock" />
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground">{p.id} · {p.lengthMm}×{p.widthMm} mm</div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b"><CardTitle className="text-sm">Available Area</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="w">Width (m)</Label>
                <Input id="w" type="number" min={1} step={0.5} className="num" value={area.widthM}
                  onChange={(e) => updateArray(project.id, { area: { ...area, widthM: parseFloat(e.target.value || "0") } })} />
                {widthError && <p className="text-xs text-destructive">{widthError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="l">Length (m)</Label>
                <Input id="l" type="number" min={1} step={0.5} className="num" value={area.lengthM}
                  onChange={(e) => updateArray(project.id, { area: { ...area, lengthM: parseFloat(e.target.value || "0") } })} />
                {lengthError && <p className="text-xs text-destructive">{lengthError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Gross Area</Label>
                <Input readOnly className="num bg-muted/50" value={`${fmtNum(area.widthM * area.lengthM, 1)} m²`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between text-sm">Module Specification <StatusBadge status="mock" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MockBanner>Placeholder dimensions from the Panel Library. Real datasheet values will be loaded by the Panel Library Engine.</MockBanner>
            <SpecTable rows={[
              { label: "Model", value: panel.name },
              { label: "Power", value: panel.powerW, unit: "W" },
              { label: "Length", value: panel.lengthMm, unit: "mm" },
              { label: "Width", value: panel.widthMm, unit: "mm" },
              { label: "Thickness", value: panel.thicknessMm, unit: "mm" },
              { label: "Weight", value: panel.weightKg, unit: "kg" },
              { label: "Frame height", value: panel.frame.heightMm, unit: "mm" },
              { label: "Frame width", value: panel.frame.widthMm, unit: "mm" },
              { label: "Frame material", value: panel.frame.material },
              { label: "Clamp zone", value: `${panel.mounting.clampZoneMm[0]}–${panel.mounting.clampZoneMm[1]}`, unit: "mm" },
              { label: "Clamp type", value: panel.mounting.clampType },
              { label: "Mounting holes", value: panel.mounting.mountingHoles },
            ]} />
          </CardContent>
        </Card>
      </div>
      <WorkflowStepper projectId={project.id} step="array" nextDisabled={!valid} />
    </div>
  );
}
