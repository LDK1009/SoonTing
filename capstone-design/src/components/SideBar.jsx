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
import { useNavigate } from "react-router-dom";

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

  if (uidCookieValue) {
    console.log("uid 쿠키 값:", uidCookieValue);
  } else {
    console.log("uid 쿠키를 찾을 수 없습니다.");
  }

  const navigate = useNavigate(); // 네비게이트 변수

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

  const goToOption = (index) => {
    switch (index) {
      case 0:
        toMyInfo();
        break;
      case 1:
        toMyArticle();
        break;
      case 2:
        navigate("/Notice");
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
        {["내 정보", "내 게시물", "공지사항"].map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => goToOption(index)}>
            <ListItemButton>
              <ListItemIcon>
                {index === 0 && <AccountCircleIcon />}
                {index === 1 && <DescriptionIcon />}
                {index === 2 && <NotificationsIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <MenuIcon onClick={toggleDrawer("right", true)} />
      <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
        {list("right")}
      </Drawer>
    </>
  );
}
