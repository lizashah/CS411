
import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

const clientId = '850002868075-riog8tkerkj6rm9p4981v1c208i7fi64.apps.googleusercontent.com';
const SignIn = () => {
  const navigate = useNavigate();

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    navigate('/home');
  };

  const onFailure = (res) => {
    console.log('Login Failed:', res);
    alert('Failed to log in. Please try again.');
  };

  return (
    <div>
      <h2>Sign In With Google</h2>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default SignIn;
