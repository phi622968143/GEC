import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginComponent from "./component/front/LoginComponent";  // 导入登录组件

const IndexPage = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // 请求后端 API 获取用户信息
    axios
      .get("http://localhost:8000/api/login/1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 使用 token 认证
        },
      })
      .then((response) => {
        setUserName(response.data.name);  // 获取到用户信息后，设置用户名
      })
      .catch((error) => {
        console.log("User not authenticated or failed to load data", error);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the App</h1>
      {userName ? (
        <h2>Hello Uer!</h2> 
      ) : (
        <LoginComponent /> 
      )}
    </div>
  );
};

export default IndexPage;

