import { useCallback, useState } from 'react';
import { isDirectusError, registerUser } from '@directus/sdk';
import { directus } from '../lib/directus';

export type AuthMode = 'login' | 'signup';
export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials extends LoginCredentials {
  firstName: string;
}

export interface AuthenticationResult {
  authenticated: boolean;
  succeeded: boolean;
}

interface UseDirectusAuthOptions {
  autoLoginAfterSignup?: boolean;
}

interface UseDirectusAuthResult {
  authenticate: (
    mode: AuthMode,
    credentials: LoginCredentials | RegistrationCredentials
  ) => Promise<AuthenticationResult>;
  message: string;
  status: AuthStatus;
}

const errorMessages: Record<string, string> = {
  FAILED_VALIDATION: 'Проверьте правильность заполнения полей.',
  INVALID_CREDENTIALS: 'Неверный email или пароль.',
  INVALID_PAYLOAD: 'Проверьте правильность заполнения полей.',
  RECORD_NOT_UNIQUE: 'Аккаунт с таким email уже существует.',
  USER_SUSPENDED: 'Доступ к аккаунту приостановлен.',
};

function getRequestErrorMessage(error: unknown): string {
  if (isDirectusError(error)) {
    const directusError = error.errors[0];
    const code = directusError?.extensions.code;

    if (code && errorMessages[code]) {
      return errorMessages[code];
    }

    return directusError?.message || 'Не удалось выполнить запрос.';
  }

  if (
    error instanceof Error &&
    error.message === 'Directus did not return an access token.'
  ) {
    return 'Directus не вернул токен авторизации.';
  }

  return 'Не удалось связаться с Directus. Попробуйте ещё раз.';
}

export function useDirectusAuth({
  autoLoginAfterSignup = true,
}: UseDirectusAuthOptions = {}): UseDirectusAuthResult {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [message, setMessage] = useState('');

  const authenticate = useCallback(
    async (
      mode: AuthMode,
      credentials: LoginCredentials | RegistrationCredentials
    ): Promise<AuthenticationResult> => {
      setStatus('loading');
      setMessage('');

      try {
        if (mode === 'signup') {
          const registration =
            credentials as RegistrationCredentials;

          await directus.request(
            registerUser(
              registration.email,
              registration.password,
              {
                first_name: registration.firstName,
              }
            )
          );

          if (!autoLoginAfterSignup) {
            setStatus('success');
            setMessage(
              'Аккаунт создан. Проверьте почту и подтвердите регистрацию.'
            );

            return {
              authenticated: false,
              succeeded: true,
            };
          }
        }

        const authData = await directus.login(
          {
            email: credentials.email,
            password: credentials.password,
          },
          {
            mode: 'json',
          }
        );

        if (!authData.access_token) {
          throw new Error('Directus did not return an access token.');
        }

        setStatus('success');
        setMessage(
          mode === 'signup'
            ? 'Аккаунт создан. Выполняется вход...'
            : 'Вход выполнен...'
        );

        return {
          authenticated: true,
          succeeded: true,
        };
      } catch (error) {
        setStatus('error');
        setMessage(getRequestErrorMessage(error));

        return {
          authenticated: false,
          succeeded: false,
        };
      }
    },
    [autoLoginAfterSignup]
  );

  return {
    authenticate,
    message,
    status,
  };
}
