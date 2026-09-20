import { useNavigate } from "@tanstack/react-router";
import { Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { designConstantRows } from "@/data/designConstants";
import { useProjectStore } from "@/store/projectStore";
import type { Project } from "@/types";
import { t } from "@/data/strings/en";

export function ProjectSettingsPage({ project }: { project: Project }) {
  const update = useProjectStore((s) => s.updateProject);
  const remove = useProjectStore((s) => s.deleteProject);
  const navigate = useNavigate();

  const rows = designConstantRows(project.designConfiguration);
  const groups = Array.from(new Set(rows.map((r) => r.group)));

  return (
    <div className="space-y-6">
      <PageHeader code="Settings" title={t.nav.settings} description="Project options and the read-only system design constants." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-sm"><Lock className="size-3.5 text-muted-foreground" /> Design Constants</CardTitle>
            <p className="text-xs text-muted-foreground">System constants — not editable here. Managed centrally by the engineering system.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {groups.map((g) => (
              <div key={g}>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{g}</div>
                <dl className="divide-y text-sm">
                  {DESIGN_CONSTANT_ROWS.filter((r) => r.group === g).map((r) => (
                    <div key={r.label} className="flex justify-between py-1.5"><dt className="text-muted-foreground">{r.label}</dt><dd className="num">{r.value}</dd></div>
                  ))}
                </dl>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b"><CardTitle className="text-sm">Project</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              <Label htmlFor="pname">Project Name</Label>
              <Input id="pname" value={project.name} onChange={(e) => update(project.id, { name: e.target.value })} />
            </CardContent>
          </Card>
          <Card className="border-destructive/40">
            <CardHeader className="border-b"><CardTitle className="text-sm text-destructive">Danger Zone</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">Permanently delete this project and its design run.</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm"><Trash2 className="size-4" /> {t.common.delete}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete “{project.name}”?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { remove(project.id); navigate({ to: "/" }); }}>{t.common.delete}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
