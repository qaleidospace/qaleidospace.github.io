function searchTags(searchable, tags) {
  $(".ranking>.item", searchable).each(function(index, item) {
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

function addTag(searchable, tag) {
  if (/\s/.test(tag)) {
    tag = "\"" + tag + "\"";
  }

  var input = $(".search input", searchable);
  var inputValue = input.val();
  input.val(inputValue == "" ? tag : inputValue + " " + tag);
}

function complementNull(value, alternative) {
  return value != null ? value : alternative;
}

function getTags(searchable) {
  var tagsString = $(".search input", searchable).val();
  var multiTagExp = /"[^"]+"/g;
  var tagExp = /\S+/g;
  var tags = complementNull(tagsString.match(multiTagExp), []).map(function(tag) { return tag.substr(1, tag.length - 2); });
  tagsString = tagsString.replace(multiTagExp, " ");
  complementNull(tagsString.match(tagExp), []).forEach(function (tag) {
    tags.push(tag);
  });

  return tags.map(function(tag) { return tag.toLowerCase(); });
}

$(".searchable").each(function(index, searchable) {
  $(".search button", searchable).click(function() {
    searchTags(searchable, getTags(searchable));
  });

  $(".ranking>.item>.main>.tags>.tag", searchable).click(function() {
    addTag(searchable, $(this).val());
    searchTags(searchable, getTags(searchable));
  });
});

