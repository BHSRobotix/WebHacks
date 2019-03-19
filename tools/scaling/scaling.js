
  const sel = {
    range1: {min: "#minRange1", max: "#maxRange1", val: "#valRange1", valDisplay: "#valRange1Display"},
    range2: {min: "#minRange2", max: "#maxRange2", valDisplay: "#valRange2Display"},
    options: {trigger: "#optionsTrigger", menu: "#optionsMenu"}
  };
  const defaults = {
    range1: {min: -1, max: 1},
    range2: {min: 0, max: 1000},
    sigDig: 3,
    step: 0.1
  };

  // https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
  //
  //          (b-a)(x - min)
  //  f(x) = ----------------  + a
  //             max - min

  function calculate() {
    const a = parseFloat($(sel.range2.min).val());
    const b = parseFloat($(sel.range2.max).val());
    const min = parseFloat($(sel.range1.min).val());
    const max = parseFloat($(sel.range1.max).val());
    const x = parseFloat($(sel.range1.val).val());
    return (((b - a) * (x - min)) / (max - min)) + a;
  }

  function initForm() {
    $(sel.range1.min).val(defaults.range1.min);
    $(sel.range1.max).val(defaults.range1.max);
    $(sel.range2.min).val(defaults.range2.min);
    $(sel.range2.max).val(defaults.range2.max);

    $(sel.options.trigger).on("click", function() {
      $(sel.options.menu).toggleClass("d-none");
    });
    $("#sigDigits").val(defaults.sigDig);
    $("#stepVal").val(defaults.step).on("change", function() {
      const step = $(this).val();
      $(sel.range1.val).attr("step", step);
      $("#valRange1Text").attr("step", step);
    });
  }

  function syncRangeValueInput(resetToMiddle) {
    const min = parseFloat($(sel.range1.min).val());
    const max = parseFloat($(sel.range1.max).val());
    $(sel.range1.val).attr("min", min);
    $(sel.range1.val).attr("max", max);
    if (resetToMiddle) {
      $(sel.range1.val).val((max + min) / 2)
    }
    $("#valRange1Text").attr("min", min);
    $("#valRange1Text").attr("max", max);
    onRangeChange();
  }

  function toggleInputMethod() {
    $("#inputMethodSlider").toggle();
    $("#inputMethodText").toggle();
  }

  function onRangeEndChange() {
    syncRangeValueInput();
    $(sel.range2.valDisplay).text(calculate());
  }

  function onRangeChange() {
    const sigDig = $("#sigDigits").val();
    const rangeVal = $("#inputMethod").val() === "slider" ?
      parseFloat($(sel.range1.val).val()).toFixed(sigDig) :
      parseFloat($("#valRange1Text").val());
    console.log("onRangeChange", $("#inputMethod").val(), rangeVal);
    $(sel.range1.val).val(rangeVal);
    $("#inputMethodText").val(rangeVal);
    $(sel.range1.valDisplay).text(rangeVal);
    $(sel.range2.valDisplay).text(calculate().toFixed(sigDig));
  }
