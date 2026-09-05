import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Mail,
  Palette,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Edit,
} from "lucide-react";
import Link from "next/link";

// Dummy Data untuk Cards Statistik
const STAT_CARDS = [
  {
    id: "total-undangan",
    title: "Total Undangan",
    total: "24",
    icon: Mail,
    variant: "default",
  },
  {
    id: "total-tema",
    title: "Total Tema",
    total: "16",
    icon: Palette,
    variant: "default",
  },
  {
    id: "project-selesai",
    title: "Project Selesai",
    total: "21",
    icon: CheckCircle2,
    variant: "default",
  },
  {
    id: "project-belum-selesai",
    title: "Project Belum Selesai",
    total: "3",
    icon: AlertCircle,
    variant: "danger",
  },
];

// Dummy Data Project Belum Selesai
const UNFINISHED_PROJECTS = [
  {
    id: "PRJ-001",
    title: "Undangan Pernikahan Budi & Ani",
    theme: "Adat Jawa Modern",
    client: "Budi Santoso",
    deadline: "12 Sep 2026",
    status: "Drafting Content",
  },
  {
    id: "PRJ-002",
    title: "The Wedding of Reza & Maya",
    theme: "Minimalist Elegance",
    client: "Reza Rahardian",
    deadline: "18 Sep 2026",
    status: "Pending Media RSVP",
  },
  {
    id: "PRJ-003",
    title: "Walimatul Ursy Fikri & Salma",
    theme: "Islamic Floral Gold",
    client: "Fikri Maulana",
    deadline: "25 Sep 2026",
    status: "Revisi Layout Canvas",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Dashboard */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Studio</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Ringkasan statistik dan aktivitas project undangan Anda.
        </p>
      </div>

      {/* ================= 4 CARD STATISTIK ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const isDanger = card.variant === "danger";

          return (
            <Card
              key={card.id}
              className={
                isDanger
                  ? "border-destructive/40 bg-destructive/5 backdrop-blur-sm"
                  : "border-border/50 bg-card/60 backdrop-blur-sm"
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isDanger ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {card.title}
                </CardTitle>
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    isDanger
                      ? "bg-destructive/15 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    isDanger ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {card.total}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ================= DAFTAR PROJECT BELUM SELESAI ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Project Belum Selesai
            </h2>
            <p className="text-xs text-muted-foreground">
              Daftar undangan yang sedang dalam proses pengerjaan atau revisi.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-border/60 text-xs"
          >
            <Link href="/dashboard/undangan">Lihat Semua Undangan</Link>
          </Button>
        </div>

        {/* Tabel Project */}
        <div className="rounded-2xl border border-destructive/30 bg-card/40 backdrop-blur-md overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-destructive/10">
              <TableRow className="hover:bg-transparent border-destructive/20">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Project
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Tema
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Klien
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Deadline
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-right text-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {UNFINISHED_PROJECTS.map((project) => (
                <TableRow
                  key={project.id}
                  className="border-border/30 hover:bg-destructive/5 transition-colors"
                >
                  <TableCell className="font-medium text-xs">
                    <div>
                      <p className="font-semibold text-foreground">
                        {project.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {project.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {project.theme}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {project.client}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="text-amber-500 font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.deadline}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-destructive/40 text-destructive bg-destructive/10 text-[10px] rounded-full"
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg hover:bg-secondary"
                      >
                        <Link href={`/dashboard/undangan/editor/${project.id}`}>
                          <Edit className="h-3.5 w-3.5 opacity-80" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg hover:bg-secondary"
                      >
                        <Link href={`/demo/${project.id}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
