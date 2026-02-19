(function(document, navigator, standalone) {
    // แก้ปัญหาลิงก์ใน iOS Web App เปิดใน Safari
    if ((standalone in navigator) && navigator[standalone]) {
        var curnode, location = document.location, stop = /^(a|html)$/i;
        document.addEventListener('click', function(e) {
            curnode = e.target;
            while (curnode && !stop.test(curnode.nodeName)) {
                curnode = curnode.parentNode;
            }
            if (curnode && 'href' in curnode && (curnode.href.indexOf('http') || ~curnode.href.indexOf(location.host)) && !curnode.getAttribute('target')) {
                e.preventDefault();
                window.location.href = curnode.href;
            }
        }, false);
    }
})(document, window.navigator, 'standalone');
