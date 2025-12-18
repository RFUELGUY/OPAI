import { useState } from "react";
import { useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Bell, 
  Search, 
  Menu,
  TrendingUp,
  Wallet,
  Gift,
  Trophy,
  Zap,
  DollarSign,
  Target,
  Crown,
  Diamond,
  Gem,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import gridBg from "@assets/generated_images/white_background_with_subtle_blue_grid_pattern.png";

const leaderboardData = [
  { sr: 1, userId: "USER1001", rank: "DIAMOND", vipLevel: 1 },
  { sr: 2, userId: "USER1002", rank: "EMERALD", vipLevel: 1 },
  { sr: 3, userId: "USER1003", rank: "GOLD", vipLevel: 2 },
  { sr: 4, userId: "USER1004", rank: "RUBY", vipLevel: 1 },
  { sr: 5, userId: "USER1005", rank: "SAPPHIRE", vipLevel: 3 },
];

const rankColors: { [key: string]: string } = {
  DIAMOND: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white",
  EMERALD: "bg-gradient-to-r from-emerald-500 to-teal-400 text-white",
  GOLD: "bg-gradient-to-r from-yellow-500 to-orange-400 text-white",
  RUBY: "bg-gradient-to-r from-red-500 to-pink-400 text-white",
  SAPPHIRE: "bg-gradient-to-r from-indigo-600 to-purple-500 text-white",
};

const levelData = [
  { level: 1, bonus: "35.0%", network: 10, netWorth: 18, referralsNeeded: 1, unlocked: true },
  { level: 2, bonus: "10.0%", network: 20, netWorth: 10, referralsNeeded: 2, unlocked: true },
  { level: 3, bonus: "5.0%", network: 40, netWorth: 10, referralsNeeded: 3, unlocked: false },
  { level: 4, bonus: "4.0%", network: 80, netWorth: 16, referralsNeeded: 4, unlocked: false },
  { level: 5, bonus: "3.0%", network: 160, netWorth: 24, referralsNeeded: 5, unlocked: false },
];

export default function Dashboard() {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              OP
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200">
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-primary leading-tight">OPAi</h1>
            <div className="text-[11px] font-semibold text-slate-600">VIP 00</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {[
          { icon: Users, label: "Profile", path: "/" },
          { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
          { icon: Zap, label: "Pay By QR", path: "/qr" },
          { icon: DollarSign, label: "Pay By Tether", path: "/tether" },
          { icon: Target, label: "Core Circle", path: "/directs" },
          { icon: Users, label: "Extended Circle", path: "/team" },
          { icon: Trophy, label: "Genealogy", path: "/genealogy" },
          { icon: BarChart3, label: "Overview", path: "/overview" },
        ].map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 h-11 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-100 transition-all duration-200 text-sm"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-white relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${gridBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 bg-white border-r border-slate-200 overflow-y-auto shadow-sm">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 bg-white w-60 border-r-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="h-16 px-6 flex items-center justify-between sticky top-0 bg-white/95 border-b border-slate-200 z-20 shadow-sm">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden" 
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 hover:bg-slate-200 relative h-9 w-9">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </Button>
              <Badge className="bg-primary text-white cursor-pointer hover:bg-primary/90">#1G0PKFG4</Badge>
            </div>
          </header>

          <div className="p-6 space-y-6 max-w-full overflow-x-hidden">
            {/* 2x2 GRID LAYOUT */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* TOP-LEFT: BADGE RANK */}
              <Card className="rounded-3xl border border-slate-200 shadow-lg bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
                  <Badge className="bg-primary text-white w-fit mb-2">BADGE RANK</Badge>
                  <h3 className="text-lg font-heading font-bold text-slate-900">Current Achievement</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { name: "GOLD", icon: Crown, className: "text-amber-500", current: true },
                      { name: "SAPPHIRE", icon: Diamond, className: "text-sky-600", current: false },
                      { name: "EMERALD", icon: Gem, className: "text-emerald-600", current: false },
                    ].map((badge, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group">
                        <div className={`relative w-20 h-20 rounded-xl shadow-md group-hover:shadow-lg transition-all bg-slate-50 flex items-center justify-center ${badge.current ? 'ring-3 ring-primary ring-offset-2 scale-105' : 'opacity-70'}`}>
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-inner border border-slate-100">
                            <badge.icon
                              className={`w-8 h-8 ${badge.className}`}
                              strokeWidth={2.2}
                            />
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-700 text-center leading-tight">{badge.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Volume</span>
                        <span className="font-bold text-primary">60/1000</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                        <div className="h-full w-1/6 bg-gradient-to-r from-primary to-blue-400 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Points</span>
                        <span className="font-bold text-primary">0/5</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                        <div className="h-full w-0 bg-gradient-to-r from-primary to-blue-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* TOP-RIGHT: LEADERBOARD */}
              <Card className="rounded-3xl border border-slate-200 shadow-lg bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-slate-900">Top Leaders</h3>
                      <p className="text-xs text-slate-600 mt-1">5 Members</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
                    {leaderboardData.map((user, idx) => (
                      <div
                        key={idx}
                        className="px-5 py-3 flex items-center justify-between text-sm hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                            {idx + 1}
                          </div>
                          <p className="font-semibold text-slate-900 text-xs">{user.userId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${rankColors[user.rank]} text-xs font-bold px-2 py-0.5 rounded-full`}>
                            {user.rank}
                          </Badge>
                          <Crown className="w-3 h-3 text-yellow-500" />
                          <span className="font-bold text-slate-900 text-xs">V{user.vipLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* BOTTOM-LEFT: VIP RANK */}
              <Card className="rounded-3xl border border-slate-200 shadow-lg bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-lg font-heading font-bold text-slate-900">VIP Growth</h3>
                  <Badge className="bg-primary text-white text-xs w-fit mt-2">VIP 00</Badge>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center gap-5">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="55" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="55"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="10"
                        strokeDasharray="0 345"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(219, 59%, 32%)" />
                          <stop offset="100%" stopColor="#4a6fa5" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-heading font-bold text-slate-900">00</p>
                      <p className="text-xs text-slate-600 font-bold">LEVEL</p>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((vip) => (
                      <Button
                        key={vip}
                        size="sm"
                        className={`rounded-lg h-10 text-xs font-bold transition-all ${
                          vip === 1
                            ? "bg-gradient-to-r from-primary to-blue-500 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        VIP 0{vip}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* BOTTOM-RIGHT: LEVEL UNLOCK */}
              <Card className="rounded-3xl border border-slate-200 shadow-lg bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-lg font-heading font-bold text-slate-900">Level Unlock</h3>
                  <p className="text-xs text-slate-600 mt-1">Referrals Required</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {levelData.slice(0, 4).map((level) => (
                      <div
                        key={level.level}
                        className={`rounded-lg p-3 border transition-all ${
                          level.unlocked
                            ? "bg-emerald-50 border-emerald-200 shadow-sm"
                            : "bg-slate-50 border-slate-200 opacity-70"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-slate-900">L{level.level}</h4>
                          {level.unlocked ? (
                            <Unlock className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Bonus:</span>
                            <span className="font-bold text-primary">{level.bonus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Net:</span>
                            <span className="font-bold text-slate-900">${level.netWorth}</span>
                          </div>
                          {!level.unlocked && (
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs font-semibold text-slate-700">
                                Need {level.referralsNeeded} ref
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* STATS BENEATH THE GRID */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: TrendingUp, label: "Referrals", value: "3", color: "from-blue-400 to-blue-600" },
                { icon: Users, label: "Extended Circle Size", value: "12", color: "from-emerald-400 to-emerald-600" },
                { icon: Wallet, label: "Total Rewards", value: "$1,775", color: "from-purple-400 to-purple-600" },
                { icon: Trophy, label: "Active Level", value: "2", color: "from-orange-400 to-orange-600" },
              ].map((stat, i) => (
                <Card key={i} className="rounded-2xl border border-slate-200 shadow-md bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-600 font-semibold">{stat.label}</p>
                      <p className="text-lg font-bold text-slate-900 truncate">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contribution / Rewards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pb-6">
              {[
                { icon: Wallet, label: "Personal Contribution", value: "5.00", color: "from-blue-400 to-blue-600" },
                { icon: Gift, label: "Core Circle Contribution", value: "10.00", color: "from-emerald-400 to-emerald-600" },
                { icon: Users, label: "Extended Circle Contribution", value: "60.00", color: "from-purple-400 to-purple-600" },
                { icon: TrendingUp, label: "Total Rewards", value: "3.50", color: "from-orange-400 to-orange-600" },
              ].map((stat, i) => (
                <Card key={i} className="rounded-2xl border border-slate-200 shadow-md bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-600 font-semibold mb-1">{stat.label}</p>
                        <p className="text-xl font-heading font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
