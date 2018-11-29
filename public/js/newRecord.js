// 表单页面的一些元素
let reader = new FileReader();
let posterInput = document.getElementById("posterInput");
let photoInput = document.getElementById("photoInput");
let posterImage = document.getElementById("poster");
let photoImage = document.getElementById("photo");
let editImgBtn = document.getElementById("editImgBtn");

// 编辑页面的一些元素
let canvas = document.getElementById("panel");
let cutBnt = document.getElementById("cutBtn");
let filterBtn = document.getElementById("filterBtn");
let brushBtn = document.getElementById("brushBtn");
let recoverBtn = document.getElementById("recoverBtn");
let backBtn = document.getElementById("back");
let menu2 = document.getElementById("secondaryMenu");
let cacheData;

//裁剪的相关变量
let min = document.getElementById("min");
let wrap = document.getElementById("wrap");
let dragFlag = false;
let x, y;
let maxLeft, maxTop;

//滤镜相关的变量
let newImageData;
let old;   //滤镜动作的初始图的data
let data;   //滤镜效果图的新data
let sizeBarInitFlag = false;
let appendZone;

//画笔相关的变量
let context;
let x1, y1, x2, y2;
let drawFlag = false;
let brushColor = "#ff0000";
let brushSize = 4;

function uploadPoster(event) {
    let input = event.target;
    if (input.files && input.files[0]) {
        reader.onload = function () {
            posterImage.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function uploadPhoto(event) {
    let input = event.target;
    if (input.files && input.files[0]) {
        reader.onload = function () {
            photoImage.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
    if (editImgBtn.hasAttribute("disabled"))
        editImgBtn.removeAttribute("disabled");
}

function canvasInit() {
    if (photoImage.naturalWidth <= 900) {
        canvas.width = photoImage.naturalWidth;
        canvas.height = photoImage.naturalHeight;
    } else {
        canvas.width = 900;
        canvas.height = photoImage.naturalHeight * 900 / photoImage.naturalWidth;
    }
    canvas.getContext("2d").drawImage(photoImage, 0, 0, canvas.width, canvas.height);
    wrap.style.width = canvas.width + "px";
    wrap.style.height = canvas.height + "px";
    wrap.style.maxWidth = canvas.width + "px";
    wrap.style.maxHeight = canvas.height + "px";
}

function dragBegin(e) {
    x = e.clientX - wrap.offsetLeft;
    y = e.clientY - wrap.offsetTop;
    dragFlag = true;
}

function dragMove(e) {

    if (dragFlag) {
        wrap.style.left = e.clientX - x + "px";
        wrap.style.top = e.clientY - y + "px";
    }
}

function dragOver() {
    maxLeft = parseInt(getComputedStyle(canvas).width) - parseInt(getComputedStyle(wrap).width);
    maxTop = parseInt(getComputedStyle(canvas).height) - parseInt(getComputedStyle(wrap).height);
    if (wrap.offsetLeft < 0)
        wrap.style.left = "0";
    else if (wrap.offsetLeft > maxLeft)
        wrap.style.left = maxLeft + "px";
    if (wrap.offsetTop < 0)
        wrap.style.top = "0";
    else if (wrap.offsetTop > maxTop)
        wrap.style.top = maxTop + "px";
    dragFlag = false;
}

function cut() {
    let cutWidth = parseInt(getComputedStyle(wrap).width);
    let cutHeight = parseInt(getComputedStyle(wrap).height);
    let data = canvas.getContext('2d').getImageData(wrap.offsetLeft, wrap.offsetTop, cutWidth, cutHeight);
    canvas.width = cutWidth;
    canvas.height = cutHeight;
    canvas.getContext('2d').putImageData(data, 0, 0);
    wrap.style.left = "0";
    wrap.style.top = "0";
    wrap.style.maxWidth = cutWidth + "px";
    wrap.style.maxHeight = cutHeight + "px";
}

function operateInit() {
    let btnArr = [cutBnt, filterBtn, brushBtn, recoverBtn];
    for (let btn of btnArr) {
        btn.disabled = "disabled";
    }
}

function cancelCut() {
    canvas.width = cacheData.width;
    canvas.height = cacheData.height;
    canvas.getContext("2d").putImageData(cacheData, 0, 0);
    wrap.style.width = canvas.width + "px";
    wrap.style.height = canvas.height + "px";
    wrap.style.maxWidth = canvas.width + "px";
    wrap.style.maxHeight = canvas.height + "px";
    operateOver();
    wrap.style.display = "none";
}

function confirmCut() {
    cut();
    operateOver();
    wrap.style.display = "none";
}

function cutInit() {
    operateInit();
    menu2.style.display = "block";
    wrap.style.display = "block";
    menu2.innerHTML = "<div id='cutDiv'>\n" +
        "\t\t\t\t<button id='cancelCutBtn' type='button'>取消</button>&nbsp;&nbsp;\n" +
        "\t\t\t\t<button id='confirmCutBtn' type='button'>确定</button>&nbsp;&nbsp;\n" +
        "\t\t\t</div>" +
        "\t\t\t\t<details id='cutDetails'>\n" +
        "\t\t\t\t<summary id='cutPrompt'>说明</summary>\n" +
        "\t\t\t\t<p>右下角调整截取框大小，按住中间灰块进行拖动</p>\n" +
        "\t\t\t\t</details>";
    cacheData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("cancelCutBtn").onclick = cancelCut;
    document.getElementById("confirmCutBtn").onclick = confirmCut;
    document.getElementById("cutDetails").style.display = "inline";
    document.getElementById("cutDiv").style.display = "inline-block";
    document.getElementById("cutDiv").style.verticalAlign = "top";
    let prompt = document.getElementById("cutPrompt");
    prompt.style.color = "#db7c2e";
    prompt.style.fontSize = "14px";
    prompt.style.fontStyle = "italic";
    document.onmousemove = dragMove;
    document.onmouseup = dragOver;
}

function filterInit() {
    operateInit();
    menu2.style.display = "block";
    menu2.innerHTML = "<div id=\"filter\">\n" +
        "\t\t\t\t<form>\n" +
        "\t\t\t\t\t<label for=\"grey\">灰调</label><input id=\"grey\" type=\"radio\" name='filter' />&nbsp;&nbsp;\n" +
        "\t\t\t\t\t<label for=\"blackWhite\">黑白</label><input id=\"blackWhite\" type=\"radio\" name='filter' />&nbsp;&nbsp;\n" +
        "\t\t\t\t\t<label for=\"carve\">浮雕</label><input id=\"carve\" type=\"radio\" name='filter' />&nbsp;&nbsp;\n" +
        "\t\t\t\t\t<label for=\"reverse\">反色</label><input id=\"reverse\" type=\"radio\" name='filter' />&nbsp;&nbsp;\n" +
        "\t\t\t\t\t<label for=\"blur\">模糊</label><input id=\"blur\" type=\"radio\" name='filter' />&nbsp;&nbsp;\n" +
        "\t\t\t\t\t<label for=\"mosaic\">马赛克</label><input id=\"mosaic\" type=\"radio\" name='filter' />&nbsp;&nbsp;\n" +
        "\t\t\t\t\t<label for=\"none\">无滤镜</label><input id=\"none\" type=\"radio\" name='filter' checked/>&nbsp;&nbsp;\n" +
        "\t\t\t\t\t<button id=\"filterOverBtn\" type='button'>确定</button>\n" +
        "\t\t\t\t<span id='flowing'></span>\n" +
        "\t\t\t\t</form>\n" +
        "\t\t\t</div>";
    document.getElementById("none").onchange = filterNone;
    document.getElementById("grey").onchange = filterGrey;
    document.getElementById("blackWhite").onchange = filterBlackWhite;
    document.getElementById("carve").onchange = filterCarve;
    document.getElementById("reverse").onchange = filterReverse;
    document.getElementById("blur").onchange = filterBlur;
    document.getElementById("mosaic").onchange = filterMosaic;
    document.getElementById("filterOverBtn").onclick = operateOver;
    cacheData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    newImageData = new ImageData(cacheData.width, cacheData.height);
    data = newImageData.data;
    old = cacheData.data;
    appendZone = document.getElementById("flowing");
}

function brushInit() {
    operateInit();
    menu2.style.display = "block";
    cacheData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    menu2.innerHTML = "\t\t\t<button id='drawCancelBtn' type='button'>取消</button>&nbsp;&nbsp;\n" +
        "\t\t\t<button id='drawConfirmBtn' type='button'>确定</button>&nbsp;&nbsp;\n" +
        "\t\t\t<input id='brushColorChooser' type='color' value='#ff0000'/>&nbsp;&nbsp;\n" +
        "\t\t\t<label for='brushSizeBar'>线粗</label><input id='brushSizeBar' " +
        "type='range' value='4'  step='1' max='16' min='1'/>";
    document.getElementById("brushColorChooser").value = brushColor;
    document.getElementById("brushSizeBar").value = brushSize;
    context = canvas.getContext("2d");
    context.lineCap = "round";
    canvas.style.cursor = "crosshair";
    canvas.onmousedown = drawStart;
    canvas.onmousemove = drawing;
    document.onmouseup = drawEnd;
    document.getElementById("drawCancelBtn").onclick = drawCancel;
    document.getElementById("drawConfirmBtn").onclick = drawConfirm;
}

function drawStart(e) {
    drawFlag = true;
    x1 = e.offsetX;
    y1 = e.offsetY;
    brushColor = document.getElementById("brushColorChooser").value;
    brushSize = document.getElementById("brushSizeBar").value;
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
}

function drawing(e) {
    if (drawFlag) {
        x2 = e.offsetX;
        y2 = e.offsetY;
        draw(x1, y1, x2, y2);
    }
}

function draw(num1, num2, num3, num4) {
    if (drawFlag)
        context.beginPath();
    context.moveTo(num1, num2);
    context.lineTo(num3, num4);
    context.stroke();
    if (drawFlag) {
        x1 = x2;
        y1 = y2;
    }
}

function drawEnd() {
    drawFlag = false;
    context.save();
}

function drawAllDone() {
    canvas.style.cursor = "auto";
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    document.onmouseup = null;
    if (document.getElementById("brushColorChooser")) {
        brushColor = document.getElementById("brushColorChooser").value;
        brushSize = document.getElementById("brushSizeBar").value;
    }
}

function drawCancel() {
    context.putImageData(cacheData, 0, 0);
    operateOver();
    drawAllDone();
}

function drawConfirm() {
    operateOver();
    drawAllDone();
}


function filterNone() {
    sizeBarDestroy();
    canvas.getContext("2d").putImageData(cacheData, 0, 0);
}

function filterBlackWhite() {
    sizeBarDestroy();
    let red, green, blue, grey;
    for (let i = 0, len = data.length; i < len; i += 4) {
        red = old[i];
        green = old[i + 1];
        blue = old[i + 2];
        grey = red * 0.3 + green * 0.59 + blue * 0.11;
        if (grey > 125) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
        } else {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
        }
        data[i + 3] = old[i + 3];
    }
    canvas.getContext("2d").putImageData(newImageData, 0, 0);
}

function filterGrey() {
    sizeBarDestroy();
    let red, green, blue, grey;
    for (let i = 0, len = data.length; i < len; i += 4) {
        red = old[i];
        green = old[i + 1];
        blue = old[i + 2];
        grey = red * 0.3 + green * 0.59 + blue * 0.11;
        data[i] = grey;
        data[i + 1] = grey;
        data[i + 2] = grey;
        data[i + 3] = old[i + 3];
    }
    canvas.getContext("2d").putImageData(newImageData, 0, 0);
}

function filterCarve() {
    sizeBarDestroy();
    let avg;
    let width = newImageData.width;
    for (let i = 0, len = data.length; i < len; i += 4) {
        if ((i + 4) % (width * 4) === 0) {
            data[i] = data[i - 4];
            data[i + 1] = data[i - 3];
            data[i + 2] = data[i - 2];
        } else {
            data[i] = old[i] - old[i + 4] + 128;
            data[i + 1] = old[i + 1] - old[i + 5] + 128;
            data[i + 2] = old[i + 2] - old[i + 6] + 128;
            avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
        data[i + 3] = old[i + 3];
    }
    canvas.getContext("2d").putImageData(newImageData, 0, 0);
}

function filterReverse() {
    sizeBarDestroy();
    let red, green, blue;
    for (let i = 0, len = data.length; i < len; i += 4) {
        red = old[i];
        green = old[i + 1];
        blue = old[i + 2];
        data[i] = 255 - red;
        data[i + 1] = 255 - green;
        data[i + 2] = 255 - blue;
        data[i + 3] = old[i + 3];
    }
    canvas.getContext("2d").putImageData(newImageData, 0, 0);
}

function sizeBarInit() {
    appendZone.innerHTML = "<label for = 'sizeBar'>尺度</label>" +
        "<input id='sizeBar' type='range' min='1' max='10' step='1' value='4' />";
    sizeBarInitFlag = true;
}

function sizeBarDestroy() {
    appendZone.innerText = "";
    sizeBarInitFlag = false;
}

function filterBlur() {
    if (!sizeBarInitFlag) {
        sizeBarInit();
    }
    document.getElementById("sizeBar").onchange = filterBlur;
    let size = Number.parseInt(document.getElementById("sizeBar").value);
    let count = Math.pow((size * 2 + 1), 2) - 1;
    let width = newImageData.width;
    let height = newImageData.height;
    let p;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let totalR = 0, totalG = 0, totalB = 0;
            for (let dx = i - size; dx <= i + size; dx++) {
                for (let dy = j - size; dy <= j + size; dy++) {
                    p = dx * width + dy;
                    if (dx === i && dy === j) continue;
                    (old[p * 4]) && (totalR += old[p * 4]);
                    (old[p * 4 + 1]) && (totalG += old[p * 4 + 1]);
                    (old[p * 4 + 2]) && (totalB += old[p * 4 + 2]);
                }
            }
            p = i * width + j;
            data[p * 4] = totalR / count;
            data[p * 4 + 1] = totalG / count;
            data[p * 4 + 2] = totalB / count;
            data[p * 4 + 3] = old[p * 4 + 3];
        }
    }
    canvas.getContext("2d").putImageData(newImageData, 0, 0);
}

function filterMosaic() {
    if (!sizeBarInitFlag) {
        sizeBarInit();
    }
    document.getElementById("sizeBar").onchange = filterMosaic;
    let size = 2 * Number.parseInt(document.getElementById("sizeBar").value);
    let count = size * size;
    let width = newImageData.width;
    let height = newImageData.height;
    let p;
    for (let i = 0; i < height; i += size) {
        for (let j = 0; j < width; j += size) {
            let totalR = 0, totalG = 0, totalB = 0;
            for (let dx = 0; dx < size; dx++) {
                for (let dy = 0; dy < size; dy++) {
                    p = (i + dx) * width + j + dy;
                    (old[p * 4]) && (totalR += old[p * 4]);
                    (old[p * 4 + 1]) && (totalG += old[p * 4 + 1]);
                    (old[p * 4 + 2]) && (totalB += old[p * 4 + 2]);
                }
            }
            let avgR = totalR / count;
            let avgG = totalG / count;
            let avgB = totalB / count;
            for (let dx = 0; dx < size; dx++) {
                for (let dy = 0; dy < size; dy++) {
                    p = (i + dx) * width + j + dy;
                    data[p * 4] = avgR;
                    data[p * 4 + 1] = avgG;
                    data[p * 4 + 2] = avgB;
                    data[p * 4 + 3] = old[p * 4 + 3];
                }
            }
        }
    }
    canvas.getContext("2d").putImageData(newImageData, 0, 0);
}

function operateOver() {
    let btnArr = [cutBnt, filterBtn, brushBtn, recoverBtn];
    for (let btn of btnArr) {
        if (btn.hasAttribute("disabled"))
            btn.removeAttribute("disabled");
    }
    menu2.style.display = "none";
}

backBtn.onclick = function () {
    operateOver();
    drawAllDone();
    sizeBarInitFlag = false;
    menu2.innerHTML = "";
    menu2.style.display = "none";
    document.getElementById("above").style.display = "none";
    photoImage.src = canvas.toDataURL("image/jpeg");
};
cutBnt.onclick = cutInit;
filterBtn.onclick = filterInit;
brushBtn.onclick = brushInit;
recoverBtn.onclick = canvasInit;
document.getElementById("cancelBtn").onclick = function () {
    operateOver();
    drawAllDone();
    sizeBarInitFlag = false;
    menu2.innerHTML = "";
    menu2.style.display = "none";
    document.getElementById("above").style.display = "none";
};
editImgBtn.onclick = function () {
    document.getElementById("above").style.display = "block";
    canvasInit();
};
min.onmousedown = dragBegin;
posterInput.onchange = uploadPoster;
photoInput.onchange = uploadPhoto;

document.querySelector("#postBtn").onclick = function () {
    let urldatas = photoImage.src.split(",");
    let bstr = atob(urldatas[1]);
    let n = bstr.length;
    let ab = new ArrayBuffer(n);
    let u8arr = new Uint8Array(ab);
    for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }
    let blob = new Blob([ab], { type: "image/jpeg" });
    let formData = new FormData(document.querySelector("#recordForm"));
    formData.set("photo", blob, "photo.jpg");
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let ans = window.confirm("上传成功，要回到主页吗？")
                if (ans) {
                    window.location = "/userpage";
                }
            }
        }
    }
    if (document.getElementById("movieId").value > 0) {
        formData.delete("movieName");
        formData.delete("poster");
        formData.delete("director");
        formData.delete("writer");
        formData.delete("actors");
        formData.delete("type");
        formData.delete("region");
        formData.delete("releaseDate");
        formData.delete("duration");
        formData.delete("introduction");
    } else {
        formData.delete("movieId");
    }
    request.open("post", "/postNewRecord");
    request.send(formData);
};

document.querySelector("#movieNameInput").onchange = () => {
    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                if (request.responseText) {
                    let movie = JSON.parse(request.responseText);
                    document.getElementById("message").innerText = "该电影的信息已为您找到";
                    posterImage.src = "/upload/imgs/" + movie.poster;
                    document.getElementById("movieId").value = movie.id;
                    document.getElementById("director").value = movie.director;
                    document.getElementById("writer").value = movie.writer;
                    document.getElementById("actors").value = movie.actor;
                    document.getElementById("movieType").value = movie.type;
                    document.getElementById("region").value = movie.region;
                    document.getElementById("releaseDate").value = movie.releaseDate;
                    document.getElementById("duration").value = movie.duration;
                    document.getElementById("introduction").value = movie.intro;
                } else {
                    document.getElementById("message").innerText = "该电影资料不存在,请手动添加";
                    posterImage.src = null;
                    document.getElementById("movieId").value = -1;
                    document.getElementById("director").value = null;
                    document.getElementById("writer").value = null;
                    document.getElementById("actors").value = null;
                    document.getElementById("movieType").value = null;
                    document.getElementById("region").value = null;
                    document.getElementById("releaseDate").value = null;
                    document.getElementById("duration").value = null;
                    document.getElementById("introduction").value = null;
                }
            } else {
                document.getElementById("message").innerText = `${request.status} : ${request.statusText}`;
            }
        }
    }
    request.open("get", "/movieInfo?movieName=" + document.querySelector("#movieNameInput").value);
    request.send();
}