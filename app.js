(function () {
  "use strict";

  var LEVELS = [
    { k: "L1", name: "Whiteboard" },
    { k: "L2", name: "Design review" },
    { k: "L3", name: "Production" }
  ];
  var CATS = ["Fundamentals", "Storage", "Distributed", "Async", "Edge", "Architectures"];
  var all = window.SD || [];
  var list = [];
  CATS.forEach(function (cat) {
    all.forEach(function (c) { if (c.cat === cat) list.push(c); });
  });
  var byId = {};
  list.forEach(function (c, i) { c.n = i + 1; byId[c.id] = c; });
  // Reverse index: which architectures use each concept.
  var usedIn = {};
  list.forEach(function (c) {
    (c.concepts || []).forEach(function (id) { (usedIn[id] = usedIn[id] || []).push(c.id); });
  });

  var state = { depth: 1, id: list.length ? list[0].id : null, q: "" };
  try {
    var saved = parseInt(localStorage.getItem("sdd-depth"), 10);
    if (saved >= 0 && saved <= 2) state.depth = saved;
  } catch (e) {}
  var fromHash = location.hash.slice(1);
  if (byId[fromHash]) state.id = fromHash;

  function $(s) { return document.querySelector(s); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }
  function bars(d) { return '<span class="bars" data-lv="' + d + '"><i></i><i></i><i></i></span>'; }

  function matches(c) {
    if (!state.q) return true;
    var hay = (c.name + " " + c.tag + " " + c.cat + " " + c.depths.join(" ") + " " + (c.flow || []).join(" ")).toLowerCase();
    return state.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function renderNav() {
    var html = "";
    CATS.forEach(function (cat) {
      var items = list.filter(function (c) { return c.cat === cat && matches(c); });
      if (!items.length) return;
      html += '<div class="group"><h3>' + cat + "</h3><ul>" + items.map(function (c) {
        return '<li><a href="#' + c.id + '" data-id="' + c.id + '"' +
          (c.id === state.id ? ' aria-current="page"' : "") + "><span>" + c.name +
          '</span><span class="n">' + pad(c.n) + "</span></a></li>";
      }).join("") + "</ul></div>";
    });
    $("#nav").innerHTML = html || '<p class="empty">Nothing matches “' + esc(state.q) + '”.</p>';
  }

  function chips(ids) {
    return ids.filter(function (id) { return byId[id]; }).map(function (id) {
      return '<a href="#' + id + '" data-id="' + id + '">' + byId[id].name + "</a>";
    }).join("");
  }

  function blueprint(c) {
    if (!c.scale && !c.flow) return "";
    var scale = c.scale ? '<h4>Back of the envelope</h4><dl class="scale">' + c.scale.map(function (r) {
      return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>";
    }).join("") + "</dl>" : "";
    var flow = c.flow ? '<h4>Request path</h4><ol class="flow">' + c.flow.map(function (s) {
      return "<li><span>" + s + "</span></li>";
    }).join("") + "</ol>" : "";
    return '<div class="blueprint">' + scale + flow + "</div>";
  }

  function renderSheet() {
    var c = byId[state.id];
    if (!c) return;
    var prev = list[c.n - 2], next = list[c.n];
    var isCase = c.cat === "Architectures";

    var rungs = LEVELS.map(function (L, d) {
      var on = d === state.depth;
      return '<div class="rung' + (on ? " on" : "") + '" data-d="' + d + '">' +
        '<button class="lv" type="button" data-depth="' + d + '" aria-pressed="' + on + '">' +
        bars(d) + "<b>" + L.k + "</b><span>" + L.name + "</span></button>" +
        "<p>" + c.depths[d] + "</p></div>";
    }).join("");

    var nums = c.numbers ? '<div class="nums-wrap"><h4>Numbers to know</h4><table class="nums"><tbody>' +
      c.numbers.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>"; }).join("") +
      "</tbody></table></div>" : "";

    var related = chips(isCase ? c.concepts || [] : c.related || []);
    var seenIn = isCase ? "" : chips(usedIn[c.id] || []);
    var points = c.decisions || c.tradeoffs || [];

    $("#sheet").innerHTML =
      '<article aria-labelledby="concept-title">' +
      '<div class="meta"><span>' + c.cat + "</span><span>" + pad(c.n) + " / " + pad(list.length) + "</span></div>" +
      '<h2 id="concept-title">' + c.name + "</h2>" +
      '<p class="tag">' + c.tag + "</p>" +
      (isCase ? '<p class="note">Reference design for interviews, drawn from public engineering writing. Real internals differ.</p>' : "") +
      blueprint(c) +
      '<div class="ladder">' + rungs + "</div>" +
      '<div class="facts">' +
      "<div><h4>" + (isCase ? "Key decisions" : "Trade-offs") + '</h4><ul class="trade' + (isCase ? " key" : "") + '">' +
      points.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div>" +
      "<div><h4>" + (isCase ? "Follow-up question" : "Interview prompt") + '</h4><div class="ask"><p>' + c.ask + "</p></div>" +
      (related ? '<h4 class="sp">' + (isCase ? "Built from" : "Related") + '</h4><div class="related">' + related + "</div>" : "") +
      (seenIn ? '<h4 class="sp">Seen in</h4><div class="related">' + seenIn + "</div>" : "") +
      "</div></div>" + nums +
      '<nav class="pager" aria-label="Previous and next concept">' +
      (prev ? '<a href="#' + prev.id + '" data-id="' + prev.id + '"><span>Previous</span>' + prev.name + "</a>" : "") +
      (next ? '<a href="#' + next.id + '" data-id="' + next.id + '"><span>Next</span>' + next.name + "</a>" : "") +
      "</nav></article>";
  }

  function renderDial() {
    document.querySelectorAll(".dial [data-depth]").forEach(function (b) {
      b.setAttribute("aria-checked", String(+b.dataset.depth === state.depth));
    });
  }

  function setDepth(d) {
    if (d < 0 || d > 2 || d === state.depth) return;
    state.depth = d;
    try { localStorage.setItem("sdd-depth", String(d)); } catch (e) {}
    renderDial();
    renderSheet();
  }

  function go(id, opts) {
    if (!byId[id]) return;
    state.id = id;
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
    renderNav();
    renderSheet();
    var sheet = $("#sheet");
    if (sheet.getBoundingClientRect().top < 0) sheet.scrollIntoView({ block: "start" });
    if (opts && opts.focus) sheet.focus({ preventScroll: true });
  }

  function setQuery(q) {
    state.q = q.trim();
    renderNav();
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[data-id]");
    if (link) { e.preventDefault(); go(link.dataset.id, { focus: true }); return; }
    var btn = e.target.closest("[data-depth]");
    if (btn) { setDepth(+btn.dataset.depth); return; }
    var rung = e.target.closest(".rung:not(.on)");
    if (rung) setDepth(+rung.dataset.d);
  });
  window.addEventListener("hashchange", function () {
    var id = location.hash.slice(1);
    if (byId[id] && id !== state.id) go(id);
  });

  window.SDApp = {
    go: go,
    setDepth: setDepth,
    setQuery: setQuery,
    state: state,
    visible: function () { return list.filter(matches); },
    neighbor: function (step) {
      var c = byId[state.id];
      return list[c.n - 1 + step];
    }
  };

  renderDial();
  renderNav();
  renderSheet();
})();
