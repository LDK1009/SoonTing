import React from "react";
import { Background } from "./Main";
import styled from "styled-components";
import SideBar from "../components/SideBar";
import NoticePost from "../components/NoticePost";

const Notice = () => {
  const data = [
    { headline: "[기능] 브라우저 문제 해결", date: "2024-01-05", contents: "외부 앱(카카오톡, 에브리타임 등)으로 링크 접속 시 인앱 브라우저로 실행됨에 따른 로그인 오류 문제를 해결하였습니다." },
    { headline: "[기능] 게시물 날짜 표시", date: "2024-01-05", contents: "요약 게시물에 작성일이 표기됩니다." },
    { headline: "[기능] 매칭 전 매칭자 연락처 보기", date: "2024-01-05", contents: "[내 게시물] 페이지의 '매칭 전 게시물'에서 해당 게시물 '매칭 신청자의 연락처'를 볼 수 있습니다." },
    { headline: "[테스트] 공지사항 테스트2", date: "2024-01-03", contents: "테스트 공지사항2의 내용입니다." },
    { headline: "[테스트] 공지사항 테스트1", date: "2024-01-03", contents: "테스트 공지사항1의 내용입니다." },
  ];

  return (
    <Background>
      <Container>
        <SideBar />
        <h1>공지사항</h1>
        {data.map((item, index) => {
          return (
            <>
              <NoticePost key={index} headline={item.headline} date={item.date} contents={item.contents} />
            </>
          );
        })}
      </Container>
    </Background>
  );
};

const Container = styled.div`
  width: 280px;
  height: 90%;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 3px pink;
`;

export default Notice;
