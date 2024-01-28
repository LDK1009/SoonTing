import React from "react";
import styled from "styled-components";
import NoticePost from "../components/NoticePost";
import Header from "../components/Header";
import { MainTitleText } from "./SignIn";

const Notice = () => {
  const data = [
    {
      headline: "[오류수정] 글쓰기 예외처리",
      date: "2024-01-29",
      contents: "글쓰기 정보를 모두 입력해야만 팅(게시물)이 등록됩니다.",
    },
    {
      headline: "[기능] 매칭 기능 변경",
      date: "2024-01-06",
      contents: [
        "1. 한 게시물에서 다수 매칭이 가능합니다.",
        <br />,
        <br />,
        "2. 매칭 확정자의 연락처를 볼 수 있습니다",
        <br />,
        <br />,
        "3. 매칭 마감 버튼을 눌러야 게시물이 만료되고 [홈] 과 [내 게시물(만료 전)] 에서 사라집니다.",
        <br />,
        <br />,
        "4. 사라진 게시믈과 매칭 확정자는 [내 게시물(만료 후)]에서 확인할 수 있습니다.",
        <br />,
        <br />,
        "5. 매칭을 통해 새로운 학우를 만나보세요!",
      ],
    },
    {
      headline: "[기능] 사용자 정보 미입력 시 서비스 이용 불가",
      date: "2024-01-06",
      contents: "사용자 정보를 모두 입력해야만 서비스 이용이 가능합니다.",
    },
    {
      headline: "[기능] 브라우저 문제 해결",
      date: "2024-01-05",
      contents:
        "외부 앱(카카오톡, 에브리타임 등)으로 링크 접속 시 인앱 브라우저로 실행됨에 따른 로그인 오류 문제를 해결하였습니다.",
    },
    { headline: "[기능] 게시물 날짜 표시", date: "2024-01-05", contents: "요약 게시물에 작성일이 표기됩니다." },
    {
      headline: "[기능] 매칭 전 매칭자 연락처 보기",
      date: "2024-01-05",
      contents: "[내 게시물] 페이지의 '매칭 전 게시물'에서 해당 게시물 '매칭 신청자의 연락처'를 볼 수 있습니다.",
    },
    { headline: "[테스트] 공지사항 테스트2", date: "2024-01-03", contents: "테스트 공지사항2의 내용입니다." },
    { headline: "[테스트] 공지사항 테스트1", date: "2024-01-03", contents: "테스트 공지사항1의 내용입니다." },
  ];

  return (
    <>
      <Header />
      <Container>
        <LogoText>Shine Your Way</LogoText>
        {data.map((item, index) => {
          return (
            <>
              <NoticePost key={index} headline={item.headline} date={item.date} contents={item.contents} />
            </>
          );
        })}
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
`;

export const LogoText = styled(MainTitleText)`
  color:#26539C;
  margin:30px 0px;
  font-style:italic;
`

export default Notice;
