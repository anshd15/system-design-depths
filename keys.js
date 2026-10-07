(function () {
  "use strict";
  var app = window.SDApp;
  if (!app) return;
  var input = document.getElementById("q");

  input.addEventListener("input", function () { app.setQuery(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var first = app.visible()[0];
      if (first) { app.go(first.id, { focus: true }); input.blur(); }
    } else if (e.key === "Escape") {
      input.value = "";
      app.setQuery("");
      input.blur();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;

    if (e.key === "/") { e.preventDefault(); input.focus(); input.select(); return; }
    if (e.key === "1" || e.key === "2" || e.key === "3") { app.setDepth(+e.key - 1); return; }
    if (e.key === "j" || e.key === "k") {
      var c = app.neighbor(e.key === "j" ? 1 : -1);
      if (c) app.go(c.id);
    }
  });
})();
