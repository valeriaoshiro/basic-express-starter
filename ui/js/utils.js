export function getJSON(url) {

    return new Promise( (resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Pragma', 'no-cache');
        xhr.setRequestHeader('Cache-Control', 'no-cache, no-store');
        xhr.withCredentials = true;

        xhr.onreadystatechange = () => {
            if(xhr.readyState < 4) {
                return;
            }

            if(xhr.status !== 200) {
                reject(xhr.response);
            }

            if(xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response));
            }
        }
        xhr.send();
    });
}
