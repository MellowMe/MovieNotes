'use strict';

let addTagBtns = document.querySelectorAll("span.addTagBtn");
let deleteTagBtns = document.querySelectorAll("span.deleteTagBtn");
let cancelDeleteBtns = document.querySelectorAll("span.cancelDeleteBtn");
let addTagInputs = document.querySelectorAll(".addTagInput");

// for (let tag of document.querySelectorAll("span.tag")) {
//     tag.onmouseenter = () => {
//         tag.style.backgroundColor = "#85a2b8";
//     };
//     tag.onmouseleave = () => {
//         tag.style.backgroundColor = "#b6c7d4";
//     }
//     tag.onclick = () => { open("/html/searchPage.html?keyword=" + tag.innerText) };
// }

for (let button of addTagBtns) {
    button.onclick = () => {
        button.style.display = "none";
        button.nextElementSibling.style.display = "none";
        button.nextElementSibling.nextElementSibling.style.display = "inline";
        button.nextElementSibling.nextElementSibling.firstElementChild.focus();
    };
}

for (let button of deleteTagBtns) {
    button.onclick = () => {
        button.style.display = "none";
        button.previousElementSibling.style.display = "none";
        button.nextElementSibling.nextElementSibling.style.display = "inline";
        let tags = Array.from(button.parentElement.children).slice(0, -4);
        for (let tag of tags) {
            tag.onmouseenter = () => {
                tag.style.textDecoration = "line-through";
                tag.style.textDecorationColor = "#ca0c16";
            };
            tag.onmouseleave = () => {
                tag.style.textDecoration = "none";
            }
            tag.onclick = () => {
                let request = new XMLHttpRequest();
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        if (request.status == 200) {
                            tag.remove();
                        }
                    }
                };
                request.open("get", "/deleteTag?movieName=" + tag.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.innerHTML
                    + "&tagName=" + tag.innerHTML);
                request.send();
            };
        }
    };
}

for (let button of cancelDeleteBtns) {
    button.onclick = () => {
        button.style.display = "none";
        let nodes = button.parentElement.children;
        nodes[nodes.length - 3].style.display = "inline";
        nodes[nodes.length - 4].style.display = "inline";
        let tags = Array.from(nodes).slice(0, -4);
        for (let tag of tags) {
            tag.onclick = null;
            tag.onmouseenter = null;
            tag.onmouseleave = null;
        }
    }
}

for (let cancelAddBtn of document.querySelectorAll("span.cancelAddBtn")) {
    cancelAddBtn.onclick = () => {
        cancelAddBtn.parentElement.previousElementSibling.style.display = "inline";
        cancelAddBtn.parentElement.previousElementSibling.previousElementSibling.style.display = "inline";
        cancelAddBtn.parentElement.style.display = "none";
    };
}

for (let input of addTagInputs) {
    input.onfocus = () => {
        document.onkeydown = (event) => {
            if (event.key == "Enter") {
                console.log(input.value);
                if (input.value) {
                    let request = new XMLHttpRequest();
                    request.onreadystatechange = () => {
                        if (request.readyState == 4) {
                            if (request.status == 200) {
                                let tag = document.createElement("span");
                                tag.appendChild(document.createTextNode(input.value));
                                tag.setAttribute("class", "tag");
                                let node = input.parentElement.previousElementSibling.previousElementSibling;
                                node.parentElement.insertBefore(tag, node);
                                input.value = null;
                                input.parentElement.previousElementSibling.style.display = "inline";
                                input.parentElement.previousElementSibling.previousElementSibling.style.display = "inline";
                                input.parentElement.style.display = "none";
                            } else {
                                alert(`${request.status} : ${request.statusText}`);
                            }
                        }
                    }
                    let movieName = input.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.innerHTML;
                    request.open("get", "/addTag?tagName=" + input.value + "&movieName=" + movieName);
                    request.send();
                }
            }
        }
    };
    input.onblur = () => {
        document.onkeydown = null;
    };
}

document.getElementsByTagName("body")[0].onload = () => {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if (request.status == 200) {
                document.querySelector(".weather").innerHTML = request.responseText;
            }
        }
    }
    request.open("get", "/weather");
    request.send();
}
