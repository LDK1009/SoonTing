import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import HelpIcon from "@mui/icons-material/Help";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import styled from "styled-components";
import { Divider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";

export default function SideBar() {
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
  const uidCookieValue = getCookie("uid");


  const navigate = useNavigate(); // 네비게이트 변수

  ////////// 홈 페이지로 이동
  const toHome = () => {
    navigate("/", {
      state: { uid: uidCookieValue },
    });
  };

  ////////// 내정보 페이지로 이동
  const toMyInfo = () => {
    navigate("/MyInfo", {
      state: { uid: uidCookieValue },
    });
  };

  ////////// 내가 쓴 글 페이지로 이동
  const toMyArticle = () => {
    navigate("/MyArticle", {
      state: { uid: uidCookieValue },
    });
  };

  ////////// 사이드바 첫번째 그룹 함수 옵션
  const firstDividerOption = (index) => {
    switch (index) {
      case 0:
        toHome();
        break;
      case 1:
        toMyInfo();
        break;
      case 2:
        toMyArticle();
        break;
      default:
        break;
    }
  };

  ////////// 사이드바 두번째 그룹 함수 옵션
  const secondDividerOption = (index) => {
    switch (index) {
      case 0:
        navigate("/Notice");
        break;
      case 1:
        window.location.href = "https://activeguide.kr/guide/1704272045345x690245614199636000";
        break;
      case 2:
        logout("uid");
        break;
      default:
        break;
    }
  };

  //////////
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["홈", "내 정보", "내 게시물"].map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => firstDividerOption(index)}>
            <ListItemButton>
              <ListItemIcon>
                {index === 0 && <HomeIcon />}
                {index === 1 && <AccountCircleIcon />}
                {index === 2 && <DescriptionIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {["공지사항", "도움말", "로그아웃"].map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => secondDividerOption(index)}>
            <ListItemButton>
              <ListItemIcon>
                {index === 0 && <NotificationsIcon />}
                {index === 1 && <HelpIcon />}
                {index === 2 && <LogoutIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
    const docRef = doc(db, "users", uidCookieValue);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(() => docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      alert("회원정보를 찾을 수 없습니다.");
      navigate("/");
    }
  };

  ////////// 로그아웃(쿠키 삭제하기)
  const logout = (cookieName) => {
    // 현재 날짜와 시간을 구합니다.
    var currentDate = new Date();
    // 쿠키의 만료일을 현재 시간 이전으로 설정합니다.
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    // 쿠키 설정
    document.cookie = cookieName + "=; expires=" + currentDate.toUTCString() + "; path=/";
    navigate("/");
  };

  ////////// 마운트
  useEffect(() => {
    readUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <StyledMenuIcon onClick={toggleDrawer("right", true)} />
      <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
        <StudentCardContainer>
          <StudentCardTop>SCH</StudentCardTop>
          <StudentCardText>{userData.name}</StudentCardText>
          <StudentCardText>{userData.major}</StudentCardText>
          <StudentCardText>
            {userData.gender} / {userData.age}세
          </StudentCardText>
        </StudentCardContainer>
        <Divider />
        {list("right")}
      </Drawer>
    </>
  );
}

const StyledMenuIcon = styled(MenuIcon)`
  color: white;
  margin-right: 10px;
  &.css-i4bv87-MuiSvgIcon-root {
    width: 30px;
    height: 30px;
  }
  &:hover {
    cursor: pointer;
    opacity:0.9;
  }
`;

const StudentCardContainer = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  margin: 20px 30px;
  text-align: center;
  overflow: hidden;
`;

const StudentCardTop = styled.div`
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

const StudentCardText = styled.div`
  margin: 5px;
`;
