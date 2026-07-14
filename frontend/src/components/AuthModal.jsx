import { ShieldCheck, Store, UserRound, X } from "lucide-react";
import { useState } from "react";

const roles = [
  { value: "USER", label: "User", icon: UserRound },
  { value: "SELLER", label: "Seller", icon: Store },
  { value: "ADMIN", label: "Admin", icon: ShieldCheck },
];

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

function AuthModal({ initialMode, onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("USER");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    const endpoint = mode === "login" ? "/api/auth/log-in" : "/api/auth/sign-up";
    const payload = mode === "login"
      ? { email: form.email, password: form.password }
      : form;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Authentication failed");
      if (mode === "login" && result.data?.role !== role) {
        throw new Error(`This account is registered as ${result.data?.role || "another role"}.`);
      }
      setStatus({ type: "success", message: result.message });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not reach the backend." });
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setRole("USER");
    setStatus({ type: "", message: "" });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close authentication"><X size={20} /></button>
        <h2 id="auth-title">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="modal-intro">
          {mode === "login" ? "Choose how you use Mercato, then continue." : "Every new account starts as a marketplace user."}
        </p>

        {mode === "login" ? (
          <div className="role-grid" aria-label="Choose account role">
            {roles.map(({ value, label, icon: Icon }) => (
              <button key={value} className={role === value ? "role-option active" : "role-option"} onClick={() => setRole(value)}>
                <Icon size={21} /><span>{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="seller-note"><Store size={19} /><p>Want to sell? Sign up as a user first, then submit a seller application for admin approval.</p></div>
        )}

        <form onSubmit={submit}>
          {mode === "signup" ? <label>Full name<input name="name" value={form.name} onChange={updateField} placeholder="Your name" required /></label> : null}
          <label>Email<input type="email" name="email" value={form.email} onChange={updateField} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={updateField} placeholder="At least 8 characters" required /></label>
          {mode === "signup" ? <label>Confirm password<input type="password" name="confirmPassword" value={form.confirmPassword} onChange={updateField} placeholder="Repeat your password" required /></label> : null}
          {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : null}
          <button className="button primary full" disabled={submitting}>{submitting ? "Please wait..." : mode === "login" ? `Log in as ${role.toLowerCase()}` : "Create user account"}</button>
        </form>
        <p className="mode-switch">
          {mode === "login" ? "New to Mercato?" : "Already have an account?"}
          <button onClick={() => switchMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Sign up" : "Log in"}</button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
