import { React, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { WriteButton } from "./AddArticle";
import { BodyBlurText, BodyText } from "../pages/SignIn";

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
      ...userInfo, // 신청자 정보 전달
      matching:false, // 매칭 여부는 false로 시작
    });
    alert("매칭 신청 완료!");
  };

  ////////// 게시글 시간
  const startIndex = articleInfo.time.indexOf('년') + 1; //년 다음부터
  const endIndex = articleInfo.time.indexOf('일') + 1; // 일까지
  const writeTime = articleInfo.time.substring(startIndex, endIndex);

  // 정규 표현식을 사용하여 "01월 05일" 부분을 추출
  return (
    <>
      <SummaryArticleContainer onClick={handleOpen}>
        {/* 학과 / 나이 / 성별 / 인원 .. 제목 */}
        <SummaryArticleContent>
          <SummaryArticleInfoWrap>
            {/* 학과 나이 성별 인원 */}
            <SummaryArticleInfo>
              {articleInfo.major} / {articleInfo.age} / {articleInfo.gender} / {articleInfo.people}인
            </SummaryArticleInfo>
            {/* 날짜 */}
            <SummaryArticleInfo>{writeTime}</SummaryArticleInfo>
          </SummaryArticleInfoWrap>
            {/* 제목 */}
          <SummaryArticleHeadline>{articleInfo.title}</SummaryArticleHeadline>
        </SummaryArticleContent>
      </SummaryArticleContainer>
      <StyledModal open={open} onClose={handleClose}>
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
      </StyledModal>
    </>
  );
};
const StyledModal = styled(Modal)`
  &:focus-visible {
    outline: 0px;
  }
`;

const StyledModalBox = styled(Box)`
  &:focus-visible {
    outline: 0px;
  }
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  /* height: 500px; */
  background-color: white;
  border-radius: 15px;
  border: 0px;
`;

const SummaryArticleContainer = styled.div`
  width: 300px;
  height: 80px;
  border:2px solid #72C6EF;
  border-radius: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const SummaryArticleContent = styled.div`
  margin: 0px 10px;
  width:100%;
`;

const SummaryArticleInfo = styled(BodyBlurText)`
  font-size: 12px;
  color: #767676;
`;

const SummaryArticleInfoWrap = styled.div`
  display: flex;
  width:100%;
  justify-content:space-between;
`;

const SummaryArticleHeadline = styled(BodyText)`
  text-align:left;
  color:#111111;
  height:44px;
  overflow-y:hidden;
`;

const DetailedArticleContainer = styled.div`
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailedArticleHeadline = styled.div`
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const DetailedArticleInfo = styled.div`
  margin-bottom: 5px;
`;

const DetailedArticleContent = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
  height: 220px;
  padding: 15px 0px;
  border: 2px solid #eeeeee;
  border-radius: 10px;
`;

const MatchingApplyButton = styled(WriteButton)`
  position: relative;
  bottom: 0px;
`;

export default DetailedArticle;
