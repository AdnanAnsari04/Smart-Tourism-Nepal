import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CulturalBackdrop from "../components/CulturalBackdrop";
import "../styles/dashboard.css";
import "../styles/payment.css";

const PENDING_ITEMS = [
  { label: "Hotel Barahi — Pokhara", detail: "Deluxe lake-view room · 12–14 Sep · 2 guests · free cancellation", amount: 17000 },
  { label: "Poon Hill guide package", detail: "Guide, permits, transport from Pokhara", amount: 24500 },
];

type MethodKey = "esewa" | "khalti" | "imepay" | "connectips" | "card";

const METHODS: { key: MethodKey; label: string; sub: string; badgeClass: string }[] = [
  { key: "esewa", label: "eSewa", sub: "Digital wallet", badgeClass: "pm-badge-esewa" },
  { key: "khalti", label: "Khalti", sub: "Digital wallet", badgeClass: "pm-badge-khalti" },
  { key: "imepay", label: "IME Pay", sub: "Digital wallet", badgeClass: "pm-badge-imepay" },
  { key: "connectips", label: "ConnectIPS", sub: "Any Nepali bank", badgeClass: "pm-badge-connectips" },
  { key: "card", label: "Card", sub: "Visa · Mastercard", badgeClass: "pm-badge-card" },
];

export default function Payment() {
  const [method, setMethod] = useState<MethodKey>("esewa");
  const [walletNumber, setWalletNumber] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const total = PENDING_ITEMS.reduce((sum, i) => sum + i.amount, 0);
  const isWallet = method === "esewa" || method === "khalti" || method === "imepay";

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dash-main">
        <CulturalBackdrop variant="light" />
        <div className="dash-header">
          <div>
            <h1>Review &amp; pay</h1>
            <p>A preview of checkout — connects to a live gateway once the backend's Payment Service is ready.</p>
          </div>
        </div>
        <div className="horizon-divider" />

        {confirmed ? (
          <section className="payment-success-card">
            <p className="payment-success-icon" aria-hidden="true">✓</p>
            <h2>Payment request saved</h2>
            <p>
              This preview recorded your checkout selection locally. Once the gateway is connected, this step will
              process a real transaction and return a confirmation.
            </p>
            <Link to="/bookings" className="payment-back-link">View your bookings →</Link>
          </section>
        ) : (
          <>
            <section className="payment-card">
              <h2>Pending checkout</h2>
              {PENDING_ITEMS.map((item) => (
                <div className="payment-line" key={item.label}>
                  <div>
                    <p className="payment-line-title">{item.label}</p>
                    <p className="payment-line-detail">{item.detail}</p>
                  </div>
                  <strong>NPR {item.amount.toLocaleString()}</strong>
                </div>
              ))}
              <div className="payment-line payment-line-total">
                <span>Total due</span>
                <strong>NPR {total.toLocaleString()}</strong>
              </div>
            </section>

            <section className="payment-card">
              <h2>Payment method</h2>
              <div className="payment-methods-grid">
                {METHODS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    className={`payment-method-card ${method === m.key ? "is-active" : ""}`}
                    onClick={() => setMethod(m.key)}
                    aria-pressed={method === m.key}
                  >
                    <span className={`pm-badge ${m.badgeClass}`}>{m.label}</span>
                    <span className="pm-sub">{m.sub}</span>
                  </button>
                ))}
              </div>

              {isWallet && (
                <div className="payment-detail-row">
                  <label htmlFor="wallet-number">Registered mobile number</label>
                  <input
                    id="wallet-number"
                    type="tel"
                    inputMode="numeric"
                    placeholder="98XXXXXXXX"
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                  />
                  <p className="payment-detail-hint">
                    You'll be redirected to {METHODS.find((m) => m.key === method)?.label} to confirm this payment.
                  </p>
                </div>
              )}

              {method === "connectips" && (
                <div className="payment-detail-row">
                  <p className="payment-detail-hint">
                    ConnectIPS lets you pay directly from any participating Nepali bank account. You'll choose your
                    bank on the next screen once the gateway is connected.
                  </p>
                </div>
              )}

              {method === "card" && (
                <div className="payment-detail-row payment-card-fields">
                  <div>
                    <label htmlFor="card-number">Card number</label>
                    <input id="card-number" type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="payment-card-fields-split">
                    <div>
                      <label htmlFor="card-expiry">Expiry</label>
                      <input id="card-expiry" type="text" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label htmlFor="card-cvv">CVV</label>
                      <input id="card-cvv" type="text" inputMode="numeric" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              <button type="button" className="payment-confirm-btn" onClick={() => setConfirmed(true)}>
                Pay NPR {total.toLocaleString()}
              </button>
              <p className="payment-security-note">
                🔒 No card or wallet details are stored by this frontend — payment is handled entirely by the
                selected provider over a secure connection.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
