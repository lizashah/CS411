//850002868075-riog8tkerkj6rm9p4981v1c208i7fi64.apps.googleusercontent.com

import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import "./SignUp.css";
import { UserContext } from './UserContext';

function GoogleSignIn() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    
    function handleCallbackResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        const userObject = jwtDecode(response.credential); // Corrected usage
        console.log(userObject);
        setUser(userObject); // Assuming your context expects a user object
        navigate('/home'); // Adjusted navigation path
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "850002868075-riog8tkerkj6rm9p4981v1c208i7fi64.apps.googleusercontent.com", // Replace with your actual client ID
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv"),
            { theme: "outline", size: "large" }
        );

        google.accounts.id.prompt();
    }, []);

    return (
        <div>
            <div className="sign-up-form">
                <h2>Sign In With Google</h2>
                <p>Sign in with your Google account.</p>
                <div id="googleSignInDiv"></div> {/* Google Sign-In button will be rendered here */}
            </div>
        </div>
    );
}

export default GoogleSignIn;
