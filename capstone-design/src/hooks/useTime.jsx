export function useTime() {
  ////////// 현재 시간 문자열 반환 함수(년월일시분)
  const currentTime = () => {
    // 현재 시각을 나타내는 JavaScript Date 객체 생성
    const t = new Date();
    // 년, 월, 일, 시, 분, 초 추출
    const year = t.getFullYear();
    const month = String(t.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고, padStart로 두 자리로 만듭니다.
    const day = String(t.getDate()).padStart(2, "0"); // 일도 padStart로 두 자리로 만듭니다.
    const hours = String(t.getHours()).padStart(2, "0"); // 시도 padStart로 두 자리로 만듭니다.
    const minutes = String(t.getMinutes()).padStart(2, "0"); // 분도 padStart로 두 자리로 만듭니다.
    // 현재 시간 생성
    const returnTime = `${year}년${month}월${day}일${hours}시${minutes}분`;
    // 현재 시간 반환
    return returnTime;
  };

  return { currentTime,};
}
