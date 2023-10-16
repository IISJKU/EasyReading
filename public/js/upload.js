let fileData = null;

function loadFile() {
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();
    reader.onloadend = function () {
        fileData = file;
        document.getElementById("upload").style.display = "";
    };
    if (file) {
        reader.readAsDataURL(file);
    }
}

function uploadFile() {
    const formData = new FormData();
    formData.append('file', fileData);
    fetch("/post_image/", {
        method: 'post',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            document.getElementById("current_logo").innerHTML = '<img src="data:image/png;base64, ' + result + '" alt="Preview picture" />';
            document.getElementById("clear").style.display = "";
            document.getElementById("upload").style.display = "none";
            document.getElementById("logo").value = result;
        })
        .catch(error => {
            document.getElementById("result").innerHTML = `Result: Error occurred: ${error}`;
        });
}

function clearFile() {
    document.getElementById("current_logo").innerHTML = "";
    document.getElementById("logo").value = "";
    document.getElementById("upload").style.display = "none";
    document.getElementById("clear").style.display = "none";
    document.getElementById('file_upload').value = "";
}