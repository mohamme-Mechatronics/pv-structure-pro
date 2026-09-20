import { SpecTable } from "@/components/common/SpecTable";
import { getPanel } from "@/data/panelLibrary";
import { getSelectedLayout } from "@/modules/model/derive";
import type { NewProjectInput, Project } from "@/types";
import { t } from "@/data/strings/en";
import { fmtNum } from "@/utils/format";

type SummarySource = Project | NewProjectInput;

const isProject = (s: SummarySource): s is Project => "array" in s;

/**
 * Reusable project summary. Reads only from the parametric project model
 * (or the equivalent wizard payload before the project exists).
 */
export function ProjectSummary({ project }: { project: SummarySource }) {
  const panelId = isProject(project) ? project.array.panelId : project.panelId;
  const panelCount = isProject(project) ? project.array.panelCount : project.panelCount;
  const area = isProject(project) ? project.array.area : project.area;
  const layout = isProject(project) ? getSelectedLayout(project) : null;
  const status = isProject(project) ? project.status : "draft";
  const panel = getPanel(panelId);

  return (
    <SpecTable
      rows={[
        { label: "Project Name", value: project.name || "—" },
        { label: "Project Type", value: t.projectTypes[project.type] },
        { label: "Governorate", value: project.governorate || "—" },
        { label: "Panel Count", value: panelCount },
        { label: "Panel Power", value: panel.powerW, unit: "W" },
        { label: "Available Area", value: `${fmtNum(area.widthM, 1)} × ${fmtNum(area.lengthM, 1)}`, unit: "m" },
        { label: "Selected Layout", value: layout?.label ?? "—" },
        { label: "Project Status", value: t.status[status] },
      ]}
    />
  );
}
