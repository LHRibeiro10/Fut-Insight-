import { Alert, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPageLayout from "@/features/auth/components/AuthPageLayout";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("Preencha email e senha.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await login(form);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError?.message || "Nao foi possivel entrar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageLayout
      title="Entrar"
      subtitle="Acesse seu Fut-Insight com email e senha."
      alternateLabel="Nao tem conta?"
      alternateTo="/register"
    >
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          required
          fullWidth
        />

        <TextField
          label="Senha"
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          required
          fullWidth
        />

        <Button type="submit" variant="contained" size="large" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
      </Stack>
    </AuthPageLayout>
  );
}
