import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard section="dashboard" />} />
      <Route path="/profile" component={() => <Dashboard section="profile" />} />
      <Route path="/stats" component={() => <Dashboard section="stats" />} />
      <Route path="/wallet" component={() => <Dashboard section="wallet" />} />
      <Route path="/qr" component={() => <Dashboard section="qr" />} />
      <Route path="/tether" component={() => <Dashboard section="tether" />} />
      <Route path="/directs" component={() => <Dashboard section="directs" />} />
      <Route path="/team" component={() => <Dashboard section="team" />} />
      <Route path="/genealogy" component={() => <Dashboard section="genealogy" />} />
      <Route path="/overview" component={() => <Dashboard section="overview" />} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
