import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";

const NoticePost = ({ headline, date, contents }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <SummaryNoticeContainer onClick={handleOpen}>
        <SummaryNoticeBox>
          <SummaryNoticeHeadline onClick={handleOpen}>{headline}</SummaryNoticeHeadline>
          <SummaryNoticeDate onClick={handleOpen}>{date}</SummaryNoticeDate>
        </SummaryNoticeBox>
      </SummaryNoticeContainer>
      <Modal open={open} onClose={handleClose}>
        <StyledModalBox>
          <DetailedNoticeContainer>
            <DetailedNoticeHeadline>{headline}</DetailedNoticeHeadline>
            <DetailedNoticeDate>{date}</DetailedNoticeDate>
            <DetailedNoticeContents>{contents}</DetailedNoticeContents>
          </DetailedNoticeContainer>
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
`;

const SummaryNoticeContainer = styled.div`
  width: 100%;
  height: 50px;
  border: 2px solid #26539c;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 3px 3px 5px 1px gray;
  margin-bottom:30px;
`;

const SummaryNoticeBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px 10px;
`;

const SummaryNoticeHeadline = styled.div`
  font-size: 15px;
`;

const SummaryNoticeDate = styled.div`
  font-size: 12px;
  color: #607274;
`;

const DetailedNoticeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailedNoticeHeadline = styled.div`
  margin: 20px 0px;
  font-size: 20px;
  font-weight: bold;
`;
const DetailedNoticeDate = styled.div`
  align-self: flex-end;
  margin-bottom: 20px;
  margin-right: 10px;
  font-size: 15px;
  color: #607274;
`;
const DetailedNoticeContents = styled.div`
  width: 90%;
  height: 180px;
  font-size: 15px;
`;

export default NoticePost;
