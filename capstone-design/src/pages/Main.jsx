import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Main = () => {
  const location = useLocation(); // useNavigate 프롭스 전달 받기(uid)
  const userUid = location.state.uid; // uid
  const navigate = useNavigate(); // 네비게이트 변수

  // 유저아이디를 기반으로 회원 정보 가져오기
  const [userData, setUserData] = useState({uid:"", name:"", email:"", gender:"", age:"", people:""});

  ////////// 유저 정보 불러오기
  const firestoreRead = async () => {
    // DB에 문서명이 uid인 문서가 있는지 확인하고 있다면 해당 유저 정보를 가져오기
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserData(()=>docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      alert("회원정보를 찾을 수 없습니다.");
      navigate("/SignIn");
    }
  };

  const toMyInfo=()=>{
    navigate("/MyInfo", {
      state: { uid: userUid },
    });
  }


  ////////// 마운트
  useEffect(() => {
    firestoreRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // location.state로 접근해서 필요한 데이터 사용
  // console.log("네비게이트 전달 데이터\n"+ JSON.stringify(location.uid, null, 2));
  console.log("네비게이트 전달 데이터\n" + location.state.uid);

  return (
    <div>
      <div>로그인 성공!, 메인페이지 입니다.</div>
      <div> 이름 : {userData.name}</div>
      <div> 이메일 : {userData.email}</div>
      <div> 성별 : {userData.gender}</div>
      <div> 나이 : {userData.age}</div>
      <div> 팀원 수 : {userData.people}</div>
      <button onClick={toMyInfo}>내정보 수정</button>
    </div>
  );
};

export default Main;
