import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import AddArticle from "../components/AddArticle";
import DetailedArticle from "../components/DetailedArticle";
import styled from "styled-components";
import SideBar from "../components/SideBar";

const Main = () => {
  const location = useLocation(); // useNavigate 프롭스 전달 받기(uid)
  const userUid = location.state.uid; // uid
  const navigate = useNavigate(); // 네비게이트 변수
  const [loadedArticles, setLoadedArticles] = useState([]); // 로드한 게시글

  // 유저아이디를 기반으로 회원 정보 가져오기
  const [userData, setUserData] = useState({
    uid: "",
    name: "",
    email: "",
    gender: "",
    age: "",
    people: "",
    major: "",
    number: "",
  });

  ////////// 유저 정보 불러오기
  const readUserInfo = async () => {
    // DB에 문서명이 uid인 문서가 있는지 확인하고 있다면 해당 유저 정보를 가져오기
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(() => docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      alert("회원정보를 찾을 수 없습니다.");
      navigate("/SignIn");
    }
  };

  const GetDocs = async () => {
    ////////// 게시글 불러오기
    const articlesRef = collection(db, "articles");
    // const q = query(articlesRef, where("expiration", "==", false)); // 정렬 없음
    // const q = query(articlesRef, where("expiration", "==", false), orderBy("time")); // 최근 게시글이 최히단에 위치
    const q = query(articlesRef, where("expiration", "==", false), orderBy("time", "desc")); // 최근 게시글이 최상단에 위치
    const newData = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data().expiration);
      newData.push(doc.data());
    });
    setLoadedArticles(() => newData);
  };

  // 게시글 렌더링
  const renderArticles = (arr) => {
    return (
      <>
        {arr.map((item, index) => (
          <>
            <DetailedArticle key={index} articleInfo={item} userInfo={userData}></DetailedArticle>
          </>
        ))}
      </>
    );
  };

  ////////// 마운트
  useEffect(() => {
    readUserInfo();
    GetDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <Background>
        <Container>
          <SideBar />
          <h1>홈</h1>
          <ArticleContainer>{renderArticles(loadedArticles)}</ArticleContainer>
          <AddArticle userData={userData} />
        </Container>
      </Background>
    </>
  );
};

export const Background = styled.div`
  height: 100%;
  background-image: url("./background.jpg");
  background-repeat: no-repeat; /* 배경 이미지 반복 설정 */
  background-size: cover; /* 배경 이미지 크기 조절 (cover, contain 등) */
  background-position: center; /* 배경 이미지 위치 조절 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 280px;
  height: 90%;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 3px pink;
`;

const ArticleContainer = styled.div`
  height: 500px;
  overflow: auto;
  width: 100%;
  padding: 0px 10px;
  /* &::-webkit-scrollbar {
    display:none;
  } */
  /* Chrome, Safari, Opera*/
  &::-webkit-scrollbar {
    width: 3px;
    background-color: white;
  }
  &::-webkit-scrollbar-thumb {
    background-color: pink;
  }
  &::-webkit-scrollbar-track {
    background-color: whitesmoke;
  }
`;

export default Main;
