<template>
  <div class="login">
    <h2 class="login__title">Login</h2>
    <form @submit.prevent="login" class="login__form">
      <label for="email" class="login__label">Email:</label>
      <input type="email" id="email" v-model="email" required class="login__input" />

      <label for="password" class="login__label">Password:</label>
      <input type="password" id="password" v-model="password" required class="login__input" />

      <button type="submit" class="login__button">Login</button>
    </form>

    <div v-if="error" class="login__error">{{ error }}</div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      console.log('click for login');
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email: this.email,
          password: this.password,
        });

        // Assuming your Laravel API returns a token upon successful login
        // const token = response.data.token;

        // You can save the token to local storage or Vuex state for authentication

        // Redirect or perform other actions as needed upon successful login
        const token = response.data.token;

        // Assuming your Laravel API returns a token upon successful login
        if (token) {
          // Save the token to local storage
          localStorage.setItem('token', token);

          // Redirect to the dashboard
          this.$router.push('/dashboard');
        } else {
          // Handle missing token
          this.error = 'Invalid token. Please try again.';
        }
        this.error = '';

      } catch (error) {
        // Handle login failure, show error message
        this.error = 'Invalid credentials. Please try again.';
        console.error('Login failed:', error);
        // Handle login failure, show error message, etc.
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import './LoginComponent.scss';
</style>
  
  