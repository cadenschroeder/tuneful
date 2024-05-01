function dragElement(
  elmnt: HTMLElement,
  nextSong: () => void,
  handleToggle: (i) => void
) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  var rotation = 0;
  var scale = 1;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    document.getElementById(elmnt.id + "header").ontouchstart = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    elmnt.ontouchstart = dragMouseDown;
  }

  function dragMouseDown(e: any) {
    console.log("mousedown");
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:

    if (e.touches) {
      pos3 = e.touches[e.touches.length - 1].clientX;
      pos4 = e.touches[e.touches.length - 1].clientY;
    } else {
      pos3 = e.clientX;
      pos4 = e.clientY;
    }

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;

    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDrag;
  }

  function elementDrag(e: any) {
    const isMobile = !!e.touches;
    e = e || window.event;

    var clientX, clientY;

    if (isMobile) {
      console.log("touchmove1");
      clientX = e.touches[e.touches.length - 1].clientX;
      clientY = e.touches[e.touches.length - 1].clientY;
    } else {
      e.preventDefault();
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // calculate the new cursor position:
    pos1 = pos3 - clientX;
    pos2 = pos4 - clientY;
    pos3 = clientX;
    pos4 = clientY;

    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    // rotate the element. center of screen is 0 deg, left edge is -180, right edge is 180
    var center = window.innerWidth / 2;
    var offset = elmnt.offsetLeft;
    rotation = ((offset - center) / center) * 45;
    elmnt.style.transform = "translate(-50%, -50%) rotate(" + rotation + "deg)";
    // scale the element
    var distance = Math.abs(offset - center);
    scale = isMobile ? 1 - distance / center / 2 : 1 - distance / center;
    elmnt.style.transform =
      "translate(-50%, -50%) rotate(" + rotation + "deg) scale(" + scale + ")";
  }

  function closeDragElement(e: any) {
    const isMobile = !!e.touches;

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    var center = window.innerWidth / 2;
    const isLeft = isMobile
      ? elmnt.offsetLeft < center - 100
      : elmnt.offsetLeft < center - 200;

    const isRight = isMobile
      ? elmnt.offsetLeft > center + 100
      : elmnt.offsetLeft > center + 200;

    const isPause =
      isMobile &&
      elmnt.offsetLeft > center - 10 &&
      elmnt.offsetLeft < center + 10;

    if (isLeft) {
      console.log("left");
      elmnt
        .animate(
          [
            {
              transform:
                "translate(-50%, -50%) rotate(" +
                rotation +
                "deg) scale(" +
                scale +
                ")",
            },
            {
              transform: "translate(-100vw, -50%) rotate(120deg) scale(0)",
            },
          ],
          {
            duration: 300,
            easing: "ease-in-out",
          }
        )
        .finished.then(() => {
          nextSong();
          elmnt.style.top = "50%";
          elmnt.style.left = "50%";
          elmnt
            .animate(
              [
                {
                  transform: "translate(-50%, -50%) rotate(0deg) scale(0)",
                },
                {
                  transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
                },
              ],
              {
                duration: 200,
                easing: "ease-in-out",
              }
            )
            .finished.then(() => {
              elmnt.style.top = "50%";
              elmnt.style.left = "50%";
              elmnt.style.transform = "translate(-50%, -50%) rotate(0deg)";
            });
        });
    } else if (isRight) {
      console.log("right");
      elmnt
        .animate(
          [
            {
              transform:
                "translate(-50%, -50%) rotate(" +
                rotation +
                "deg) scale(" +
                scale +
                ")",
            },
            {
              transform: "translate(100vw, -50%) rotate(120deg) scale(0)",
            },
          ],
          {
            duration: 300,
            easing: "ease-in-out",
          }
        )
        .finished.then(() => {
          nextSong();
          elmnt.style.top = "50%";
          elmnt.style.left = "50%";
          elmnt
            .animate(
              [
                {
                  transform: "translate(-50%, -50%) rotate(0deg) scale(0)",
                },
                {
                  transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
                },
              ],
              {
                duration: 200,
                easing: "ease-in-out",
              }
            )
            .finished.then(() => {
              elmnt.style.top = "50%";
              elmnt.style.left = "50%";
              elmnt.style.transform = "translate(-50%, -50%) rotate(0deg)";
            });
        });
    } else if (isPause) {
      handleToggle();
      elmnt
        .animate(
          [
            {
              transform: "translate(-50%, -50%)",
            },
            {
              transform: "translate(-50%, -50%)",
              top: "50%",
              left: "50%",
              rotate: "0deg",
            },
          ],
          {
            duration: 100,
            easing: "ease-in-out",
          }
        )
        .finished.then(() => {
          elmnt.style.top = "50%";
          elmnt.style.left = "50%";
          elmnt.style.transform = "translate(-50%, -50%) rotate(0deg)";
        });
    } else {
      elmnt
        .animate(
          [
            {
              transform:
                "translate(-50%, -50%) rotate(" + rotation + "deg) scale(1)",
              top: elmnt.style.top,
              left: elmnt.style.left,
            },
            {
              transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
              top: "50%",
              left: "50%",
            },
          ],
          {
            duration: 200,
            easing: "ease-in-out",
          }
        )
        .finished.then(() => {
          elmnt.style.top = "50%";
          elmnt.style.left = "50%";
          elmnt.style.transform = "translate(-50%, -50%) rotate(0deg)";
        });
    }
  }
}

export default dragElement;
