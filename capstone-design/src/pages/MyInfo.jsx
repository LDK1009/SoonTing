import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import { WriteButton } from "../components/AddArticle";
import Header from "../components/Header";
import MyStudentCard from "../components/MyStudentCard";
import { CategortItemButton } from "./Main";
import { BodyBlurText } from "./SignIn";

const MyInfo = () => {
  const navigate = useNavigate(); // 네비게이트 변수
  const location = useLocation(); // useNavigate 프롭스 전달 받기
  const uid = location.state.uid; // 네비게이트로 전달 받은 uid
  console.log("내정보 페이지에서 넘겨받은 데이터 : " + location.state.uid);

  // 업데이트할 유저 정보
  const [form, setForm] = useState({
    uid: "",
    email: "",
    name: "",
    gender: "",
    age: "",
    major: "",
    number: "",
  });

  const [genderMale, setGenderMale] = useState(null);
  const [genderFemale, setGenderFemale] = useState(null);

  ////////// 현재 유저 정보 불러오기
  const ReadUserData = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    // 유저 문서가 있을 경우
    if (docSnap.exists()) {
      setForm(() => docSnap.data()); // DB에 저장되어 있던 유저 정보를 불러와 보여준다.
    }
    // 유저 문서가 없을 경우
    else {
      alert("회원정보 불러오기 실패");
      navigate("/Main");
    }
  };

  ////////// 입력 감지
  const onChange = (e) => {
    const nextForm = {
      ...form, // 기존 form을 복사하여
      [e.target.name]: e.target.value, // event가 발생한 input 요소의 name 값을 입력값으로 변경
    };
    setForm(nextForm); // 수정 내용 갱신
  };

  ////////// 수정 완료
  const setMyInfo = async () => {
    if (form.name && form.gender && form.age && form.major && form.number) {
      await setDoc(doc(db, "users", uid), {
        ...form, // 입력값이 갱신된 유저 정보로 문서를 덮어 씌운다
      });
      alert("수정완료"); // 수정완료 메시지
      navigate("/Main", {
        state: { uid: uid },
      });
    } else {
      alert("회원정보를 모두 작성해주세요😥");
    }
  };

  ////////// 마운트
  useEffect(() => {
    ReadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ////////// 성별 변경(남자)
  const ChangeGenderMale = () => {
    // form 데이터를 "남자"로 업데이트
    setForm((prevForm) => ({
      ...prevForm,
      gender: "남자",
    }));
    // 버튼 색상 변경
    setGenderFemale(false);
    setGenderMale((prev) => !prev);
  };

  ////////// 성별 변경(여자)
  const ChangeGenderFemale = () => {
    // form 데이터를 "여자"로 업데이트
    setForm((prevForm) => ({
      ...prevForm,
      gender: "여자",
    }));
    // 버튼 색상 변경
    setGenderMale(false);
    setGenderFemale((prev) => !prev);
  };

  ////////// 마운트
  useEffect(() => {
    if (form.gender === "남자") {
      setGenderMale(true);
    }
    if (form.gender === "여자") {
      setGenderFemale(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  //////////////////////////////////////////////////렌더링//////////////////////////////////////////////////
  return (
    <>
      <Header />
      <Container>
        <MyStudentCard style={{ margin: "30px 0px 50px 0px" }} />
        <StyledTextField
          id="outlined-required"
          label="이름"
          value={form.name} // form 객체의 username 키의 value에 해당하는 값을 value로 사용
          name="name" // name을 username으로 설정하여 form 객체의 username 키의 값을 변경할 수 있도록한다
          onChange={onChange} // onChange 시에 onChange 함수 호출
        />
        <StyledTextField
          id="outlined-required"
          label="학과"
          value={form.major} // form 객체의 username 키의 value에 해당하는 값을 value로 사용
          name="major" // name을 username으로 설정하여 form 객체의 username 키의 값을 변경할 수 있도록한다
          onChange={onChange} // onChange 시에 onChange 함수 호출
        />
        <SelectGender>
          <GenderButton isSelect={genderMale} onClick={ChangeGenderMale}>
            남자
          </GenderButton>
          <GenderButton isSelect={genderFemale} onClick={ChangeGenderFemale}>
            여자
          </GenderButton>
        </SelectGender>
        <StyledTextField
          id="outlined-number"
          label="나이"
          type="number"
          value={form.age} // 위와 동일
          name="age"
          onChange={onChange} // 위와 동일
        />
        <StyledTextField
          id="outlined-number"
          label="전화번호 ('-' 없이 작성)"
          type="number"
          value={form.number} // form 객체의 username 키의 value에 해당하는 값을 value로 사용
          name="number" // name을 username으로 설정하여 form 객체의 username 키의 값을 변경할 수 있도록한다
          onChange={onChange} // onChange 시에 onChange 함수 호출
        />
        <WarningText>입력하신 정보는<span style={{fontWeight:'bold'}}> '순팅' </span>외에 다른 목적으로 사용되지 않습니다.</WarningText>
        <ModifyButton onClick={setMyInfo}>수정완료</ModifyButton>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModifyButton = styled(WriteButton)`
margin-top:30px;
`;

const SelectGender = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 220px;
`;

export const GenderButton = styled(CategortItemButton)`
  width: 100px;
`;

//  
const WarningText = styled(BodyBlurText)`
  margin-top:35px;
`;

const StyledTextField = styled(TextField)`
  &.MuiFormControl-root {
    margin-bottom: 30px;
  }
`;
export default MyInfo;
