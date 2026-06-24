import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShop } from "@/lib/store";
import { CheckCircle2, Circle, Package, Truck, Home } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sri Venkateshwara Oil Mill" },
      { name: "description", content: "Your orders, payment history and delivery tracking." },
    ],
  }),
  component: Dashboard,
});

const STAGES = ["Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered"] as const;

function Dashboard() {
  const { orders } = useShop();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.date).toDateString() === today);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sales overview, order tracking and payment history.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total Orders" value={orders.length.toString()} />
          <Stat label="Today's Orders" value={todayOrders.length.toString()} />
          <Stat label="Total Revenue" value={`₹${totalRevenue}`} />
          <Stat label="Avg. Order Value" value={`₹${orders.length ? Math.round(totalRevenue / orders.length) : 0}`} />
        </div>

        {/* Orders + tracking */}
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-foreground">My Orders</h2>
          {orders.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No orders yet. Place your first order from the shop.
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              {orders.map((o) => (
                <article key={o.id} className="rounded-2xl border border-border bg-card p-6">
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-sm text-muted-foreground">Order #{o.id}</div>
                      <div className="mt-1 font-serif text-lg text-foreground">{o.customer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.date).toLocaleString()} · {o.paymentMethod}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-primary text-primary-foreground">{o.status}</Badge>
                      <div className="mt-2 font-serif text-2xl font-semibold text-foreground">
                        ₹{o.total}
                      </div>
                    </div>
                  </header>

                  <Tracker status={o.status} />

                  <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                    {o.items.map((i) => (
                      <li key={i.id + i.size} className="flex justify-between rounded-lg bg-muted/50 px-3 py-2">
                        <span className="text-foreground">{i.name} · {i.size} × {i.qty}</span>
                        <span className="text-muted-foreground">₹{i.price * i.qty}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Payment history */}
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-foreground">Payment History</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No payments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.id}</TableCell>
                      <TableCell>{o.customer.name}</TableCell>
                      <TableCell>{o.paymentMethod}</TableCell>
                      <TableCell>{o.customer.city} · {o.customer.pincode}</TableCell>
                      <TableCell>{new Date(o.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-medium">₹{o.total}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-serif text-3xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Tracker({ status }: { status: (typeof STAGES)[number] }) {
  const currentIdx = STAGES.indexOf(status);
  const icons = [CheckCircle2, Package, Truck, Truck, Home];
  return (
    <div className="mt-5 flex items-center gap-2">
      {STAGES.map((s, i) => {
        const Icon = i <= currentIdx ? icons[i] : Circle;
        const active = i <= currentIdx;
        return (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className={`hidden text-xs md:block ${active ? "text-foreground" : "text-muted-foreground"}`}>
              {s}
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-px flex-1 ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}