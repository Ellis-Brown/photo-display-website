export function getImageDownloadUrl(path) {
    if (path.includes("lh3.googleusercontent.com")) {
        return 'https://drive.usercontent.google.com/u/0/uc?id=' + path.split("/").pop() + '&export=download';
    } else if (path.includes("drive.google.com")) {
        const fileId = path.split("/")[5];
        return 'https://drive.usercontent.google.com/u/0/uc?id=' + fileId + '&export=download';
    } else {
        console.log("cannot get image download path for " + path);
        return "";
    }
}

export function getImageDownloadPath(path) {
    const downloadPath = getImageDownloadUrl(path);
    if (downloadPath) {
        window.location.href = downloadPath;
    }
}

export function getImageViewingPath(path) {
    if (!path instanceof String) {
        console.log(path + " is not a string");
        return;
    }
    if (path.includes("lh3.googleusercontent.com")) {
        return path;
    } else if (path.includes("drive.google.com")) {
        const root = "https://lh3.googleusercontent.com/d/";
        const fileId = path.split("/")[5];
        return root + fileId;
    } else {
        console.log("Cannot get image viewing path for " + path);
        return null;
    }
}