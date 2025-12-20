import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Bell,
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
  ShieldCheck,
  Copy,
  Share2,
  FileText,
  Download,
  ExternalLink,
  Unlock,
  Lock,
  Star,
  Globe2,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import gridBg from "@assets/generated_images/white_background_with_subtle_blue_grid_pattern.png";
import {
  allowedPackages,
  badgeCounts,
  earningPlans,
  leaderboardData,
  leadershipRanks,
  levelData,
  referralLink,
  vipStars,
  walletSummary,
} from "@/lib/data";

type SectionKey =
  | "profile"
  | "dashboard"
  | "stats"
  | "qr"
  | "wallet"
  | "tether"
  | "directs"
  | "team"
  | "genealogy"
  | "overview";

const rankColors: Record<string, string> = {
  DIAMOND: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white",
  EMERALD: "bg-gradient-to-r from-emerald-500 to-teal-400 text-white",
  GOLD: "bg-gradient-to-r from-yellow-500 to-orange-400 text-white",
  RUBY: "bg-gradient-to-r from-red-500 to-pink-400 text-white",
  SAPPHIRE: "bg-gradient-to-r from-indigo-600 to-purple-500 text-white",
};

const pdfUrl = "/opai.pdf";

const navItems: { icon: any; label: string; path: string; section: SectionKey }[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", section: "dashboard" },
  { icon: Users, label: "Profile", path: "/profile", section: "profile" },
  { icon: TrendingUp, label: "Stats", path: "/stats", section: "stats" },
  { icon: Wallet, label: "Wallets", path: "/wallet", section: "wallet" },
  { icon: Zap, label: "Pay By QR", path: "/qr", section: "qr" },
  { icon: DollarSign, label: "Pay By Topup", path: "/tether", section: "tether" },
  { icon: Target, label: "My Circle", path: "/directs", section: "directs" },
  { icon: Users, label: "Extended Circle", path: "/team", section: "team" },
  { icon: Trophy, label: "Genealogy", path: "/genealogy", section: "genealogy" },
  { icon: BarChart3, label: "Overview", path: "/overview", section: "overview" },
];

function SectionHeader({
  title,
  subtitle,
  extra,
}: {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-heading font-bold text-slate-900">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {extra}
    </div>
  );
}

function CopyField({
  label,
  value,
  onCopy,
  onShare,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  onShare?: () => void;
}) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
      <CardContent className="p-4 flex gap-3 items-center">
        <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-primary font-bold shadow-sm">
          OPAI
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-xs font-semibold text-slate-600">{label}</p>
          <div className="flex items-center gap-2">
            <Input
              value={value}
              readOnly
              className="text-xs font-mono text-slate-800 bg-slate-50 border-slate-200"
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button size="icon" variant="outline" className="h-9 w-9" onClick={onCopy}>
              <Copy className="w-4 h-4" />
            </Button>
            {onShare ? (
              <Button size="icon" variant="outline" className="h-9 w-9" onClick={onShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ section }: { section?: SectionKey }) {
  const [location, navigate] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [payAmounts, setPayAmounts] = useState<{ qr: string; tether: string }>({ qr: "", tether: "" });
  const { toast } = useToast();
  const userId = "#1G0PKFG4";

  const activeSection = useMemo<SectionKey>(() => {
    const found = navItems.find((item) => item.path === location)?.section;
    return section ?? found ?? "dashboard";
  }, [location, section]);

  const copyValue = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied`, description: value });
    } catch (error) {
      console.error(error);
      toast({
        title: "Copy not available",
        description: "Select the text and copy manually.",
        variant: "destructive",
      });
    }
  };

  const shareLink = async (value: string, label: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: label, text: `${label} - ${value}`, url: value });
        return;
      } catch (error) {
        console.error(error);
      }
    }
    copyValue(value, label);
  };

  const goTo = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handlePaySubmit = (type: "qr" | "tether") => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      const amount = parseFloat(payAmounts[type]);
      if (!allowedPackages.includes(amount as any)) {
        toast({
          title: "Pick a valid package",
          description: "Valid packages are 5, 10, 25 and 50 OP CREDITS.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: `${type === "qr" ? "QR" : "Topup"} request staged`,
        description: `We logged your ${amount} OP CREDITS intent. Submit proof in app when ready.`,
      });
    };
  };

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-base shadow-md">
              OP
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-200">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary leading-tight">OPAi</h1>
            <div className="text-sm font-semibold text-slate-700">VIP 00</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const active = activeSection === item.section;
          return (
            <Button
              key={item.label}
              variant={active ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 h-11 rounded-lg text-sm ${
                active ? "bg-slate-100 text-primary font-semibold" : "text-slate-600"
              }`}
              onClick={() => goTo(item.path)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
  const renderLeaderboard = () => (
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
  );

  const renderLevelUnlock = () => (
    <Card className="rounded-3xl border border-slate-200 shadow-lg bg-white overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
        <h3 className="text-lg font-heading font-bold text-slate-900">Level Unlock</h3>
        <p className="text-xs text-slate-600 mt-1">Referrals required</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {levelData.slice(0, 4).map((level) => (
            <div
              key={level.level}
              className={`rounded-lg p-3 border transition-all ${
                level.unlocked
                  ? "bg-emerald-50 border-emerald-200 shadow-sm"
                  : "bg-slate-50 border-slate-200 opacity-80"
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
                  <span className="font-bold text-slate-900">OP {level.netWorth}</span>
                </div>
                {!level.unlocked && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-700">
                      Need {level.referralsNeeded} referrals
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderReferralStrip = () => (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Referral */}
        <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
          <CardContent className="p-4 flex gap-3 items-center">
            <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-primary font-bold shadow-sm">
              OPAI
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold text-slate-600">OpAi Referral Link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 overflow-hidden text-ellipsis">
                  {referralLink}
                </div>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => copyValue(referralLink, "Referral link")}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => shareLink(referralLink, "OpAi Referral")}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Honors */}
        <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-slate-600 mb-3">Honors</p>
            <div className="grid grid-cols-3 gap-3">
              {badgeCounts.map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-inner">
                    <ShieldCheck className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">{badge.label}</span>
                  <span className="text-sm font-bold text-slate-900">{badge.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PDF */}
        <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
          <CardContent className="p-4 flex gap-3 items-center">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-600">OpAi PDF</p>
              <p className="text-[11px] text-slate-600">Presentation PDF — share with your prospects.</p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => window.open(pdfUrl, "_blank")}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" className="h-8 px-3" asChild>
                  <a href={pdfUrl} download>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBadgePanel = () => (
    <Card className="rounded-3xl border border-slate-200 shadow-lg bg-white overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
        <Badge className="bg-primary text-white w-fit mb-2">HONOR RANK</Badge>
        <h3 className="text-lg font-heading font-bold text-slate-900">Current Achievement</h3>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-wrap gap-2">
          {badgeCounts.map((badge) => (
            <Badge
              key={badge.label}
              variant="outline"
              className={`border-slate-200 bg-slate-50 text-[11px] font-bold ${badge.color}`}
            >
              {badge.label} {badge.count}/5
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "GOLD", icon: Crown, className: "text-amber-500", current: true },
            { name: "SAPPHIRE", icon: Diamond, className: "text-sky-600", current: false },
            { name: "EMERALD", icon: Gem, className: "text-emerald-600", current: false },
          ].map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group">
              <div
                className={`relative w-20 h-20 rounded-xl shadow-md group-hover:shadow-lg transition-all bg-slate-50 flex items-center justify-center ${
                  badge.current ? "ring-3 ring-primary ring-offset-2 scale-105" : "opacity-70"
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-inner border border-slate-100">
                  <badge.icon className={`w-8 h-8 ${badge.className}`} strokeWidth={2.2} />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-700 text-center leading-tight">{badge.name}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
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
  );

  const renderBadgeRank = () => (
    <Card className="rounded-3xl border border-slate-200 shadow-lg bg-white overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50">
        <Badge className="bg-primary text-white w-fit mb-2">HONOR RANK</Badge>
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
              <div
                className={`relative w-20 h-20 rounded-xl shadow-md group-hover:shadow-lg transition-all bg-slate-50 flex items-center justify-center ${
                  badge.current ? "ring-3 ring-primary ring-offset-2 scale-105" : "opacity-70"
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-inner border border-slate-100">
                  <badge.icon className={`w-8 h-8 ${badge.className}`} strokeWidth={2.2} />
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
  );

  const renderVipGrowth = () => (
    <div className="grid gap-4 md:grid-cols-2">
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

      {renderLevelUnlock()}
    </div>
  );
  const renderStats = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: TrendingUp, label: "Referrals", value: "3", color: "from-blue-400 to-blue-600" },
          { icon: Users, label: "Extended Circle Size", value: "12", color: "from-emerald-400 to-emerald-600" },
          { icon: Wallet, label: "Total Rewards", value: "OP 1,775", color: "from-purple-400 to-purple-600" },
          { icon: Trophy, label: "Active Level", value: "2", color: "from-orange-400 to-orange-600" },
        ].map((stat, i) => (
          <Card
            key={i}
            className="rounded-2xl border border-slate-200 shadow-md bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pb-6">
        {[
          { icon: Wallet, label: "Personal Contribution", value: "5.00", color: "from-blue-400 to-blue-600" },
          { icon: Gift, label: "Core Circle Contribution", value: "10.00", color: "from-emerald-400 to-emerald-600" },
          { icon: Users, label: "Extended Circle Contribution", value: "60.00", color: "from-purple-400 to-purple-600" },
          { icon: TrendingUp, label: "Total Rewards", value: "3.50", color: "from-orange-400 to-orange-600" },
        ].map((stat, i) => (
          <Card
            key={i}
            className="rounded-2xl border border-slate-200 shadow-md bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
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
    </>
  );

  const renderStatsSection = () => (
    <div className="space-y-6">
      <SectionHeader title="Stats" subtitle="Performance snapshot across referrals, volume, and rewards." />
      {renderStats()}
    </div>
  );

  const renderProfileSection = () => (
    <div className="space-y-6">
      <SectionHeader title="Profile" subtitle="Your account, leadership badges and qualification targets." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Member Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border border-slate-200 shadow-sm">
              <AvatarImage src="https://api.dicebear.com/9.x/avataaars/svg?seed=opai" alt="avatar" />
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-heading font-bold text-slate-900">OPAi Member</p>
              <p className="text-xs text-slate-600">Rank pending</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
                  VIP 00
                </Badge>
                <Badge variant="outline" className="text-xs font-semibold text-slate-700">
                  {userId}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <CopyField
          label="Referral Link"
          value={referralLink}
          onCopy={() => copyValue(referralLink, "Referral link")}
          onShare={() => shareLink(referralLink, "Referral link")}
        />

        <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
          <CardHeader className="pb-2">
          <CardTitle className="text-base">Honors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {badgeCounts.map((badge) => (
                <Badge
                  key={badge.label}
                  variant="outline"
                  className={`border-slate-200 bg-slate-50 text-[11px] font-bold ${badge.color}`}
                >
                  {badge.label} {badge.count}/5
                </Badge>
              ))}
            </div>
            <p className="text-xs text-slate-600">Earn all three traits to unlock leadership ranks.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-base">Ethical Leadership Ladder</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {leadershipRanks.map((rank) => (
            <div key={rank.rank} className="p-3 rounded-lg border border-slate-200 bg-slate-50/80">
              <div className="flex items-center justify-between">
                <Badge className={`${rankColors[rank.rank]} text-[11px] font-bold`}>{rank.rank}</Badge>
                <span className="text-xs font-semibold text-slate-600">{rank.volume} volume</span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-2">{rank.points} points</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {rank.virtues.map((virtue) => (
                  <Badge key={virtue} variant="outline" className="text-[10px] border-slate-200">
                    {virtue}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
  const renderPaySection = (type: "qr" | "tether") => {
    const title = type === "qr" ? "Pay by QR" : "Pay by Topup";
    const description =
      type === "qr"
        ? "Scan-to-pay instructions. Only valid packages are accepted."
        : "Send OP CREDITS using the package options listed.";

    return (
      <div className="space-y-6">
        <SectionHeader
          title={title}
          subtitle={description}
          extra={<Badge variant="outline" className="text-xs">Allowed: {allowedPackages.join(", ")} OP CREDITS</Badge>}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-2xl border border-slate-200 shadow-md bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">{title} Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePaySubmit(type)}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Amount (OP CREDITS)</label>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    value={payAmounts[type]}
                    onChange={(e) => setPayAmounts((prev) => ({ ...prev, [type]: e.target.value }))}
                    placeholder="Choose 5, 10, 25 or 50"
                  />
                  <div className="flex flex-wrap gap-2">
                    {allowedPackages.map((pkg) => (
                      <Button
                        key={pkg}
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setPayAmounts((prev) => ({ ...prev, [type]: String(pkg) }))}
                      >
                        {pkg} OP CREDITS
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Card className="border-dashed">
                    <CardContent className="p-4 space-y-2 text-sm text-slate-700">
                      <p className="font-semibold">Step 1</p>
                      <p>Pick a package, enter the amount, and submit.</p>
                      <p className="text-xs text-slate-500">Based on the PDF rules, only the listed packages qualify for rewards.</p>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed">
                    <CardContent className="p-4 space-y-2 text-sm text-slate-700">
                      <p className="font-semibold">Step 2</p>
                      <p>Upload proof inside the official app after payment.</p>
                      <p className="text-xs text-slate-500">Keep the transaction hash handy for fast approvals.</p>
                    </CardContent>
                  </Card>
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  {type === "qr" ? "Submit QR intent" : "Submit Topup intent"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-base">Package Cheatsheet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                  {earningPlans.map((plan) => (
                    <div key={plan.code} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[11px]">
                            {plan.code}
                          </Badge>
                          <span className="text-xs text-slate-600">Min {plan.min} OP CREDITS</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-slate-500">Potential</p>
                          <p className="text-sm font-semibold text-primary">{plan.totalPotential.toLocaleString()}</p>
                        </div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-600">Totals mirror the earning tables in the PDF; live payouts depend on official approvals.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderWalletSection = () => {
    const { main, topup, token } = walletSummary;

    return (
      <div className="space-y-6">
        <SectionHeader
          title="Wallets"
          subtitle="Track balances across your cash wallets and token holdings (OPPERKS / OP CREDITS)."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[main, topup].map((wallet) => (
            <Card key={wallet.label} className="rounded-2xl border border-slate-200 shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{wallet.label}</span>
                  <Badge variant="outline" className="text-[11px] uppercase">
                    {wallet.currency}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-heading font-bold text-slate-900">
                  {wallet.currency} {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-600">{wallet.note}</p>
              </CardContent>
            </Card>
          ))}

          <Card className="rounded-2xl border border-slate-200 shadow-md bg-white lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{token.label}</span>
                <Badge className="text-[11px]">OPPERKS</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-600">Token balance</p>
                  <p className="text-xl font-heading font-bold text-primary">
                    {token.tokenBalance.toLocaleString()} {token.tokenUnit}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-blue-500 text-white flex items-center justify-center shadow-md">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/80">
                  <p className="text-[11px] text-slate-600 font-semibold">OPPERKS</p>
                  <p className="text-sm font-semibold text-slate-900">{token.tokenBalance.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/80">
                  <p className="text-[11px] text-slate-600 font-semibold">{token.pointsLabel}</p>
                  <p className="text-sm font-semibold text-slate-900">{token.creditAmount.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600">{token.note}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderDirectsSection = () => (
    <div className="space-y-6">
      <SectionHeader title="My Circle" subtitle="Core circle performance from your personally invited members." />
      <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-base">Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          {[
            { label: "My Circle", value: "3", icon: Users },
            { label: "My Circle Volume", value: "OP 75", icon: Wallet },
            { label: "My Circle Rewards", value: "OP 12.25", icon: Gift },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-500 text-white flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-600">{item.label}</p>
                <p className="text-sm font-semibold text-slate-900">{item.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-base">My Circle by VIP track</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {vipStars.map((vip) => (
            <div key={vip.level} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[11px] font-semibold">
                  {vip.level}
                </Badge>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-sm font-semibold text-slate-900 mt-2">{vip.directs} directs</p>
              <p className="text-xs text-slate-600">Extended Circle volume: {vip.team.toLocaleString()}</p>
              <p className="text-xs text-slate-600">OP CREDITS target: {vip.points}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamSection = () => (
    <div className="space-y-6">
      <SectionHeader title="Extended Circle" subtitle="Extended circle contributions and roles." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Extended Members", value: "12", icon: Users },
          { label: "Extended Circle Volume", value: "OP 540", icon: Wallet },
          { label: "Average Ticket", value: "OP 45", icon: Gift },
          { label: "Countries", value: "4", icon: Globe2 },
          { label: "Active Today", value: "7", icon: TrendingUp },
          { label: "Pending KYC", value: "1", icon: ShieldCheck },
        ].map((item) => (
          <Card key={item.label} className="rounded-2xl border border-slate-200 shadow-md bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-500 text-white flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-600">{item.label}</p>
                <p className="text-sm font-semibold text-slate-900">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderGenealogySection = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Genealogy"
        subtitle="Visual network view so you can track who invited whom."
        extra={<Button variant="outline" size="sm" onClick={() => copyValue(referralLink, "Referral link")}>Copy invite link</Button>}
      />
      <Card className="rounded-2xl border border-slate-200 shadow-md bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-slate-700 text-sm">
            <Network className="w-4 h-4" />
            <span>Current depth: 3 levels</span>
          </div>
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900 mb-2">Snapshot</p>
            <ul className="space-y-1 list-disc pl-4">
              <li>Level 1: 3 members</li>
              <li>Level 2: 6 members</li>
              <li>Level 3: 3 members</li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">Genealogy visuals will display here; meanwhile, counts mirror the PDF structure.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <SectionHeader title="Overview" subtitle="High level metrics and plan comparisons." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {earningPlans.map((plan) => (
          <Card key={plan.code} className="rounded-2xl border border-slate-200 shadow-md bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{plan.code}</span>
                <Badge variant="outline" className="text-[11px]">Min {plan.min}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-slate-600">Potential (PDF)</p>
              <p className="text-lg font-heading font-bold text-primary">{plan.totalPotential.toLocaleString()}</p>
              <p className="text-xs text-slate-600">Based on the earning potential charts in English V1.0.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDashboardSection = () => (
    <div className="space-y-6">
      {renderReferralStrip()}
      <div className="grid gap-6 lg:grid-cols-2">
        {renderBadgePanel()}
        {renderLeaderboard()}
        {renderVipGrowth()}
        {renderLevelUnlock()}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "qr":
        return renderPaySection("qr");
      case "tether":
        return renderPaySection("tether");
      case "wallet":
        return renderWalletSection();
      case "directs":
        return renderDirectsSection();
      case "team":
        return renderTeamSection();
      case "genealogy":
        return renderGenealogySection();
      case "overview":
        return renderOverviewSection();
      case "stats":
        return renderStatsSection();
      case "dashboard":
      default:
        return renderDashboardSection();
    }
  };
  return (
    <div className="min-h-screen font-sans bg-white relative overflow-hidden">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${gridBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 flex h-screen overflow-hidden">
        <aside className="hidden lg:block w-60 bg-white border-r border-slate-200 overflow-y-auto shadow-sm">
          <Sidebar />
        </aside>

        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 bg-white w-60 border-r-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <main className="flex-1 flex flex-col overflow-y-auto">
          <header className="h-16 px-6 flex items-center justify-between sticky top-0 bg-white/95 border-b border-slate-200 z-20 shadow-sm">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 hover:bg-slate-200 relative h-9 w-9">
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </Button>
              <Badge
                className="bg-primary text-white cursor-pointer hover:bg-primary/90"
                onClick={() => copyValue(userId, "User ID")}
              >
                {userId}
              </Badge>
            </div>
          </header>

          <div className="p-6 space-y-6 max-w-full overflow-x-hidden">{renderSection()}</div>
        </main>
      </div>
    </div>
  );
}
