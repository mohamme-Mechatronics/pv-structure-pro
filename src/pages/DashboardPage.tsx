import { Link, useNavigate } from "@tanstack/react-router";
import { FolderPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useProjectStore } from "@/store/projectStore";
import { deriveArrayPowerW } from "@/modules/model/derive";
import { engineRegistry } from "@/engines/registry";
import { fmtKWp, fmtRelative } from "@/utils/format";
import { t } from "@/data/strings/en";

export function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const setCurrent = useProjectStore((s) => s.setCurrent);
  const navigate = useNavigate();

  const totalPanels = projects.reduce((a, p) => a + p.array.panelCount, 0);
  const totalW = projects.reduce((a, p) => a + deriveArrayPowerW(p), 0);
  const designed = projects.filter((p) => p.designStatus === "generated").length;
  const engines = engineRegistry.list();

  const open = (id: string) => {
    setCurrent(id);
    navigate({ to: "/projects/$projectId/info", params: { projectId: id } });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        code="Workspace"
        title={t.nav.dashboard}
        description="Overview of solar structure projects and engine status."
        actions={
          <Button asChild>
            <Link to="/projects/new">
              <FolderPlus className="size-4" /> {t.nav.newProject}
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Projects" value={projects.length} />
        <Stat label="PV Panels" value={totalPanels.toLocaleString()} sub={fmtKWp(totalW)} />
        <Stat label="Designs Generated" value={designed} sub={`${projects.length - designed} pending`} />
        <Stat label="Engines" value={`${engines.filter((e) => e.implStatus === "ready").length} / ${engines.length}`} sub="active / registered" />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-sm font-semibold">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Governorate</TableHead>
                <TableHead className="text-right">Panels</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead>Design</TableHead>
                <TableHead className="hidden md:table-cell">Modified</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => open(p.id)}>
                  <TableCell className="font-medium">
                    <div className="truncate">{p.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{p.id}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{t.projectTypes[p.type]}</TableCell>
                  <TableCell className="hidden lg:table-cell">{p.governorate ?? "—"}</TableCell>
                  <TableCell className="num text-right">{p.array.panelCount}</TableCell>
                  <TableCell className="hidden sm:table-cell"><StatusBadge status={p.status} /></TableCell>
                  <TableCell><StatusBadge status={p.designStatus} /></TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{fmtRelative(p.updatedAt)}</TableCell>
                  <TableCell className="text-right"><ArrowRight className="size-4 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No projects yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b"><CardTitle className="text-sm font-semibold">Engine Registry</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-x-6 gap-y-1 p-4 text-xs sm:grid-cols-2 lg:grid-cols-3">
          {engines.map((e) => (
            <div key={e.id} className="flex items-center justify-between border-b py-1.5 last:border-0">
              <span>{e.name}</span>
              <span className="font-mono text-[10px] uppercase text-muted-foreground">{e.implStatus} · {e.version}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card className="gap-1 py-4">
      <CardContent className="px-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="num mt-1 text-2xl font-semibold">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}
