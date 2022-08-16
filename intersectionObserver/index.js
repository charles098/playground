// elements
const boxes = document.querySelectorAll('.box');
const Econtents = document.querySelector('.contents');
const opacityImage = document.querySelector('.opacity-image');


// options
const shakeOptions = { threshold: 0.2 };
const opacityOptions = { threshold: [...new Array(101)].map((_, i) => i / 100) };


// callback handler
const handleShake = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('shake');
        } else {
            entry.target.classList.remove('shake');
        }
    })
}

const handleOpacity = ([entry], observer) => {
    entry.target.style.opacity = entry.intersectionRatio;
}

const handleFadeOut = ([entry], observer) => {
    if (entry.isIntersecting) {
        const contents = entry.target.querySelectorAll('.content');
        [0, 3].forEach(i => contents[i].classList.add('first-in'));
        [1, 2].forEach(i => contents[i].classList.add('second-in'));
        observer.disconnect(entry.target);
    }
}


// observer
const shakeObserver = new IntersectionObserver(handleShake, shakeOptions);
const fadeOutObserver = new IntersectionObserver(handleFadeOut);
const opacityObserver = new IntersectionObserver(handleOpacity, opacityOptions);


// subscribe
boxes.forEach(box => shakeObserver.observe(box))
fadeOutObserver.observe(Econtents);
opacityObserver.observe(opacityImage);