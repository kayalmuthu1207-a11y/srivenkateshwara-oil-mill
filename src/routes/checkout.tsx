import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useShop, type Order } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Sri Venkateshwara Oil Mill" },
      { name: "description", content: "Review your cart and complete your order." },
    ],
  }),
  component: Checkout,
});

const PAYMENT_METHODS = [
  "UPI / Google Pay",
  "PhonePe",
  "Paytm",
  "Debit / Credit Card",
  "Net Banking",
  "Cash on Delivery",
];

function Checkout() {
  const { cart, updateQty, removeFromCart, placeOrder } = useShop();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payment, setPayment] = useState(PAYMENT_METHODS[0]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round((subtotal * discountPct) / 100);
  const taxable = subtotal - discount;
  const gst = Math.round(taxable * 0.05);
  const shipping = taxable === 0 ? 0 : taxable > 999 ? 0 : 60;
  const total = taxable + gst + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SVOM10") {
      setDiscountPct(10);
      toast.success("Coupon applied — 10% off");
    } else {
      setDiscountPct(0);
      toast.error("Invalid coupon code");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const order: Order = {
      id: "SVOM-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      date: new Date().toISOString(),
      customer: {
        name: form.name,
        mobile: form.mobile,
        address: form.address + (form.landmark ? `, ${form.landmark}` : ""),
        city: form.city,
        pincode: form.pincode,
      },
      items: cart,
      subtotal,
      gst,
      shipping,
      total,
      paymentMethod: payment,
      status: "Confirmed",
    };
    placeOrder(order);
    toast.success(`Order ${order.id} placed successfully`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your cart, share delivery details and complete your order.
        </p>

        {cart.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-4">
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              {/* Cart items */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Your cart</h2>
                <ul className="mt-4 divide-y divide-border">
                  {cart.map((item) => (
                    <li key={item.id + item.size} className="flex gap-4 py-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--cream)]">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-foreground">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.size}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-border">
                            <button type="button" onClick={() => updateQty(item.id, item.size, item.qty - 1)} className="h-8 w-8">−</button>
                            <span className="w-6 text-center text-sm">{item.qty}</span>
                            <button type="button" onClick={() => updateQty(item.id, item.size, item.qty + 1)} className="h-8 w-8">+</button>
                          </div>
                          <div className="font-medium text-foreground">₹{item.price * item.qty}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex gap-2">
                  <Input
                    placeholder="Coupon code (try SVOM10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={applyCoupon}>Apply</Button>
                </div>
              </section>

              {/* Delivery */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Delivery details</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="Full Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label="Mobile Number" required value={form.mobile} onChange={(v) => setForm({ ...form, mobile: v })} />
                  <div className="md:col-span-2">
                    <Field label="Delivery Address" required value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
                  </div>
                  <Field label="Landmark" value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} />
                  <Field label="City" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                  <Field label="State" required value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
                  <Field label="Pincode" required value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
                </div>
              </section>

              {/* Payment */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Payment method</h2>
                <RadioGroup value={payment} onValueChange={setPayment} className="mt-4 grid gap-3 md:grid-cols-2">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                        payment === m ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value={m} id={m} />
                      <span className="text-sm text-foreground">{m}</span>
                    </label>
                  ))}
                </RadioGroup>
              </section>
            </div>

            {/* Summary */}
            <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl text-foreground">Order Summary</h2>
              <Row label="Subtotal" value={`₹${subtotal}`} />
              {discount > 0 && <Row label={`Discount (${discountPct}%)`} value={`− ₹${discount}`} />}
              <Row label="GST (5%)" value={`₹${gst}`} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : `₹${shipping}`} />
              <div className="h-px bg-border" />
              <Row label="Total" value={`₹${total}`} bold />
              <Button type="submit" className="w-full" size="lg">
                Place Order
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Secure checkout · Invoice generated automatically
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
        {required && " *"}
      </Label>
      <Input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm ${bold ? "text-base font-semibold text-foreground" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "font-serif text-xl text-foreground" : "text-foreground"}>{value}</span>
    </div>
  );
}