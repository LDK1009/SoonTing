//App.js
import React from "react";
import { Route, Routes } from 'react-router-dom'; // 라우터 라이브러리 임포트
import SignIn from "./pages/SignIn";
import OnSignIn from "./pages/OnSignIn";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/OnSignIn" element={<OnSignIn />} />
      </Routes >
    </>
  );
}

export default App;