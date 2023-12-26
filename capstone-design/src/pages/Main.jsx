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

  ////////// 내정보 페이지로 이동
  const toMyInfo = () => {
    navigate("/MyInfo", {
      state: { uid: userUid },
    });
  };

  ////////// 내가 쓴 글 페이지로 이동
  const toMyArticle = () => {
    navigate("/MyArticle", {
      state: { uid: userUid },
    });
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
          <div key={index}>
            <h3>{index}번째 게시글</h3>
            <DetailedArticle articleInfo={item} userInfo={userData}></DetailedArticle>
          </div>
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

  return (
    <>
      <Background>
        <Container>
          <SideBar/>
          <div>로그인 성공!, 메인페이지 입니다.</div>
          <h1>로그인 유저 정보</h1>
          <div> 이름 : {userData.name}</div>
          <div> 학과 : {userData.major}</div>
          <div> 이메일 : {userData.email}</div>
          <div> 성별 : {userData.gender}</div>
          <div> 나이 : {userData.age}</div>
          <div> 팀원 수 : {userData.people}</div>
          <div> 전화번호 : {userData.number}</div>
          <button onClick={toMyInfo}>내정보 수정</button>
          <button onClick={toMyArticle}>내가 쓴 글</button>
          <AddArticle userData={userData} />
          <h1>불러온 데이터</h1>
          {renderArticles(loadedArticles)}
        </Container>
      </Background>
    </>
  );
};

const Background = styled.div`
  height: 100%;
  background-image: url("/background.jpg");
  background-repeat: no-repeat; /* 배경 이미지 반복 설정 */
  background-size: cover; /* 배경 이미지 크기 조절 (cover, contain 등) */
  background-position: center; /* 배경 이미지 위치 조절 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width:280px;
  height:90%;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

export default Main;
