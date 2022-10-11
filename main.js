
(function () {
let minimap = document.createElement('div');
let minimapSize = document.createElement('div');
let control = document.createElement('div');
let minimapContent = document.createElement('iframe');
let scale = 0.1;
let realScale;

// Minimap container/content
minimap.className = ("minimap-container")
minimapSize.className = ("minimap-size")
control.className = ("minimap-control")
minimapContent.className = ("minimap-content")
minimap.append(minimapSize, control, minimapContent)
document.body.appendChild(minimap)

const fileContents = document.querySelectorAll(".observe")

// Get HTML text
let html = document.documentElement.outerHTML.replace(/<script([\s\S]*?)>([\s\S]*?)<\/script>/gim,
    "");

    let bodyText = document.querySelector("body").outerHTML
    console.log(bodyText)
let iframeDoc = minimapContent.contentWindow.document


iframeDoc.open();
iframeDoc.write(bodyText);
iframeDoc.close();


// get screen dimensions
const getDimensions = () => {
    let bodyWidth = document.body.clientWidth
    let bodyRatio = document.body.clientHeight / bodyWidth
    let winRatio = window.innerHeight / window.innerWidth

    minimap.style.width = `${scale * 100}%`

    realScale = minimap.clientWidth / bodyWidth

    minimapSize.style.paddingTop = `${bodyRatio * 100}%`

    control.style.paddingTop = `${winRatio * 100}%`

    // Modify the scale of minimap content
    // minimapContent.style.transform = `scale(1)`
    minimapContent.style.transform = `scale(${realScale})`
    minimapContent.style.width = `${(100 /realScale)}%`
    minimapContent.style.height = `${(100 /realScale)}%`
}
getDimensions()
window.addEventListener("resize", getDimensions)
window.addEventListener("load", getDimensions);

const trackScroll = () => {
control.style.transform = `translateY(${window.scrollY * realScale}px)`

    // control.style.transform =
    //   "translate(" +
    //   window.pageXOffset * realScale +
    //   "px, " +
    //   window.pageYOffset * realScale +
    //   "px)";

// Slows down the scroll speed on y axis
// control.style.transform = `translateY(${window.scrollY * 0.01}px)`
}
window.addEventListener("scroll", trackScroll)

const scrollOptions = {rootMargin: "-20%", treshold: 0.2}

const scrollObserver = new IntersectionObserver((entries, scrollObserver)=>{
    entries.forEach(entry=>{
        // console.log(entry)
        if(!entry.isIntersecting) {
            console.log("Not intersecting, minimap position is ", entry.target.style.position )
            // minimap.style.position = "fixed"
            minimap.scrollBy({top: -100, left:0, behavior:"smooth"})
            entry.target.style.borderBottom = "2px solid blue"
            console.log("Entry.target is ", entry.isIntersecting ? "intersecting" : "not intersecting" )
            return
        }
        entry.target.style.borderBottom = "2px solid red"
        // minimap.style.position = "absolute"
          minimap.scrollBy(0, 100)
// minimap.style.transform = `translateY(-${window.scrollY * realScale}px)`

        console.log("It is intersecting, minimap position is ", minimap.style.position)
            console.log("Entry.target is ", entry.isIntersecting ? "intersecting" : "not intersecting" )
        // return scrollObserver.unobserve(entry.target)
        
    })
           
    return  minimap.style.position = "fixed"
}, scrollOptions)

fileContents.forEach(filecontent =>{
    scrollObserver.observe(filecontent)
})

// function pageScroll() {
//     window.scrollBy(0,50); 
//     scrolldelay = setTimeout('pageScroll()',100);
// }


// pageScroll()


////////////////////////////////////////
// Click & Drag Events

  let mouseY = 0,
    mouseX = 0,
    mouseDown = false;

  const pointerDown = (e) => {
    e.preventDefault();
    mouseDown = true;
    mouseX = e.touches ? e.touches[0].clientX : e.clientX;
    mouseY = e.touches ? e.touches[0].clientY : e.clientY;

    let offsetX =
      (mouseX - minimap.offsetLeft - control.clientWidth / 2) / realScale;
    let offsetY =
      (mouseY - minimap.offsetTop - control.clientHeight / 2) / realScale;

     

    window.scrollTo(offsetX, offsetY);
  }
  minimap.addEventListener("mousedown", pointerDown);
  minimap.addEventListener("touchdown", pointerDown);

  const  pointerMove = (e) => {
    if (mouseDown) {
      e.preventDefault();

      let x = e.touches ? e.touches[0].clientX : e.clientX,
        y = e.touches ? e.touches[0].clientY : e.clientY;

      window.scrollBy((x - mouseX) / realScale, (y - mouseY) / realScale);
      mouseX = x;
      mouseY = y;
    }
  }
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("touchmove", pointerMove);

  const pointerReset = () => {
    mouseDown = false;
  }
  window.addEventListener("mouseup", pointerReset);
  window.addEventListener("touchend", pointerReset);

  const pointerLeave = (e) => {
    if (e.target === document.body) {
      mouseDown = false;
    }
  }
  document.body.addEventListener("mouseleave", pointerLeave);
  document.body.addEventListener("touchleave", pointerLeave);
})()