// Fair-housing wording checker for listing copy. Runs in the browser and in
// node (module.exports) for tests. Nothing typed is sent anywhere.
(function () {
  // level: "avoid" (states a preference about people), "review" (depends on
  // context or local law), "ok" (HUD's 1995 guidance names it as fine).
  var RULES = [
    // Familial status
    { re: /\badults?[ -]only\b|\badult (?:community|building|living)\b|\b(?:adults?|couples?|singles?|retirees|seniors) (?:preferred|wanted|welcome)\b/gi, level: "avoid", cls: "Familial status", why: "States a preference against families with children. Only housing that qualifies as housing for older persons can say this.", fix: "Describe the property. If it legally qualifies as 55+ or 62+ housing, say \"55+ community\"." },
    { re: /\bno (?:kids|children|small children|babies|toddlers|teens)\b|\bnot suitable for (?:kids|children)\b|\bchild[- ]free\b/gi, level: "avoid", cls: "Familial status", why: "An explicit limitation on children.", fix: "Remove it. State facts instead, e.g. \"third-floor unit, no elevator\"." },
    { re: /\b(?:perfect|ideal|great|suited)\s+for\s+(?:a\s+|the\s+)?(?:young\s+|growing\s+|small\s+|large\s+)?(?:famil(?:y|ies)|couples?|newlyweds|singles?|empty[ -]nesters|retirees|seniors|students|professionals?|bachelors?|kids|children|one person|1-2 adults|two adults|2 adults)\b/gi, level: "avoid", cls: "Familial status", why: "Describes the buyer or tenant instead of the home. \"Perfect for 2 adults\" is a familial-status preference even when it's meant kindly.", fix: "Name the feature that made you think it: \"three bedrooms on one floor\", \"single-level living\", \"low-maintenance yard\"." },
    { re: /\bfamily[ -](?:neighbou?rhood|street|area|community|oriented)\b/gi, level: "avoid", cls: "Familial status", why: "Implies a preference for families, and so against people without children.", fix: "\"Cul-de-sac street\", \"two parks within a 10-minute walk\"." },
    { re: /\bempty[ -]nesters?\b/gi, level: "avoid", cls: "Familial status", why: "Describes a household type.", fix: "\"Single-level living\", \"low-maintenance garden\"." },
    { re: /\bmature (?:couple|person|persons|individual|adults?|residents?|tenants?|buyers?)\b|\bretired (?:couple|person)\b/gi, level: "avoid", cls: "Familial status", why: "A preference for adults or older people. Fair housing groups flag ads like \"looking for retired couple or older person\".", fix: "Describe the home. Use \"55+\" only for qualifying housing for older persons." },
    { re: /\bquiet (?:adults?|couples?|tenants?|persons?|individuals?|professionals?)\b/gi, level: "avoid", cls: "Familial status", why: "\"Quiet\" describing people (not the street) reads as \"no children\". \"Looking for 1-2 quiet adults\" is a real flagged ad.", fix: "\"Quiet street\" is fine. Drop the description of the occupants." },
    { re: /\b(?:max(?:imum)?\.? (?:of )?(?:\d|one|two|three) (?:people|persons|occupants|tenants|children)|(?:\d|one|two) (?:child|children|kids?) (?:max|maximum|only))\b/gi, level: "review", cls: "Familial status", why: "Occupancy limits must follow your local occupancy code. Limits aimed at children are a violation.", fix: "\"Occupancy per local code\", or the code's actual limit." },
    { re: /\b(?:students?|grad students|professionals?) only\b|\bno students\b|\bworking professionals?\b/gi, level: "review", cls: "Familial status / state law", why: "Not a protected class federally, but fair housing groups report readers take it as \"no families\". Some states and cities also protect students or occupation.", fix: "State the actual criteria you'll apply to every applicant, e.g. the income requirement." },
    { re: /\b(?:man cave|she shed)\b/gi, level: "review", cls: "Sex (style)", why: "HUD's guidance doesn't address these. It's a room use, not a buyer preference, but some brokerages prefer neutral words.", fix: "\"Den\", \"bonus room\", \"garden studio\"." },
    { re: /\bbachelor pad\b/gi, level: "review", cls: "Sex / familial status", why: "HUD calls \"bachelor apartment\" a physical description (a studio). \"Bachelor pad\" pitched at a buyer reads as a preference.", fix: "\"Studio\", \"one-bedroom\"." },
    // Sex
    { re: /\b(?:females?|women|ladies|males?|men|gentlemen) only\b|\bno (?:men|women|males|females)\b|\b(?:perfect|ideal) for (?:a )?(?:woman|man|lady|gentleman)\b/gi, level: "avoid", cls: "Sex", why: "An explicit sex preference. The only exception is a shared-living roommate ad, which isn't a listing.", fix: "Remove it." },
    // Race, color, national origin
    { re: /\b(?:white|black|asian|hispanic|latino|latina|african|mexican|chinese|indian|irish|italian|polish|korean|jewish|christian|muslim|catholic|hindu|ethnic)\s+(?:famil(?:y|ies)|neighbou?rhood|area|community|residents|neighbou?rs|home|household|buyers?|tenants?)\b/gi, level: "avoid", cls: "Race / national origin / religion", why: "Describes the home, residents or neighbors by race, ethnicity or religion. HUD's own examples: \"white family home\", \"Christian home\".", fix: "Remove it. Describe the property and checkable location facts." },
    { re: /\b(?:english[ -]speaking(?: only)?|must speak english|no immigrants|(?:us|u\.s\.|american) citizens? only)\b/gi, level: "avoid", cls: "National origin", why: "A limitation tied to national origin.", fix: "Remove it. Apply the same screening criteria to everyone." },
    { re: /\b(?:exclusive|restricted|integrated|traditional|private)\s+(?:neighbou?rhood|community|area|enclave|street|building)\b/gi, level: "review", cls: "Race / religion (catch words)", why: "HUD's 1989 advertising guidelines listed \"restricted\", \"exclusive\", \"private\", \"integrated\" and \"traditional\" as catch words to avoid when used in a discriminatory context. HUD says it still treats that guidance as current.", fix: "Say what you mean: \"gated\", \"private road\", \"12 homes on the street\"." },
    { re: /\b(?:safe|low[- ]crime|crime[- ]free|good|nice|desirable)\s+(?:neighbou?rhood|area|community)\b/gi, level: "review", cls: "Steering risk", why: "\"Desirable neighborhood\" is fine per HUD 1995. \"Safe\" and \"low-crime\" are subjective, often read as code, and can amount to steering. NAR's Code of Ethics bars agents from volunteering opinions on an area's racial, religious or ethnic makeup.", fix: "Use checkable facts (\"street lighting\", \"neighborhood watch\"), or point buyers to official crime data." },
    { re: /\b(?:best|top|great|good|excellent)[ -](?:rated )?schools?(?: district)?\b/gi, level: "review", cls: "Steering risk", why: "School quality claims are a common steering complaint and are often wrong. Catchment changes.", fix: "\"In the [name] school district (buyer to verify).\"" },
    // Religion
    { re: /\b(?:christian|catholic|jewish|muslim|hindu|church|religious)\s+(?:community|neighbou?rhood|area)\b/gi, level: "avoid", cls: "Religion", why: "States a religious preference about who lives there.", fix: "A landmark as a location is fine: \"two blocks from St Mark's Church\"." },
    // Disability
    { re: /\bno wheelchairs\b|\bable[- ]bodied\b|\bmust be able to (?:climb|walk|use) (?:the )?stairs\b|\bphysically fit\b|\bno (?:mental(?:ly)? ill(?:ness)?|disabled|handicapped)\b/gi, level: "avoid", cls: "Disability", why: "An exclusion based on disability. HUD's example: \"no wheelchairs\".", fix: "Describe the feature: \"fourth-floor walk-up, no elevator\"." },
    { re: /\bno (?:pets|animals|dogs)\b/gi, level: "review", cls: "Disability", why: "A no-pets rule is lawful, but assistance animals are a reasonable-accommodation matter under the Fair Housing Act, not pets.", fix: "\"No pets (assistance animals considered as required by law).\"" },
    { re: /\bno (?:section 8|vouchers?|housing vouchers?|hcv|assistance)\b|\bsection 8 not accepted\b/gi, level: "review", cls: "Source of income (state/local)", why: "Not federal, but many states and cities ban source-of-income discrimination. Where they do, this is a violation.", fix: "Remove it, and check your state and city law." },
    // Fine per HUD 1995
    { re: /\bmaster (?:bedroom|suite|bath(?:room)?)\b/gi, level: "ok", cls: "Fine per HUD", why: "HUD (1995): not a violation of the sex or race provisions. Many MLSs now prefer \"primary bedroom\" as a style choice.", fix: "Optional: \"primary bedroom\"." },
    { re: /\b(?:mother-)?in-law (?:suite|apartment|unit|flat)\b|\bbachelor apartment\b|\bfamily room\b|\bwalk-in closets?\b|\bgreat views?\b|\bwalk-up\b|\bwalk(?:ing)? (?:to|distance)\b|\bwheelchair ramp\b|\bnon-?smoking\b|\bquiet street\b|\bjogging trails?\b|\bdesirable neighbou?rhood\b|\brare find\b|\bcozy\b/gi, level: "ok", cls: "Fine per HUD", why: "HUD's 1995 guidance names these (or near-identical phrases) as describing the property, its facilities or the neighborhood, not people.", fix: "" }
  ];

  function check(text) {
    var hits = [];
    RULES.forEach(function (r, i) {
      r.re.lastIndex = 0;
      var m;
      while ((m = r.re.exec(text)) !== null) {
        hits.push({ start: m.index, end: m.index + m[0].length, match: m[0], rule: i, level: r.level, cls: r.cls, why: r.why, fix: r.fix });
      }
    });
    // Keep the most serious hit where matches overlap.
    var rank = { avoid: 0, review: 1, ok: 2 };
    hits.sort(function (a, b) { return a.start - b.start || rank[a.level] - rank[b.level] || b.end - a.end; });
    var out = [], lastEnd = -1;
    hits.forEach(function (h) {
      if (h.start >= lastEnd) { out.push(h); lastEnd = h.end; }
      else if (rank[h.level] < rank[out[out.length - 1].level]) { out[out.length - 1] = h; lastEnd = Math.max(lastEnd, h.end); }
    });
    return out;
  }

  if (typeof module !== "undefined") { module.exports = { check: check, RULES: RULES }; return; }

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  document.addEventListener("DOMContentLoaded", function () {
    var ta = document.getElementById("fh-input"), out = document.getElementById("fh-output"), btn = document.getElementById("fh-run");
    if (!ta) return;
    function run() {
      var text = ta.value, hits = check(text);
      if (!text.trim()) { out.innerHTML = "<p class=\"small\">Paste a listing above and press Check.</p>"; return; }
      var html = "", pos = 0;
      hits.forEach(function (h, n) {
        html += esc(text.slice(pos, h.start)) + "<mark class=\"fh-" + h.level + "\" title=\"" + esc(h.cls) + "\">" + esc(h.match) + "<sup>" + (n + 1) + "</sup></mark>";
        pos = h.end;
      });
      html += esc(text.slice(pos));
      var counts = { avoid: 0, review: 0, ok: 0 };
      hits.forEach(function (h) { counts[h.level]++; });
      var list = hits.map(function (h, n) {
        var label = { avoid: "Avoid", review: "Review", ok: "Fine" }[h.level];
        return "<li><span class=\"fh-tag fh-" + h.level + "\">" + label + "</span> <strong>" + (n + 1) + ". \"" + esc(h.match) + "\"</strong> (" + esc(h.cls) + "). " + esc(h.why) + (h.fix ? " <em>Try:</em> " + esc(h.fix) : "") + "</li>";
      }).join("");
      out.innerHTML = "<p><strong>" + counts.avoid + " to avoid, " + counts.review + " to review, " + counts.ok + " fine.</strong> " + (counts.avoid + counts.review === 0 ? "No flagged phrases found. A word list can't judge context, so still read it as a buyer would." : "") + "</p>" +
        "<div class=\"fh-text\">" + html.replace(/\n/g, "<br>") + "</div>" + (list ? "<ol class=\"fh-list\">" + list + "</ol>" : "");
    }
    btn.addEventListener("click", run);
    document.getElementById("fh-sample").addEventListener("click", function () {
      ta.value = "Charming 3-bed colonial in an exclusive neighborhood, perfect for a young family! Master bedroom with walk-in closet, family room with fireplace, quiet street, walking distance to the park and top-rated schools. Ideal for empty nesters too. No Section 8. Adults preferred, no pets.";
      run();
    });
  });
})();
