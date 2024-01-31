import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import DetailedArticle from "../components/DetailedArticle";
import styled from "styled-components";
import { ArticleContainer } from "./Main";
import { LogoText } from "./Notice";
import { useCookie } from "../hooks/useCookie";

const MyApply = () => {
  const navigate = useNavigate(); // 네비게이트 변수
  const [applyArticles, setApplyArticles] = useState([]);
  
  //커스텀훅 가져오기
  const { getCookie } = useCookie();
  // 쿠키에서 uid 가져오기
  const uid = getCookie("uid");

  ////////// 게시물 가져오기
  const GetDocs = async () => {
    ////////// 게시글 불러오기
    const articlesRef = collection(db, `user's (apply&scrap) article/apply/${uid}`);
    const q = query(
      articlesRef,
      // where("expiration", "==", false),
      // where("category", "==", category),
      orderBy("time", "desc")
    ); // 최근 게시글이 최상단에 위치
    const newData = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data().expiration);
      newData.push(doc.data());
    });
    setApplyArticles(newData);
  };

  ////////// 회원 정보
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

  ////////// 회원 정보 불러오기
  const readUserInfo = async () => {
    // DB에 문서명이 uid인 문서가 있는지 확인하고 있다면 해당 유저 정보를 가져오기
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userDataFromDb = docSnap.data();
      setUserData(userDataFromDb);
    } else {
      alert("회원정보를 찾을 수 없습니다.");
      navigate("/");
    }
  };

  useEffect(() => {
    console.log("문서 불러오기>>");
    readUserInfo();
    GetDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("applyArticles>>", applyArticles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyArticles]);

  ////////// 게시글 렌더링
  const renderArticles = (arr) => {
    return (
      <>
        {arr.map((item, index) => {
          // map 내부에서 변수 선언, 함수 호출 가능
          return (
            <>
              <DetailedArticle key={index} articleInfo={item} userInfo={userData}></DetailedArticle>
            </>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Header />
      <Container>
      <LogoText>Shine Your Way</LogoText>
        <StyledArticleContainer>{renderArticles(applyArticles)}</StyledArticleContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledArticleContainer = styled(ArticleContainer)`
  height:670px;
`;
export default MyApply;
