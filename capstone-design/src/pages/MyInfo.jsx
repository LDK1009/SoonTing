import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import TextField from "@mui/material/TextField";

const MyInfo = () => {
  const navigate = useNavigate(); // 네비게이트 변수
  const location = useLocation(); // useNavigate 프롭스 전달 받기
  const Uid = location.state.uid; // 네비게이트로 전달 받은 uid
  console.log("내정보 페이지에서 넘겨받은 데이터 : " + location.state.uid);

  // 업데이트할 유저 정보
  const [form, setForm] = useState({
    uid: "",
    email: "",
    name: "",
    gender: "",
    age: "",
    people: "",
    major: "",
    number: "",
  });

  ////////// 현재 유저 정보 불러오기
  const ReadUserData = async () => {
    const docRef = doc(db, "users", Uid);
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
    if (form.name && form.gender && form.age && form.people && form.major && form.number) {
      await setDoc(doc(db, "users", Uid), {
        ...form, // 입력값이 갱신된 유저 정보로 문서를 덮어 씌운다
      });
      alert("수정완료"); // 수정완료 메시지
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
    // "남자"로 gender를 업데이트
    setForm((prevForm) => ({
      ...prevForm,
      gender: "남자",
    }));
  };

  ////////// 성별 변경(여자)
  const ChangeGenderFemale = () => {
    // "여자"로 gender를 업데이트
    setForm((prevForm) => ({
      ...prevForm,
      gender: "여자",
    }));
  };

  return (
    <>
      <div>내정보 페이지입니다.</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          id="outlined-required"
          label="이름"
          value={form.name} // form 객체의 username 키의 value에 해당하는 값을 value로 사용
          name="name" // name을 username으로 설정하여 form 객체의 username 키의 값을 변경할 수 있도록한다
          onChange={onChange} // onChange 시에 onChange 함수 호출
        />
        <TextField
          id="outlined-required"
          label="학과"
          value={form.major} // form 객체의 username 키의 value에 해당하는 값을 value로 사용
          name="major" // name을 username으로 설정하여 form 객체의 username 키의 값을 변경할 수 있도록한다
          onChange={onChange} // onChange 시에 onChange 함수 호출
        />
        <button onClick={ChangeGenderMale}>남자</button>
        <button onClick={ChangeGenderFemale}>여자</button>
        <TextField
          id="outlined-number"
          label="나이"
          type="number"
          value={form.age} // 위와 동일
          name="age"
          onChange={onChange} // 위와 동일
        />
        <TextField
          id="outlined-number"
          label="인원"
          type="number"
          value={form.people} // form 객체의 username 키의 value에 해당하는 값을 value로 사용
          name="people" // name을 username으로 설정하여 form 객체의 username 키의 값을 변경할 수 있도록한다
          onChange={onChange} // onChange 시에 onChange 함수 호출
        />
        <TextField
          id="outlined-number"
          label="전화번호 ('-' 없이 작성)"
          type="number"
          value={form.number} // form 객체의 username 키의 value에 해당하는 값을 value로 사용
          name="number" // name을 username으로 설정하여 form 객체의 username 키의 값을 변경할 수 있도록한다
          onChange={onChange} // onChange 시에 onChange 함수 호출
        />
      </div>
      <button onClick={setMyInfo}>수정하기</button>
    </>
  );
};

export default MyInfo;
