import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { sidebarMenu } from "@/config/menu";
import { Button } from "@/components/ui/button";

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            HRIS Platform
          </h2>
          <div className="space-y-1">
            {sidebarMenu.map((item) => (
              <Button
                key={item.href}
                variant={
                  location.pathname === item.href ? "secondary" : "ghost"
                }
                className="w-full justify-start"
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
