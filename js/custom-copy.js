document.addEventListener("copy", function (e) {
  var closest = e.target.closest('.content-text');
  var isContains = document.contains(closest);
  var pathname = window.location.pathname;
  if (closest && isContains && pathname !== '/admin') {
    var selection = window.getSelection();
    var range = window.getSelection().getRangeAt(0);
    var documentFragment = range.cloneContents();
    var wrapContent = document.createElement('div');
    wrapContent.appendChild(documentFragment.cloneNode(true));
    var selectionContents = wrapContent.innerHTML;
    var pagelink = '<br />Xem thêm tại: ' + document.location.href;
    var copytext = selectionContents + pagelink;
    var newDiv = document.createElement('div');
    newDiv.style.position = 'absolute';
    newDiv.style.left = '-99999px';
    newDiv.classList.add('content-text');
    newDiv.innerHTML = copytext;
    document.body.appendChild(newDiv);
    selection.selectAllChildren(newDiv);
    window.setTimeout(function () {
      document.body.removeChild(newDiv);
    }, 100);
  }
});
