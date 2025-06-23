export function getTimeAgo(dateString) {
  if (!dateString) return '알 수 없음';

  const now = new Date();
  const posted = new Date(dateString);

  if (isNaN(posted)) return '알 수 없음';

  const diff = Math.floor((now - posted) / 1000);
  if (diff < 0) return '미래';

  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
  return `${Math.floor(diff / 31536000)}년 전`;
}
