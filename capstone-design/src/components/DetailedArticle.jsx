import { React, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { WriteButton } from "./AddArticle";

const DetailedArticle = ({ articleInfo, userInfo }) => {
  const [open, setOpen] = useState(false); // 모달창 열기/닫기

  ////////// 모달 열기 함수
  const handleOpen = () => setOpen(true);
  ////////// 모달 닫기 함수
  const handleClose = () => setOpen(false);

  ////////// 매칭 신청하기
  const matchingApply = async () => {
    const collectionName = articleInfo.uid + "_" + articleInfo.time;
    await setDoc(doc(db, `Matching/Application/${collectionName}`, userInfo.uid), {
      ...userInfo,
    });
    alert("매칭 신청 완료!");
  };

  return (
    <>
      <SummaryArticleContainer onClick={handleOpen}>
        {/* 학과 / 나이 / 성별 / 인원 .. 제목 */}
        <SummaryArticleContent>
          <SummaryArticleInfo>
            {articleInfo.major} / {articleInfo.age} / {articleInfo.gender} / {articleInfo.people}인
          </SummaryArticleInfo>
          <SummaryArticleHeadline>{articleInfo.title}</SummaryArticleHeadline>
        </SummaryArticleContent>
      </SummaryArticleContainer>
      <Modal open={open} onClose={handleClose}>
        <StyledModalBox>
          <DetailedArticleContainer>
            <DetailedArticleHeadline>{articleInfo.title}</DetailedArticleHeadline>
            <DetailedArticleInfo>
              {articleInfo.name} / {articleInfo.major} / {articleInfo.gender} / {articleInfo.age}
            </DetailedArticleInfo>
            <DetailedArticleInfo>인원 : {articleInfo.people}인</DetailedArticleInfo>
            <DetailedArticleContent>내용 : {articleInfo.content}</DetailedArticleContent>
            <MatchingApplyButton onClick={matchingApply}>매칭 신청</MatchingApplyButton>
          </DetailedArticleContainer>
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
  height: 500px;
  background-color: white;
  border-radius: 15px;
`;

const SummaryArticleContainer = styled.div`
  width: 100%;
  height: 80px;
  /* background-color:#F3DCCC; */
  background-color: #feefdb;
  border-radius: 15px;
  display: flex;
  align-items: center;
  box-shadow: 3px 3px 5px 1px #f3dccc;
  margin-bottom:30px;
`;

const SummaryArticleContent = styled.div`
  margin-left: 10px;
`;

const SummaryArticleInfo = styled.div`
  margin-bottom: 3px;
  font-size: 12px;
  color: #607274;
`;

const SummaryArticleHeadline = styled.div`
  font-size: 15px;
`;

const DetailedArticleContainer = styled.div`
  padding: 30px 20px;
  height: 100%;
  display:flex;
  flex-direction:column;
  align-items:center;
`;

const DetailedArticleHeadline = styled.div`
  font-size: 20px;
  text-align: center;
  margin-bottom:20px;
`;

const DetailedArticleInfo = styled.div`
margin-bottom:5px;
`;

const DetailedArticleContent = styled.div`
margin-top:20px;
width:100%;
text-align:center;
height:220px;
padding:15px 0px;
border:2px solid #EEEEEE;
border-radius:10px;
`;

const MatchingApplyButton = styled(WriteButton)`
  
`

export default DetailedArticle;
