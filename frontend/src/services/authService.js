export const loginUser = async ( { email, password }) => {
    const response = await fetch(
        "https:/api/login",
         {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify({ 
            email, 
            password,
         }),
      });

    const data = await response.json();
 
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return {
         token: data.token,
         user: { email },
    };
};



