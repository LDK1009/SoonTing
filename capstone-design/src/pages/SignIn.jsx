import React, { useState } from "react";
import { auth, db, provider } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router";

const SignIn = () => {
  const [readData, setReadData] = useState(null);
  const navigate = useNavigate();

  //로그인 함수
  const GoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; // 토큰
        const user = result.user; // 유저 데이터
        // console.log("유저 데이터!!!" + JSON.stringify(user, null, 2));
        isUserSignUp(user); // 회원가입 여부 판단
      })
      .catch((error) => {
        console.log(
          "\nerrorCode : " +
            error.code +
            "\nerrorMessage : " +
            error.message +
            "\nemail : " +
            error.email + // 수정된 부분
            "\ncredential : " +
            GoogleAuthProvider.credentialFromError(error)
        );
      });
  };

  // 회원가입파이어스토어 문서 추가하기
  const addDoc = async (userId) => {
    await setDoc(doc(db, "cities", userId), {
      //컬렉션과 문서명을 지정한다
      name: "Los Angeles",
      state: "CA5",
      country: "USA",
    });
  };
  // testFunc();

  // 파이어스토어 문서 읽기
  const firestoreRead = async () => {
    const docRef = doc(db, "cities", "LA");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setReadData(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  // 회원가입 여부 판단
  const isUserSignUp = async (userData) => {
    const docRef = doc(db, "cities", userData.uid);
    const docSnap = await getDoc(docRef);

    // 기존 유저의 경우
    if (docSnap.exists()) {
      // OnSignIn 페이지로 로드하면서 props로 저장되어 있던 기존 유저 데이터를 전달한다.
      // console.log("유저 아이디" + userData.uid);
      navigate("/OnSignIn", {
        state: { uid: userData.uid },
      });
    }
    // 신규 유저의 경우
    else {
      // cities 컬렉션에 uid 이름의 문서를 생성하고 유저의 정보를 저장한다.
      await setDoc(doc(db, "cities", userData.uid), {
        //컬렉션과 문서명을 지정한다
        name: userData.displayName,
        email: userData.email,
      });
      navigate("/OnSignIn", {
        state: { uid: userData.uid },
      });
    }
  };

  return (
    <div>
      {/* {userData && userData.uid} */}
      <button onClick={() => GoogleSignIn()}>로그인</button>
      {/* <div>{readData && readData.name}</div> */}
    </div>
  );
};

export default SignIn;
