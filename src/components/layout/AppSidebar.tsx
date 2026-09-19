import { Link, useRouterState } from "@tanstack/react-router";
import { FolderPlus, LayoutDashboard, Hexagon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { WORKFLOW_STEPS } from "@/modules/workflow/steps";
import { useProjectStore } from "@/store/projectStore";
import { t } from "@/data/strings/en";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentId = useProjectStore((s) => s.currentProjectId);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-12 justify-center border-b px-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <Hexagon className="size-4" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">{t.app.short}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{t.app.version}</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.nav.workspace}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"} tooltip={t.nav.dashboard}>
                  <Link to="/">
                    <LayoutDashboard />
                    <span>{t.nav.dashboard}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/projects/new"} tooltip={t.nav.newProject}>
                  <Link to="/projects/new">
                    <FolderPlus />
                    <span>{t.nav.newProject}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t.nav.project}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {WORKFLOW_STEPS.map((step, i) => {
                const active = currentId ? pathname === step.to.replace("$projectId", currentId) : false;
                return (
                  <SidebarMenuItem key={step.key}>
                    {currentId ? (
                      <SidebarMenuButton asChild isActive={active} tooltip={step.label}>
                        <Link to={step.to} params={{ projectId: currentId }}>
                          <step.icon />
                          <span className="flex-1 truncate">{step.label}</span>
                          {step.inWorkflow && (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton disabled tooltip={t.common.noProject} className="opacity-50">
                        <step.icon />
                        <span>{step.label}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("border-t px-3 py-2 font-mono text-[10px] text-muted-foreground", collapsed && "hidden")}>
        Engines: 15 registered · 0 active
      </SidebarFooter>
    </Sidebar>
  );
}
