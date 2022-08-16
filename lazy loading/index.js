const URL = "https://dog.ceo/api/breeds/image/random";
const IMAGES = 10; // 한번에 fetch하는 이미지 수
let load_count = 0; // 로딩 횟수
const MAX_COUNT = 4; // 최대 로딩 횟수

const root = document.getElementById('root');
const imgBox = document.getElementById('img-box');
const target = document.getElementById('target');


//////////////// 1. 보조 함수 //////////////////
// 1-1) 이미지 fetch 함수
const fetchImage = async () => {
  try {
    const result = await fetch(URL);
    const { message } = await result.json();
    return message;
  } catch(err) {
    console.err(err)
  }
}

// 1-2) 이미지 요소 생성 함수
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

// 1-3) img 요소 생성
const getImgComponent = (src) => {
  return `
    <img 
    class="image lazyload"
    data-src="${src}"
    alt="dog-image">
    `
}
///////////////////////////////////////////


/////////////2. 이미지 lazy-loading////////////
// 2-1) lazyObserver 콜백함수
const lazyHandler = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      entry.target.classList.add('loaded');
      observer.unobserve(entry.target);
    }
  })
}

// 2-2) lazy-loading observer 생성 
const lazyObserver = new IntersectionObserver(lazyHandler)
///////////////////////////////////////////


/////////////////3. 무한 스크롤///////////////
const options = {
  threshold: 0.3
}

const callback = async ([entry], observer) => {
  if (entry.isIntersecting) {
    await addNewImages(IMAGES); // 데이터 로딩
    
    // lazy-loading 등록
    const from = IMAGES * load_count;
    const to = IMAGES * (load_count + 1);
    const images = Array
                    .from(imgBox.querySelectorAll('.lazyload'))
                    .slice(from, to);
    images.forEach(image => lazyObserver.observe(image))
    
    load_count++;
    if (load_count === MAX_COUNT) {
      observer.disconnect(target);
    }
  }
}

const observer = new IntersectionObserver(callback);
observer.observe(target);
///////////////////////////////////////////