import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ArrayInput, DesignRun, NewProjectInput, Project, StageRun } from "@/types";
import { MOCK_PROJECTS } from "@/data/mockProjects";
import { DESIGN_CONSTANTS, createDefaultDesignConfiguration } from "@/data/designConstants";
import { DESIGN_PIPELINE } from "@/modules/design/pipeline";
import { engineRegistry } from "@/engines/registry";
import { newId } from "@/utils/format";

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  setCurrent: (id: string | null) => void;
  createProject: (input: NewProjectInput) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  updateArray: (id: string, patch: Partial<ArrayInput>) => void;
  selectLayout: (id: string, layoutId: string) => void;
  deleteProject: (id: string) => void;
  runDesign: (id: string) => Promise<void>;
}

const now = () => new Date().toISOString();

const touch = (p: Project, patch: Partial<Project>): Project => ({ ...p, ...patch, updatedAt: now() });

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: MOCK_PROJECTS,
      currentProjectId: null,
      setCurrent: (id) => set({ currentProjectId: id }),

      createProject: (input) => {
        const project: Project = {
          id: newId("prj"),
          name: input.name.trim(),
          type: input.type,
          governorate: input.governorate,
          createdAt: now(),
          updatedAt: now(),
          status: "draft",
          designStatus: "not_generated",
          array: { panelCount: input.panelCount, panelId: input.panelId, area: { ...input.area } },
          // System design constants are stamped automatically — never user input.
          designConfiguration: createDefaultDesignConfiguration(),
          selectedLayoutId: null,
          designRun: null,
        };
        set((s) => ({ projects: [project, ...s.projects], currentProjectId: project.id }));
        return project;
      },

      updateProject: (id, patch) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? touch(p, patch) : p)) })),

      // Changing any array input invalidates the selected layout and any design run:
      // all downstream views derive from the model, so they update automatically.
      updateArray: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? touch(p, {
                  array: { ...p.array, ...patch, area: { ...p.array.area, ...(patch.area ?? {}) } },
                  selectedLayoutId: null,
                  designStatus: p.designRun ? "outdated" : "not_generated",
                  status: p.status === "draft" ? "in_progress" : p.status,
                })
              : p,
          ),
        })),

      selectLayout: (id, layoutId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? touch(p, {
                  selectedLayoutId: layoutId,
                  status: "in_progress",
                  designStatus: p.designRun ? "outdated" : "not_generated",
                })
              : p,
          ),
        })),

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          currentProjectId: s.currentProjectId === id ? null : s.currentProjectId,
        })),

      /**
       * Simulated design run. Each stage resolves its engine from the registry
       * and calls `run()`. All engines are stubs, so nothing is calculated — the
       * mock delay only visualises the pipeline order.
       */
      runDesign: async (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const stages: StageRun[] = DESIGN_PIPELINE.map((s) => ({
          stageId: s.stageId,
          engineId: s.engineId,
          label: s.label,
          state: "queued",
        }));
        const run: DesignRun = { id: newId("run"), startedAt: now(), stages };
        get().updateProject(id, { designRun: run, designStatus: "generating" });

        const upstream: Record<string, unknown> = {};
        for (const stage of DESIGN_PIPELINE) {
          const patchStage = (patch: Partial<StageRun>) => {
            const cur = get().projects.find((p) => p.id === id)?.designRun;
            if (!cur) return;
            get().updateProject(id, {
              designRun: {
                ...cur,
                stages: cur.stages.map((st) => (st.stageId === stage.stageId ? { ...st, ...patch } : st)),
              },
            });
          };
          patchStage({ state: "running" });
          const t0 = Date.now();
          const engine = engineRegistry.get(stage.engineId);
          const latest = get().projects.find((p) => p.id === id)!;
          const result = await engine.run({ project: latest, constants: DESIGN_CONSTANTS, upstream });
          upstream[stage.engineId] = result.output;
          await new Promise((r) => setTimeout(r, stage.mockMs));
          patchStage({ state: "done", durationMs: Date.now() - t0, note: result.notes[0] ?? "" });
        }
        const cur = get().projects.find((p) => p.id === id)?.designRun;
        get().updateProject(id, {
          designRun: cur ? { ...cur, finishedAt: now() } : null,
          designStatus: "generated",
          status: "designed",
        });
      },
    }),
    {
      name: "ssdp-projects-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ projects: s.projects }),
    },
  ),
);

export const useCurrentProject = () =>
  useProjectStore((s) => s.projects.find((p) => p.id === s.currentProjectId) ?? null);

export const useProject = (id: string) => useProjectStore((s) => s.projects.find((p) => p.id === id) ?? null);
