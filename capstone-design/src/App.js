//App.js
import React from "react";
import { Route, Routes } from 'react-router-dom'; // 라우터 라이브러리 임포트
import SignIn from "./pages/SignIn";
import Main from "./pages/Main";
import MyInfo from "./pages/MyInfo";
import MyArticle from "./pages/MyArticle";
import Notice from "./pages/Notice";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/MyInfo" element={<MyInfo />} />
        <Route path="/MyArticle" element={<MyArticle />} />
        <Route path="/Notice" element={<Notice />} />
      </Routes >
    </>
  );
}

export default App;