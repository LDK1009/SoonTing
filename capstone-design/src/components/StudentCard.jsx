import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BodyText } from "../pages/SignIn";

const StudentCard = ({style}) => {
  ////////// 쿠키 가져오기
  function getCookie(name) {
    // 현재 페이지의 모든 쿠키 문자열을 가져옵니다. 쿠키들은 '; '로 구분되어 있습니다.
    const allCookies = "; " + document.cookie;

    // 주어진 쿠키 이름을 기준으로 문자열을 나눕니다.
    const parts = allCookies.split("; " + name + "=");

    // 만약 주어진 이름의 쿠키가 존재한다면
    if (parts.length === 2) {
      const cookieValue = parts.pop(); // 배열에서 마지막 요소(쿠키의 값)를 가져옵니다.
      const finalValue = cookieValue.split(";").shift(); // ';'로 나뉜 부분 중 첫 번째를 가져와 최종적으로 쿠키의 값을 반환합니다.
      return finalValue; // 쿠키 값이 존재하면 반환합니다.
    }

    // 쿠키가 존재하지 않는 경우 undefined를 반환합니다.
    return undefined;
  }

  ////////// uid 쿠키 값 가져오기
  const uid = getCookie("uid");

  const navigate = useNavigate(); // 네비게이트 변수

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
  const getUserData = async () => {
    // DB에 문서명이 uid인 문서가 있는지 확인하고 있다면 해당 유저 정보를 가져오기
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(() => docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      alert("회원정보를 찾을 수 없습니다.");
      navigate("/");
    }
  };

  ////////// 마운트
  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ////////// 고정 정보 클릭 시 경고
  const alertFixedInfo = () => {
    alert("'내정보' 페이지에서 변경해주세요.😉");
    if (window.confirm("'내정보' 페이지로 이동할까요?🧐")) {
      navigate("/MyInfo", {
        state: { uid: uid },
      });
    }
  };

  return (
    <>
      <Container onClick={alertFixedInfo} style={style}>
        <CardTop>SCH</CardTop>
        <StudentCardText>{userData.name}</StudentCardText>
        <StudentCardText>{userData.major}</StudentCardText>
        <StudentCardText>
          {userData.gender} / {userData.age}세
        </StudentCardText>
        <StudentCardText>{userData.number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}</StudentCardText>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 220px;
  height: 120px;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
  overflow: hidden;
`;

const CardTop = styled.div`
  background-color: #26539c;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
`;

const StudentCardText = styled(BodyText)`
  color: #111111;
  font-size: 12px;
`;

export default StudentCard;
