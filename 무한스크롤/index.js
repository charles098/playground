const URL = "https://dog.ceo/api/breeds/image/random";
const IMAGES = 10;
const root = document.getElementById('root');
const imgBox = document.getElementById('img-box');
const target = document.getElementById('target');

//////////////// 보조 함수 //////////////////

// 이미지 fetch 함수
const fetchImage = async () => {
  try {
    const result = await fetch(URL);
    const { message } = await result.json();
    return message;
  } catch(err) {
    console.err(err)
  }
}

// 이미지 요소 생성 함수
const addNewImages = async (n) => {
  try {
    target.classList.toggle('loading');
    const fetchAry = [...new Array(n)].map(async () => {
      return await fetchImage();
    });
    const results = await Promise.all(fetchAry);
    const elements = results.map(getImgComponent).join('');
    imgBox.insertAdjacentHTML('beforeend', elements);
    target.classList.toggle('loading');
  } catch (err) {
    console.err(err);
  }
}

const getImgComponent = (src) => {
  return `
    <img class="image"
    src="${src}"
    alt="dog-image">
    `
}
///////////////////////////////////////////

let load_count = 0; // 로딩 횟수
const MAX_COUNT = 4; // 최대 로딩 횟수

const options = {
  threshold: 0.3
}

const callback = ([entry], observer) => {
  if (entry.isIntersecting) {
    load_count++;
    addNewImages(IMAGES); // 데이터 로딩
    
    if (load_count === MAX_COUNT) {
      observer.disconnect(target);
    }
  }
}

const observer = new IntersectionObserver(callback, options);
observer.observe(target);