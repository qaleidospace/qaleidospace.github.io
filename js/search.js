$(".ranking>.item>.main>.tags>.tag").click(function() {
  var value = $(this).val()
  // alert($(this).val());

  var items = $(".ranking>.item>.main>.tags>.tag").filter(function(index) {
    return $(this).val() == value;
  });

  $(".ranking>.item").filter(function(index) {
    var thisItem = $(this);

    var result = false;
    items.each(function(item) {
      result &= $.contains(thisItem, items);
    });

    return result;
  }).hide();
});