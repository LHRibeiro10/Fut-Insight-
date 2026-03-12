import { Alert, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPageLayout from "@/features/auth/components/AuthPageLayout";
import { useAuth } from "@/features/auth/context/AuthContext";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim().toLowerCase());
}

function isStrongEnough(password) {
  return typeof password === "string" && password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Informe um email valido.");
      return;
    }

    if (!isStrongEnough(form.password)) {
      setError("A senha deve ter ao menos 8 caracteres, com letra e numero.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("As senhas nao conferem.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await register(form);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError?.message || "Nao foi possivel concluir o cadastro.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthPageLayout
      title="Criar conta"
      subtitle="Cadastre-se para salvar seus dados com sessao protegida."
      alternateLabel="Ja tem conta?"
      alternateTo="/login"
    >
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="Nome"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          required
          fullWidth
        />

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
          helperText="Minimo de 8 caracteres, com letra e numero."
          required
          fullWidth
        />

        <TextField
          label="Confirmar senha"
          type="password"
          value={form.confirmPassword}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              confirmPassword: event.target.value,
            }))
          }
          required
          fullWidth
        />

        <Button type="submit" variant="contained" size="large" disabled={submitting}>
          {submitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </Stack>
    </AuthPageLayout>
  );
}
