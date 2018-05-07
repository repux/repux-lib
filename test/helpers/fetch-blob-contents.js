export function fetchBlobContents(blobUrl) {
    return new Promise(resolve => {
        let xmlhttp;

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
            {
                resolve(xmlhttp.responseText);
            }
        };

        xmlhttp.open("GET", blobUrl, false );
        xmlhttp.send();
    });
}
