function dragElement(elmnt: HTMLElement, nextSong: () => void) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  var rotation = 0;
  var scale = 1;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header")!.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e: any) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: any) {
    console.log("dragging");
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    console.log(
      "pos1: " + pos1,
      "pos2: " + pos2,
      "pos3: " + pos3,
      "pos4: " + pos4
    );
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
    scale = 1 - distance / center;
    elmnt.style.transform =
      "translate(-50%, -50%) rotate(" + rotation + "deg) scale(" + scale + ")";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    var center = window.innerWidth / 2;
    if (elmnt.offsetLeft < center - 200) {
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
    } else if (elmnt.offsetLeft > center + 200) {
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
