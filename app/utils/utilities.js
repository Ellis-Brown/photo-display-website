export function getImageDownloadPath(path) {
    if (path.includes("lh3.googleusercontent.com")) {
        // Redirect the user to this page: 
        // https://drive.usercontent.google.com/u/0/uc?id={XXXXX}&export=download
        const downloadPath = 'https://drive.usercontent.google.com/u/0/uc?id=' + path.split("/").pop() + '&export=download';
        window.location.href = downloadPath;
    } else if (path.includes("drive.google.com")) {
        // Extract the id from the file, which follows the /d and goes to the /view
        const fileId = path.split("/")[5];
        const downloadPath = 'https://drive.usercontent.google.com/u/0/uc?id=' + fileId + '&export=download';
        window.location.href = downloadPath;
    }
    else {
        // alert("Download not supported for this image source. Please let ellis know of the error and what you were doing.");
        console.log("cannot get image download path for " + path);
        return "";
    }
}

export function getImageViewingPath(path) {
    if (!path instanceof String) {
        console.log(path + " is not a string");
        return;
    }
    console.log("Getting viewing path for " + path);
    if (path.includes("lh3.googleusercontent.com")) {
        return path;
    } else if (path.includes("drive.google.com")) {
        const root = "https://lh3.googleusercontent.com/d/";
        const fileId = path.split("/")[5];
        return root + fileId;
    } else {
        console.log("Cannot get image viewing path for " + path);
        return "";
    }
}