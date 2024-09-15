<template>
  <div class="max-w-md mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-6">Connexion</h1>
    <form @submit.prevent="loginHandler">
      <div class="mb-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border" required />
      </div>
      <div class="mb-4">
        <input v-model="password" type="password" placeholder="Mot de passe" class="w-full p-2 border" required />
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white">Se connecter</button>
    </form>

    <div class="mt-6">
      <button @click="loginWithGoogle" class="px-4 py-2 bg-red-500 text-white">
        Connexion avec Google
      </button>
      <p>Vous n'avez pas de compte ? <NuxtLink to="/register" class="text-blue-500">Register</NuxtLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const email = ref('');
const password = ref('');
const { login } = useAuth();

const loginHandler = async () => {
  await login(email.value, password.value);
};

const loginWithGoogle = () => {
  window.location.href = 'http://localhost:5000/api/auth/google'; // Redirection vers l'authentification Google
};
</script>