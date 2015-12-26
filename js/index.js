function complementNull(value, alternative) {
  return value != null ? value : alternative;
}

function getUrlParameters() {
    return location.search.substr(1).split("&").reduce(function(result, nameAndValueString) {
      var nameAndValue = nameAndValueString.split("=");
      if (nameAndValue.length == 2) {
        result[nameAndValue[0]] = decodeURIComponent(nameAndValue[1]);
      }
      return result;
    }, {});
}

function urlParametersToString(urlParameters) {
  var string = ""
  if ("type" in urlParameters) {
    string += "?type=" + encodeURIComponent(urlParameters.type);
  }
  if ("q" in urlParameters) {
    if (string.length == 0) {
      string += "?";
    } else {
      string += "&";
    }

    string += "q=" + encodeURIComponent(urlParameters.q);
  }

  return string;
}

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

  var urlParameters = getUrlParameters();
  urlParameters.q = encodeURIComponent(getSearchQuery());
  window.history.pushState(null, "", [location.protocol, '//', location.host, location.pathname].join('') + urlParametersToString(urlParameters));
}

function addTag(tag) {
  if (getTags().map(function(tag) { return tag.toLowerCase(); }).indexOf(tag.toLowerCase()) >= 0) {
    return;
  }

  if (/\s/.test(tag)) {
    tag = "\"" + tag + "\"";
  }

  var input = $(".search input");
  var inputValue = input.val();
  input.val(inputValue == "" ? tag : inputValue + " " + tag);
}

function getSearchQueryInput() {
  return $(".search input");
}

function getSearchQuery() {
  return getSearchQueryInput().val();
}

function setSearchQuery(query) {
  getSearchQueryInput().val(query);
}

function getTags() {
  var tagsString = getSearchQuery();
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

$(".search input").keypress(function(event) {
  if (event.which == 13) {
    $(".search button").click();
  }
});

$(".ranking-table>.item>.main>.tags>.tag").click(function() {
  addTag($(this).val());
  searchTags(getTags());
});

$("#ranking-tabs li").each(function(index, list) {
  var type = $(this).attr("data-type");

  $("a", this).click(function(event) {
    event.preventDefault();
    $("#ranking-tabs li").removeClass("active");
    $('#ranking-tabs li[data-type="' + type + '"]').addClass("active");
    $('.rankings[data-type="' + type + '"]').show();
    $('.rankings[data-type!="' + type + '"]').hide();

    var urlParameters = getUrlParameters();
    urlParameters.type = type;
    window.history.pushState(null, "", [location.protocol, '//', location.host, location.pathname].join('') + urlParametersToString(urlParameters));
  });
});

$(function() {
  var urlParameters = getUrlParameters();

  var type = urlParameters.type;
  if (type != "72hours" && type != "daily" && type != "weekly" && type != "monthly" && type != "yearly") {
    type = "72hours";
  }
  $("#ranking-tabs li").removeClass("active");
  $('#ranking-tabs li[data-type="' + type + '"]').addClass("active");
  $('.rankings[data-type="' + type + '"]').show();
  $('.rankings[data-type!="' + type + '"]').hide();

  var query = urlParameters.q;
  if (query != null) {
    setSearchQuery(query);
    searchTags(getTags());
  }
});