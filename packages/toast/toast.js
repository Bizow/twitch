export const toast = function(str, extraClass = '', timeout = 4000) {
    const div = document.createElement('div');
    div.className = 'toast ' + extraClass;
    div.innerHTML = str;
    setTimeout(function(){
        div.remove()
    }, timeout);
    document.body.appendChild(div);
};