import { useState, type FormEvent } from 'react';
import {
  useDirectusAuth,
  type AuthMode,
} from '../../hooks/useDirectusAuth';

interface Props {
  autoLoginAfterSignup?: boolean;
  formId: string;
  mode: AuthMode;
  redirectTo: string;
  submitLabel: string;
}

interface FieldErrors {
  email?: string;
  firstName?: string;
  password?: string;
}

export default function AuthForm({
  autoLoginAfterSignup = true,
  formId,
  mode,
  redirectTo,
  submitLabel,
}: Props) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { authenticate, message, status } = useDirectusAuth({
    autoLoginAfterSignup,
  });
  const isSignup = mode === 'signup';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    const normalizedEmail = email.trim();
    const normalizedFirstName = firstName.trim();

    if (isSignup && !normalizedFirstName) {
      nextErrors.firstName = 'Введите имя.';
    }

    if (!normalizedEmail) {
      nextErrors.email = 'Введите email.';
    }

    if (!password) {
      nextErrors.password = 'Введите пароль.';
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await authenticate(
      mode,
      isSignup
        ? {
            email: normalizedEmail,
            firstName: normalizedFirstName,
            password,
          }
        : {
            email: normalizedEmail,
            password,
          }
    );

    if (result.authenticated) {
      window.location.replace(redirectTo);
    }
  };

  return (
    <form
      className="auth-form"
      id={formId}
      onSubmit={handleSubmit}
      noValidate
    >
      {isSignup && (
        <label>
          <span>Имя</span>
          <input
            type="text"
            id={`${formId}-first-name`}
            name="first_name"
            autoComplete="given-name"
            aria-invalid={Boolean(fieldErrors.firstName)}
            aria-describedby={`${formId}-first-name-error`}
            aria-required="true"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <span id={`${formId}-first-name-error`}>
            {fieldErrors.firstName}
          </span>
        </label>
      )}

      <label>
        <span>Email</span>
        <input
          type="email"
          id={`${formId}-email`}
          name="email"
          autoComplete="email"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={`${formId}-email-error`}
          aria-required="true"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <span id={`${formId}-email-error`}>{fieldErrors.email}</span>
      </label>

      <label>
        <span>Пароль</span>
        <input
          type="password"
          id={`${formId}-password`}
          name="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={`${formId}-password-error`}
          aria-required="true"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <span id={`${formId}-password-error`}>
          {fieldErrors.password}
        </span>
      </label>

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Отправка...' : submitLabel}
      </button>

      {message && (
        <p
          className={
            status === 'success'
              ? 'auth-form__success'
              : 'auth-form__error'
          }
          role={status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}
