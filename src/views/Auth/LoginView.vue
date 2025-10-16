<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-header">
        <!-- Animated Heart Icon -->
        <div class="heart-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        <h1>Keepr</h1>
        <p class="subtitle">Keep your relationship organized</p>
      </div>

      <div class="login-card">
        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.83 9L5.5 2.67c-1.41 1.41-2.58 3.04-3.37 4.83 1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l-3.12-3.12c-.78-.27-1.64-.42-2.53-.42-3.87 0-7 3.13-7 7 0 .89.15 1.75.42 2.53zm7.34 7.34l3.15 3.15c1.41-1.41 2.58-3.04 3.37-4.83-1.73-4.39-6-7.5-11-7.5-1.55 0-3.03.3-4.38.84l3.12 3.12c.78.27 1.64.42 2.53.42 3.87 0 7-3.13 7-7 0-.89-.15-1.75-.42-2.53zM19.07 4.93L4.93 19.07"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="forgot-password">
            <button type="button" @click="showResetModal = true">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            class="btn-login"
            :disabled="loading"
          >
            <span v-if="!loading">{{ isSignup ? 'Sign Up' : 'Login' }}</span>
            <div v-else class="spinner"></div>
          </button>
        </form>
      </div>

      <div class="signup-prompt">
        <p v-if="!isSignup">
          Don't have an account? <button type="button" @click="toggleMode">Sign up</button>
        </p>
        <p v-else>
          Already have an account? <button type="button" @click="toggleMode">Sign in</button>
        </p>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <div v-if="showResetModal" class="modal-overlay" @click="closeResetModal">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">Reset Password</h2>
        <p class="modal-description">
          Enter your email address to receive a password reset link.
        </p>

        <div class="form-group">
          <label for="resetEmail">Email</label>
          <input
            type="email"
            id="resetEmail"
            v-model="resetEmail"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="btn-cancel"
            @click="closeResetModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn-reset"
            @click="sendResetLink"
            :disabled="loading"
          >
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../supabase';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);
    const isSignup = ref(false);
    const showPassword = ref(false);
    const showResetModal = ref(false);
    const resetEmail = ref('');

    const handleLogin = async () => {
      error.value = '';
      loading.value = true;

      try {
        if (isSignup.value) {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
          });

          if (signUpError) throw signUpError;

          if (data.user) {
            alert('Check your email for the confirmation link!');
            isSignup.value = false;
          }
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
          });

          if (signInError) throw signInError;

          if (data.user) {
            router.push('/home');
          }
        }
      } catch (err) {
        error.value = err.message || 'An error occurred';
      } finally {
        loading.value = false;
      }
    };

    const toggleMode = () => {
      isSignup.value = !isSignup.value;
      error.value = '';
      email.value = '';
      password.value = '';
    };

    const sendResetLink = async () => {
      error.value = '';
      loading.value = true;

      try {
        await supabase.auth.resetPasswordForEmail(resetEmail.value);
        alert('Password reset email sent! Check your inbox.');
        resetEmail.value = '';
        showResetModal.value = false;
      } catch (err) {
        error.value = err.message || 'Failed to send reset email';
      } finally {
        loading.value = false;
      }
    };

    const closeResetModal = () => {
      showResetModal.value = false;
      resetEmail.value = '';
    };

    return {
      email,
      password,
      error,
      loading,
      isSignup,
      showPassword,
      showResetModal,
      resetEmail,
      handleLogin,
      toggleMode,
      sendResetLink,
      closeResetModal,
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FFE5EF 0%, #FFF0F5 50%, #FFF5F8 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.login-wrapper {
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.heart-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFC3D7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
  animation: heartbeat 1s ease-in-out infinite;
}

.heart-icon svg {
  width: 50px;
  height: 50px;
  color: white;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.login-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(255, 107, 157, 0.15);
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-group input::placeholder {
  color: #999;
}

.form-group input:focus {
  outline: none;
  border-color: #FF6B9D;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #FF6B9D;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.forgot-password {
  text-align: right;
}

.forgot-password button {
  background: none;
  border: none;
  color: #FF6B9D;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.forgot-password button:hover {
  opacity: 0.8;
}

.btn-login {
  padding: 14px;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF5A8E 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 157, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.signup-prompt {
  margin-top: 20px;
  text-align: center;
}

.signup-prompt p {
  font-size: 14px;
  color: #666;
}

.signup-prompt button {
  background: none;
  border: none;
  color: #FF6B9D;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.signup-prompt button:hover {
  text-decoration: underline;
  opacity: 0.8;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #2D2D2D;
  margin-bottom: 16px;
}

.modal-description {
  font-size: 14px;
  color: #6B6B6B;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-cancel {
  background: #F0F0F0;
  color: #666;
}

.btn-cancel:hover {
  background: #E0E0E0;
}

.btn-reset {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF5A8E 100%);
  color: white;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-reset:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 107, 157, 0.4);
}

.btn-reset:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>