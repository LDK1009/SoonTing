import React from "react";
import styled from "styled-components";
import SideBar from "./SideBar";
import { SubTitleText } from "../pages/SignIn";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
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
  const userUid = getCookie("uid");

  return (
    <>
      <Container>
        <LogoText
          onClick={() =>
            navigate("/Main", {
              state: { uid: userUid },
            })
          }
        >
          SoonTing
        </LogoText>
        <SideBar />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 50px;
  background-color: #26539c;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoText = styled(SubTitleText)`
  text-shadow: -1px 0px #4d207a, 0px 1px #4d207a, 1px 0px #4d207a, 0px -1px #4d207a;
  margin-left: 10px;
  &:hover{
    cursor:pointer;
  }
`;

export default Header;
