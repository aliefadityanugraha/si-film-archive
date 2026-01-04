import { ref, computed, readonly } from 'vue';
import { authApi, ApiError } from '@/lib/api';

// Global state
const user = ref(null);
const loading = ref(false);
const initialized = ref(false);

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role?.name === 'admin');
  const isModerator = computed(() => ['moderator', 'admin'].includes(user.value?.role?.name));
  const isCreator = computed(() => ['creator', 'moderator', 'admin'].includes(user.value?.role?.name));

  // Initialize - check session on app load
  async function init() {
    if (initialized.value) return;
    
    loading.value = true;
    try {
      const res = await authApi.getProfile();
      if (res.success) {
        user.value = res.data;
      }
    } catch {
      user.value = null;
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  }

  // Login with email/password
  async function login(email, password) {
    loading.value = true;
    try {
      const loginRes = await authApi.login(email, password);
      // Better Auth returns { user: {...}, token: "xxx" } or { user: {...}, session: {...} }
      // If user is in response, use it directly, otherwise fetch profile
      if (loginRes.user) {
        // Need to fetch full profile to get role info
        const res = await authApi.getProfile();
        if (res.success) {
          user.value = res.data;
        } else if (loginRes.user) {
          // Fallback to login response user if profile fails
          user.value = loginRes.user;
        }
      } else {
        // Fetch profile if user not in login response
        const res = await authApi.getProfile();
        if (res.success) {
          user.value = res.data;
        }
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Login failed';
      return { success: false, message };
    } finally {
      loading.value = false;
    }
  }

  // Register
  async function register(data) {
    loading.value = true;
    try {
      const registerRes = await authApi.register(data);
      // Better Auth returns { user: {...}, token: "xxx" } or { user: {...}, session: {...} }
      // If user is in response, use it directly, otherwise fetch profile
      if (registerRes.user) {
        // Need to fetch full profile to get role info
        const res = await authApi.getProfile();
        if (res.success) {
          user.value = res.data;
        } else if (registerRes.user) {
          // Fallback to register response user if profile fails
          user.value = registerRes.user;
        }
      } else {
        // Fetch profile if user not in register response
        const res = await authApi.getProfile();
        if (res.success) {
          user.value = res.data;
        }
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Registration failed';
      return { success: false, message };
    } finally {
      loading.value = false;
    }
  }

  // Login with Google
  function loginWithGoogle() {
    authApi.loginWithGoogle();
  }

  // Logout
  async function logout() {
    try {
      await authApi.logout();
    } finally {
      user.value = null;
    }
  }

  // Refresh user data
  async function refreshUser() {
    try {
      const res = await authApi.getProfile();
      if (res.success) {
        user.value = res.data;
      }
    } catch (err) {
      // Only clear user if it's a 401 unauthorized error
      if (err.status === 401) {
        user.value = null;
      }
      // Otherwise keep current user data
    }
  }

  return {
    // State (readonly)
    user: readonly(user),
    loading: readonly(loading),
    initialized: readonly(initialized),
    
    // Computed
    isLoggedIn,
    isAdmin,
    isModerator,
    isCreator,
    
    // Actions
    init,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser
  };
}
