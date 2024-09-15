export default defineNuxtRouteMiddleware((to, from) => {
    const user = useState('user');
    const route = useRoute();
  
    if (route.query.token) {
        const token = route.query.token;
        localStorage.setItem('authToken', token);
        user.value = true;
        return navigateTo('/');
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) {
        return navigateTo('/login');
    }
});
  