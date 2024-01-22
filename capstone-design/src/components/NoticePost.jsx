import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { BodyBlurText, BodyText, EmphasisText } from "../pages/SignIn";

const NoticePost = ({ headline, date, contents }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <SummaryContainer onClick={handleOpen}>
        <SummaryBox>
          <SummaryHeadline onClick={handleOpen}>{headline}</SummaryHeadline>
          <SummaryDate onClick={handleOpen}>{date}</SummaryDate>
        </SummaryBox>
      </SummaryContainer>
      <Modal open={open} onClose={handleClose}>
        <StyledModalBox>
          <DetailedHeadline>{headline}</DetailedHeadline>
          <DetailedDate>{date}</DetailedDate>
          <DetailedContents>{contents}</DetailedContents>
        </StyledModalBox>
      </Modal>
    </>
  );
};

const StyledModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background-color: white;
  border-radius: 15px;
  &:focus-visible {
    outline: 0px;
  }
`;

const SummaryContainer = styled.div`
  width: 300px;
  height: 50px;
  border: 2px solid #26539c;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const SummaryBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px 10px;
`;

const SummaryHeadline = styled(BodyText)`
  color: #111111;
  text-align: left;
  width: 200px;
  height: 22px;
  overflow-y: hidden;
`;

const SummaryDate = styled(BodyBlurText)`
  font-size: 12px;
`;



const DetailedHeadline = styled(EmphasisText)`
  color: #111111;
  text-align: left;
  margin: 10px 0px 5px 10px;
`;
const DetailedDate = styled(BodyBlurText)`
  font-size: 12px;
  text-align: right;
  margin: 0px 10px 15px 0px;
`;
const DetailedContents = styled(BodyText)`
  color: #111111;
  width: 270px;
  padding-right: 10px;
  height: 200px;
  text-align: left;
  margin-left: 10px;
  overflow-y: auto;
  /* Chrome, Safari, Opera*/
  &::-webkit-scrollbar {
    width: 3px;
    background-color: white;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d2daff;
  }
  &::-webkit-scrollbar-track {
    background-color: whitesmoke;
  }
`;

export default NoticePost;
