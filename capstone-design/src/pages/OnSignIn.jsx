import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const OnSignIn = () => {
  const location = useLocation(); // useNavigate 프롭스 전달 받기

  // 유저아이디를 기반으로 회원 정보 가져오기
  const [userData, setUserData] = useState(null);
  const firestoreRead = async () => {
    const docRef = doc(db, "cities", location.state.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserData(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    firestoreRead();
  }, []);

  // location.state로 접근해서 필요한 데이터 사용
  // console.log("네비게이트 전달 데이터\n"+ JSON.stringify(location.uid, null, 2));
  console.log("네비게이트 전달 데이터\n" + location.state.uid);
  return (
    <div>
      OnSignIn
      {userData && userData.name}
    </div>
  );
};

export default OnSignIn;
