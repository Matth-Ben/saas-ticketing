<template>
    <div class="max-w-md mx-auto mt-10">
        <h1 class="text-2xl font-bold mb-6">Inscription</h1>
        <form @submit.prevent="registerHandler">
            <div class="mb-4">
                <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border" required />
            </div>
            <div class="mb-4">
                <input v-model="password" type="password" placeholder="Mot de passe" class="w-full p-2 border" required />
            </div>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white">S'inscrire</button>
        </form>
    
        <div class="mt-6">
            <p>Vous avez déjà un compte ? <NuxtLink to="/login" class="text-blue-500">Connectez-vous</NuxtLink></p>
        </div>
    </div>
</template>
  
<script setup>
    import { ref } from 'vue';
    import { useAuth } from '@/composables/useAuth';
    
    const email = ref('');
    const password = ref('');
    const { register } = useAuth();
    
    const registerHandler = async () => {
        await register(email.value, password.value);
    };
</script>
  