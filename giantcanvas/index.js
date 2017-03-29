window.onload = function () {
    const canvas = document.getElementById('canvas');
    const editBtn = document.getElementById('editBtn');

    const ctx = canvas.getContext('2d');
    const img = document.getElementById('img');
    const rangeBox = document.getElementById('rangeBox');

    const radioX = img.naturalWidth / 1024;
    const radioY = img.naturalHeight / 768;
    //根据缩放值改变预览框
    let scale = img.naturalWidth / img.width;
    rangeBox.style.width = 1024 / scale + 'px';
    rangeBox.style.height = 768 / scale + 'px';

    const threshold = img.naturalWidth * img.naturalHeight / 2000000 * 10;

    //允许的偏移量
    allowOffsetX = img.naturalWidth - 1024;
    allowOffsetY = img.naturalWidth - 768;

    let isEdit = false;
    let isDrag = false;
    let isDrawingLine = false;
    //图片位置
    let currentX = 0;
    let currentY = 0;
    //鼠标开始位置及偏移量
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;


    ctx.drawImage(img, currentX, currentY);
    init();
    function startDrag(e) {

        if (isEdit) {
            isDrawingLine = true;
        } else {
            isDrag = true;
        }
        startX = e.clientX;
        startY = e.clientY;
    }
    function stopDrag(e) {
        isDrag = false;
        isDrawingLine = false;
    }

    let timer;
    let last;
    //函数节流
    function throttleDrawImage(x, y) {
        let now = +new Date();
        if (last && now - last < threshold) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                ctx.drawImage(img, x, y);
            }, threshold);
        } else {
            last = now;
        }
    }
    function handleMouseMove(e) {
        if (isEdit && isDrawingLine) {
            drawLine(startX, startY, e.clientX, e.clientY);
            startX = e.clientX;
            startY = e.clientY;
            return;
        }
        function isAllowDrag(x, y) {
            if (x > 0 || y > 0) {
                return false;
            }
            if (-x + 1024 >= img.naturalWidth || -y + 768 >= img.naturalHeight) {
                return false;
            }
            return true;
        }
        if (isDrag) {
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;
            startX = e.clientX;
            startY = e.clientY;
            let tempX = offsetX + currentX;
            let tempY = offsetY + currentY;
            if (!isAllowDrag(tempX, tempY)) {
                return;
            }
            currentX = tempX;
            currentY = tempY;
            throttleDrawImage(currentX, currentY);
            // ctx.drawImage(img, currentX, currentY);
            rangeBox.style.left = - (currentX / scale) + 'px';
            rangeBox.style.top = - (currentY / scale) + 'px';
        }
    }

    
    
    function switchEdit() {
        isEdit = !isEdit;
        canvas.style.cursor = isEdit ? "crosshair" : "move";
        document.getElementById('editBtn').innerHTML = isEdit ? "移动" : "画线";

    }
    function drawLine(startX, startY, endX, endY) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
    function init() {
        canvas.onmousedown = startDrag;
        canvas.onmouseup = stopDrag;
        canvas.onmouseout = stopDrag;
        canvas.onmousemove = handleMouseMove;
        canvas.style.cursor = "move";

        editBtn.onclick = switchEdit;
    }
}