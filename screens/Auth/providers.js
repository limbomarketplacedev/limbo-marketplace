export const useGoogleLogin = () => ({
    promptAsync: () => console.log('Stub Google Login'),
    request: true,
  });
  
  export const useFacebookLogin = () => ({
    promptAsync: () => console.log('Stub Facebook Login'),
    request: true,
  });
  