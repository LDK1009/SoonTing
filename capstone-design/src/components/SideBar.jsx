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
import styled from "styled-components";
import { Divider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MyStudentCard from "./MyStudentCard";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { useCookie } from "../hooks/useCookie";

export default function SideBar() {
  const navigate = useNavigate(); // 네비게이트 변수
  //커스텀훅 가져오기
  const { deleteCookie } = useCookie();

  ////////// 홈 페이지로 이동
  const toHome = () => {
    navigate("/");
  };

  ////////// 내정보 페이지로 이동
  const toMyInfo = () => {
    navigate("/MyInfo");
  };

  ////////// 내가 쓴 글 페이지로 이동
  const toMyArticle = () => {
    navigate("/MyArticle");
  };

  //////////매칭신청한 게시물 페이지로 이동
  const toMyApply = () => {
    navigate("/MyApply");
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
      case 3:
        toMyApply();
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
        // window.location.href = "https://activeguide.kr/guide/1704272045345x690245614199636000";
        alert("서비스 준비중입니다😥");
        break;
      case 2:
        deleteCookie("uid"); // 쿠키 삭제
        navigate("/");
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
        {["홈", "내 정보", "내 게시물", "매칭신청 게시물"].map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => firstDividerOption(index)}>
            <ListItemButton>
              <StyledListItemIcon>
                {index === 0 && <HomeIcon />}
                {index === 1 && <AccountCircleIcon />}
                {index === 2 && <DescriptionIcon />}
                {index === 3 && <HowToVoteIcon />}
              </StyledListItemIcon>
              <StyledListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {["공지사항", "도움말", "로그아웃"].map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => secondDividerOption(index)}>
            <ListItemButton>
              <StyledListItemIcon>
                {index === 0 && <NotificationsIcon />}
                {index === 1 && <HelpIcon />}
                {index === 2 && <LogoutIcon />}
              </StyledListItemIcon>
              <StyledListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <StyledMenuIcon onClick={toggleDrawer("right", true)} />
      <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false)}>
        <StudentCardContainer>
          <MyStudentCard />
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
    opacity: 0.9;
  }
`;

const StudentCardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 180px;
`;

const StyledListItemIcon = styled(ListItemIcon)`
  /* 아이콘 컨테이너 크기 */
  &.MuiListItemIcon-root {
    min-width: 24px;
    width: 24px;
    margin-right: 20px;
  }
  /* 아이콘 색상 */
  & .MuiSvgIcon-root {
    color: #1c9ad6;
  }
`;

const StyledListItemText = styled(ListItemText)`
  /* 버튼 텍스트 폰트 */
  & .MuiTypography-root {
    font-family: "Pretendard-Regular";
  }
`;
