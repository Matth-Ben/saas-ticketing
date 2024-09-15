export const useAuth = () => {
    const user = useState('user', () => null);

    const register = async (email, password) => {
        try {
            const { token, user: userData } = await $fetch('/api/auth/register', {
                method: 'POST',
                body: { email, password },
            });
        
            localStorage.setItem('authToken', token);
            user.value = userData;
            navigateTo('/');
        } catch (error) {
            console.error('Erreur lors de l\'inscription', error);
        }
    };
  
    const login = async (email, password) => {
        try {
            const { token, user: userData } = await $fetch('/api/auth/login', {
                method: 'POST',
                body: { email, password },
            });
    
            localStorage.setItem('authToken', token);
            user.value = userData;
            navigateTo('/');
        } catch (error) {
            console.error('Erreur de connexion', error);
        }
    };
  
    const logout = () => {
        localStorage.removeItem('authToken');
        user.value = null;
        navigateTo('/login');
    };
  
    return { user, register, login, logout };
};
  