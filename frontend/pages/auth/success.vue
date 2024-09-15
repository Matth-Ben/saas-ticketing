<template>
    <div>Connexion réussie, redirection en cours...</div>
  </template>
  
<script setup>
    import { useRouter, useRoute } from 'vue-router';
    import { useAuth } from '@/composables/useAuth';
    
    const route = useRoute();
    const router = useRouter();
    const { user } = useAuth();
    
    const token = route.query.token;
    
    if (token) {
        localStorage.setItem('authToken', token);
        user.value = { token }; // Ou extraire des informations si nécessaire
        router.push('/'); // Redirige vers la page d'accueil ou une autre page
    } else {
        router.push('/login'); // Si échec, retourne à la page de connexion
    }
</script>
  