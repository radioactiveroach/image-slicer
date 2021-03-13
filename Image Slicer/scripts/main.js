
const ctx = $('#canvas')[0].getContext('2d');
const imageInput = $("#imagefile")[0];
const sortorder = $("#sortorder")[0];
const columns = $("#numcol")[0];
const rows = $("#numrow")[0];
const btncrpimg = $("#cropimg")[0];
ctx.fillStyle = "white";
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
const img = new Image();
function dummy() { };
var imgname = "";

function resizeCanvasToImage() {
    const aspectRatio = img.height / img.width;
    ctx.canvas.height = ctx.canvas.width * aspectRatio;
}

function drawGrid() {
    if (img) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    colWidth = ctx.canvas.width / columns.value;
    rowHeight = ctx.canvas.height / rows.value;
    var cellcount = 1;
    if (sortorder.value == "colstorows") {
        for (i = 0; i < columns.value; i++) {
            for (j = 0; j < rows.value; j++) {
                ctx.strokeStyle = "black";
                ctx.strokeRect(i * colWidth, j * rowHeight, colWidth, rowHeight);
                ctx.fillStyle = "black";
                ctx.font = "30px Arial";
                ctx.fillText(String(cellcount), (i * colWidth), 30 + (j * rowHeight));
                ctx.strokeStyle = "white";
                ctx.strokeText(String(cellcount), (i * colWidth), 30 + (j * rowHeight));
                cellcount++;
            }
        }
    } else {
        for (i = 0; i < rows.value; i++) {
            for (j = 0; j < columns.value; j++) {
                ctx.strokeStyle = "black";
                ctx.strokeRect(j * colWidth, i * rowHeight, colWidth, rowHeight);
                ctx.fillStyle = "black";
                ctx.font = "30px Arial";
                ctx.fillText(String(cellcount), (j * colWidth), 30 + (i * rowHeight));
                ctx.strokeStyle = "white";
                ctx.strokeText(String(cellcount), (j * colWidth), 30 + (i * rowHeight));
                cellcount++;
            }
        }
    }
};

function loadImage() {
    selectedFiles = imageInput.files;
    $("#downloads").empty();
    if (!selectedFiles) {
        return;
    }
    const fr = new FileReader();
    fr.addEventListener("load", (ev) => {
        img.addEventListener("load", () => {
            resizeCanvasToImage();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
            drawGrid();
        });
        img.src = ev.target.result;
    });
    if (selectedFiles[0] instanceof (Blob)) {
        fr.readAsDataURL(selectedFiles[0]);
        imgname = selectedFiles[0].name;
    }
};

function insert (ofilename, appstring){
    arrname = ofilename.split(".");
    rname = "";
    for (k = 0; k< arrname.length; k++){
        rname += arrname[k];
        if(k == (arrname.length - 2)) rname+= `${appstring}.`
    }
    return rname;
}

function cropImage() {
    $("#downloads").empty();
    const cropctx = document.createElement("canvas").getContext("2d");
    cropctx.canvas.width = img.width / columns.value;
    cropctx.canvas.height = img.height / rows.value;
    var imgcount = 1;
    var imglink = "";
    if (imgname.length == 0) return;
    if (sortorder.value == "colstorows") {
        for (i = 0; i < columns.value; i++) {
            for (j = 0; j < rows.value; j++) {
                var imgnum = imgcount.toString();

                while (imgnum.length < 2) imgnum = "0" + imgnum; //prepend leading zeros
                cropctx.drawImage(img, i * cropctx.canvas.width, j * cropctx.canvas.height, cropctx.canvas.width, cropctx.canvas.height, 0, 0, cropctx.canvas.width, cropctx.canvas.height);
                imglink = cropctx.canvas.toDataURL();
                fname = insert(imgname, `-${imgnum}`);
                $("#downloads").append(`<li><span>${fname}</span>
                <span><a href="${imglink}" download="${fname}">(Download)</a></span></li>`);
                imgcount++;
            }
        }
    }
    else {
        for (i = 0; i < rows.value; i++) {
            for (j = 0; j < columns.value; j++) {
                var imgnum = imgcount.toString();

                while (imgnum.length < 2) imgnum = "0" + imgnum; //prepend leading zeros
                cropctx.drawImage(img, j * cropctx.canvas.width, i * cropctx.canvas.height, cropctx.canvas.width, cropctx.canvas.height, 0, 0, cropctx.canvas.width, cropctx.canvas.height);
                imglink = cropctx.canvas.toDataURL();
                fname = insert(imgname, `-${imgnum}`);
                $("#downloads").append(`<li><span>${fname}</span>
                <span><a href="${imglink}" download="${fname}">(Download)</a></span></li>`);
                imgcount++;
            }
        }
    }
}

btncrpimg.addEventListener("click", cropImage, false);
sortorder.addEventListener("change", drawGrid, false);
columns.addEventListener("change", drawGrid, false);
rows.addEventListener("change", drawGrid, false);
imageInput.addEventListener("change", loadImage, false);
drawGrid();
