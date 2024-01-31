import React from "react";
import styled from "styled-components";
import SideBar from "./SideBar";
import { SubTitleText } from "../pages/SignIn";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <Container>
        <LogoText
          onClick={() =>
            navigate("/Main")
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
