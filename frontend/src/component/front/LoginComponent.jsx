import React from "react";

const LoginComponent= () => {
  const handleLogin = () => {
    // 跳转到 Django 提供的 Google OAuth 登录 URL
    window.location.href =  "http://127.0.0.1:8000/accounts/login/google-oauth2/";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <button onClick={handleLogin} style={buttonStyle}>
        Login with Google
      </button>
    </div>
  );
};

// 自定义按钮样式
const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4285F4",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
};

export default LoginComponent;
