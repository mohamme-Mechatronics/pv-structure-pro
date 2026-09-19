import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { SpecTable } from "@/components/common/SpecTable";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";
import { GOVERNORATES } from "@/data/governorates";
import { useProjectStore } from "@/store/projectStore";
import type { Project } from "@/types";
import { fmtDate } from "@/utils/format";
import { t } from "@/data/strings/en";

export function ProjectInfoPage({ project }: { project: Project }) {
  const update = useProjectStore((s) => s.updateProject);
  const valid = project.name.trim().length > 0 && !!project.governorate;

  return (
    <div className="space-y-6">
      <PageHeader code="Step 01" title={t.nav.info} description="Basic project identification. Location is captured at governorate level only." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b"><CardTitle className="text-sm">General</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" value={project.name} onChange={(e) => update(project.id, { name: e.target.value })} placeholder="e.g. Aden Free Zone – 48 kWp" />
            </div>
            <div className="space-y-1.5">
              <Label>Governorate</Label>
              <Select value={project.governorate ?? ""} onValueChange={(v) => update(project.id, { governorate: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select governorate" /></SelectTrigger>
                <SelectContent>
                  {GOVERNORATES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Project Type</Label>
              <Input value={t.projectTypes[project.type]} readOnly className="bg-muted/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b"><CardTitle className="text-sm">Record</CardTitle></CardHeader>
          <CardContent>
            <SpecTable rows={[
              { label: "Project ID", value: project.id },
              { label: "Created", value: fmtDate(project.createdAt) },
              { label: "Modified", value: fmtDate(project.updatedAt) },
              { label: "Status", value: t.status[project.status] },
            ]} />
          </CardContent>
        </Card>
      </div>
      <WorkflowStepper projectId={project.id} step="info" nextDisabled={!valid} />
    </div>
  );
}
