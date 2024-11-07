import React from "react";
import styled from "styled-components";
import { BodyText } from "../pages/SignIn";

const StudentCard = ({ info }) => {
  return (
    <>
      <Container>
        <Top>
          <SCH>SCH</SCH>
          {/* 내 게시물 신청자 인원 수 반영 */}
          <People>{info.people}인</People>
          {/* <People>{info.people}</People> */}
        </Top>
        <TextWrap>
          <Text>{info.name}</Text>
          <Text>{info.major}</Text>
          <Text>
            {info.gender} / {info.age}세
          </Text>
          <Text>
            <MessageLink href={`sms:+82${info.number.slice(1)}?body=메시지내용`}>
              {info.matching && info.number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}
            </MessageLink>
          </Text>
        </TextWrap>
      </Container>
    </>
  );
};

const MessageLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

const Container = styled.div`
  width: 220px;
  height: 120px;
  border: 1px solid black;
  border-radius: 10px;
  text-align: center;
  overflow: hidden;
`;

const Top = styled.div`
  position: relative;
  background-color: #26539c;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SCH = styled.div`
  color: white;
  font-size: 20px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
`;

const People = styled(BodyText)`
  position: absolute;
  right: 10px;
`;

const TextWrap = styled.div`
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Text = styled(BodyText)`
  color: #111111;
  font-size: 12px;
`;

export default StudentCard;
