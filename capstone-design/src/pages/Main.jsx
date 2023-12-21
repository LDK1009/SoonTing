import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import AddArticle from "../components/AddArticle";

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
  });
  
  

  ////////// 유저 정보 불러오기
  const firestoreRead = async () => {
    // DB에 문서명이 uid인 문서가 있는지 확인하고 있다면 해당 유저 정보를 가져오기
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserData(()=>docSnap.data());
      console.log("docSnap.data():", docSnap.data());
      
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


  ////////// 게시글 불러오기
  const articlesRef = collection(db, "articles");
  // const q = query(articlesRef, where("expiration", "==", false)); // 정렬 없음
  // const q = query(articlesRef, where("expiration", "==", false), orderBy("time")); // 최근 게시글이 최히단에 위치
  const q = query(articlesRef, where("expiration", "==", false), orderBy("time", "desc")); // 최근 게시글이 최상단에 위치

  const GetDocs = async () => {
    const newData = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data().expiration);
      newData.push(doc.data());
    });
    setLoadedArticles(() => newData);
  };

  // console.log(loadedArticles);
  useEffect(() => {
    console.log("유저데이터가 변경됨 : ", userData);
  }, [userData]);
  // 게시글 렌더링
  const renderArticles = (arr) => {
    return (
      <>
        {arr.map((item, index) => (
          <div key={index}>
            <h1>{index}번째 게시글</h1>
            <div>이름 : {item.name}</div>
            <div>나이 : {item.age}</div>
            <div>학과 : {item.major}</div>
            <div>성별 : {item.gender}</div>
            <div>인원 : {item.people}</div>
            <div>제목 : {item.title}</div>
            <div>내용 : {item.content}</div>
          </div>
        ))}
      </>
    );
  };

  ////////// 마운트
  useEffect(() => {
    firestoreRead();
    GetDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>로그인 성공!, 메인페이지 입니다.</div>
      <div> 이름 : {userData.name}</div>
      <div> 학과 : {userData.major}</div>
      <div> 이메일 : {userData.email}</div>
      <div> 성별 : {userData.gender}</div>
      <div> 나이 : {userData.age}</div>
      <div> 팀원 수 : {userData.people}</div>
      <button onClick={toMyInfo}>내정보 수정</button>
      <AddArticle userData={userData} />
      <h3>불러온 데이터</h3>
      {renderArticles(loadedArticles)}
    </div>
  );
};

export default Main;
