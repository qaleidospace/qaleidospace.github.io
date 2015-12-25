function searchTags(tags) {
  $(".ranking-table>.item").each(function(index, item) {
    var matched = tags.reduce(function(acc, tag) {
      var contains = false;
      $(".main>.tags>.tag", item).each(function(index, tagElement) {
        contains |= tag == $(tagElement).val().toLowerCase();
      });
      return acc && contains;
    }, true);
    if (matched) {
      $(item).show();
    } else {
      $(item).hide();
    }
  });
}

function addTag(tag) {
  if (/\s/.test(tag)) {
    tag = "\"" + tag + "\"";
  }

  var input = $(".search input");
  var inputValue = input.val();
  input.val(inputValue == "" ? tag : inputValue + " " + tag);
}

function complementNull(value, alternative) {
  return value != null ? value : alternative;
}

function getTags() {
  var tagsString = $(".search input").val();
  var multiTagExp = /"[^"]+"/g;
  var tagExp = /\S+/g;
  var tags = complementNull(tagsString.match(multiTagExp), []).map(function(tag) { return tag.substr(1, tag.length - 2); });
  tagsString = tagsString.replace(multiTagExp, " ");
  complementNull(tagsString.match(tagExp), []).forEach(function (tag) {
    tags.push(tag);
  });

  return tags.map(function(tag) { return tag.toLowerCase(); });
}

$(".search button").click(function() {
  searchTags(getTags());
});

$(".ranking-table>.item>.main>.tags>.tag").click(function() {
  addTag($(this).val());
  searchTags(getTags());
});

$('.rankings[data-type!="72hours"]').hide();

$("#ranking-tabs li").each(function(index, list) {
  var type = $(this).attr("data-type");

  $("a", this).click(function(event) {
    event.preventDefault();
    $("#ranking-tabs li").removeClass("active");
    $('#ranking-tabs li[data-type="' + type + '"]').addClass("active");
    $('.rankings[data-type="' + type + '"]').show();
    $('.rankings[data-type!="' + type + '"]').hide();
  });
});