// Frontend Authentication Service for Al Fouad Pharmacies WhatsApp Campaign Manager

const AUTH_STORAGE_KEY = 'al_fouad_campaign_auth_session';
const REMEMBER_KEY = 'al_fouad_campaign_remember_user';

export interface AuthUser {
  username: string;
  displayName: string;
  role: string;
  pharmacy: string;
  loginTime: string;
}

// Authorized credentials as requested
const VALID_CREDENTIALS = {
  username: 'Gamil_122',
  password: 'Mo1882005',
  displayName: 'جميل - مسؤول التسويق',
  role: 'مدير الحملات التسويقية',
  pharmacy: 'صيدليات الفؤاد',
};

class AuthService {
  public static login(
    usernameInput: string,
    passwordInput: string,
    rememberMe: boolean = true
  ): { success: boolean; error?: string; user?: AuthUser } {
    const cleanUsername = usernameInput.trim();
    const cleanPassword = passwordInput.trim();

    if (!cleanUsername || !cleanPassword) {
      return {
        success: false,
        error: 'يرجى إدخال اسم المستخدم وكلمة المرور.',
      };
    }

    if (
      cleanUsername === VALID_CREDENTIALS.username &&
      cleanPassword === VALID_CREDENTIALS.password
    ) {
      const user: AuthUser = {
        username: VALID_CREDENTIALS.username,
        displayName: VALID_CREDENTIALS.displayName,
        role: VALID_CREDENTIALS.role,
        pharmacy: VALID_CREDENTIALS.pharmacy,
        loginTime: new Date().toISOString(),
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      // Clear both first to avoid duplicates
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);

      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, cleanUsername);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      return { success: true, user };
    }

    return {
      success: false,
      error: 'بيانات تسجيل الدخول غير صحيحة. يرجى التحقق من اسم المستخدم أو كلمة المرور.',
    };
  }

  public static logout(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  public static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  public static getCurrentUser(): AuthUser | null {
    try {
      const stored =
        localStorage.getItem(AUTH_STORAGE_KEY) ||
        sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as AuthUser;
      }
    } catch {
      // ignore
    }
    return null;
  }

  public static getRememberedUsername(): string {
    try {
      return localStorage.getItem(REMEMBER_KEY) || '';
    } catch {
      return '';
    }
  }
}

export { AuthService, VALID_CREDENTIALS };
