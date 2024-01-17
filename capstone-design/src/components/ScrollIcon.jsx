import React from "react";
import MouseIcon from "@mui/icons-material/Mouse";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styled from "styled-components";

const ScrollIcon = () => {
  return (
    <>
    <Container>
        <KeyboardArrowUpIcon />
        <MouseIcon />
        <KeyboardArrowDownIcon />
    </Container>
    </>
  );
};

const Container = styled.div`
    display:flex;
    flex-direction:column;
    color:white;
    margin-top:250px;
`

export default ScrollIcon;
