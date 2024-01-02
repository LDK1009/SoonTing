import { React, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const DetailedArticle = ({ articleInfo, userInfo }) => {
  const [open, setOpen] = useState(false); // 모달창 열기/닫기

  ////////// 모달 열기 함수
  const handleOpen = () => setOpen(true);
  ////////// 모달 닫기 함수
  const handleClose = () => setOpen(false);
  
  ////////// 매칭 신청하기
  const matchingApply = async () => {
    const collectionName = articleInfo.uid + "_" + articleInfo.time;
    await setDoc(
      doc(db, `Matching/Application/${collectionName}`, userInfo.uid),
      {
        ...userInfo,
      }
    );
    alert("매칭 신청 완료!");
  };


  return (
    <>
      <SummaryArticleContainer onClick={handleOpen}>
        {/* 학과 / 나이 / 성별 / 인원 .. 제목 */}
        <SummaryArticleContent>
        <div>
          {articleInfo.major} / {articleInfo.age} / {articleInfo.gender} /{" "}
          {articleInfo.people}인
        </div>
        <div>{articleInfo.title}</div>
        </SummaryArticleContent>
      </SummaryArticleContainer>
      <Modal open={open} onClose={handleClose}>
        <StyledModalBox>
          <div>작성자 : {articleInfo.name}</div>
          <div>나이 : {articleInfo.age}</div>
          <div>학과 : {articleInfo.major}</div>
          <div>성별 : {articleInfo.gender}</div>
          <div>인원 : {articleInfo.people}인</div>
          <div>제목 : {articleInfo.title}</div>
          <div>내용 : {articleInfo.content}</div>
          <div>작성자 uid : {articleInfo.uid}</div>
          <div>작성 시간 : {articleInfo.time}</div>
          <button onClick={matchingApply}>매칭 신청</button>
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

const SummaryArticleContainer =styled.div`
  width:100%;
  height:80px;
  background-color:pink;
  border:1px solid red;
  border-radius:15px;
  display:flex;
  align-items:center;
` 

const SummaryArticleContent = styled.div`
  margin-left:10px;
`

export default DetailedArticle;
