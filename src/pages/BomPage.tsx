import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { MockBanner } from "@/components/common/MockBanner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { WorkflowStepper } from "@/components/layout/WorkflowStepper";
import { deriveBom } from "@/modules/model/derive";
import type { Project } from "@/types";
import { t } from "@/data/strings/en";

export function BomPage({ project }: { project: Project }) {
  const items = deriveBom(project);
  return (
    <div className="space-y-6">
      <PageHeader code="Step 09" title="Bill of Materials" description="Quantities follow the parametric model. Specifications are filled by the design engines." actions={<StatusBadge status="mock" />} />
      <MockBanner>Preliminary BOM — mock. Quantities of members/footings come from placeholder geometry; sections and sizes are TBD until the real engines run.</MockBanner>
      <Card className="py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Specification</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it, i) => (
                <TableRow key={it.item}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</TableCell>
                  <TableCell className="font-medium">{it.item}</TableCell>
                  <TableCell>{it.description}</TableCell>
                  <TableCell className="font-mono text-xs">{it.specification}</TableCell>
                  <TableCell className="num text-right">{it.quantity ?? <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-muted-foreground">{it.unit}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{it.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <WorkflowStepper projectId={project.id} step="bom" />
      <span className="sr-only">{t.nav.bom}</span>
    </div>
  );
}
