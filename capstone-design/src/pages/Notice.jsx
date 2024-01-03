import React from "react";
import { Background } from "./Main";
import styled from "styled-components";
import SideBar from "../components/SideBar";
import NoticePost from "../components/NoticePost";

const Notice = () => {
  const data = [
    { headline: "공지사항 테스트1", date: "2024-01-03", contents: "테스트 공지사항의 내용입니다." },
    { headline: "공지사항 테스트2", date: "2024-01-03", contents: "테스트 공지사항의 내용입니다2." },
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
