import React from "react";
import styled from "styled-components";
import { BodyText } from "../pages/SignIn";

const StudentCard = ({ info }) => {
  const smsNumber = info.number.slice(1);
  const smsText = `안녕하세요 ${info.name}님, 저는 {이름}입니다. 만나서 반갑습니다 :) \n 이렇게 연락드리게 돼서 반갑고 설레네요. \n 천천히 서로 편한 시간에 약속 잡으면 좋을 것 같아요! \n 잘 부탁드립니다!`;
  
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
            <MessageLink href={`sms:+82${smsNumber}?body=${smsText}`}>
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
