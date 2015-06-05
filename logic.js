var ingredients = ["mushroom","fern","toad","foot","flower","root","scorpion","feather"];
var elements = ["type1","type2","type3","type4","type5","type6","type7","type8"];
var colors = ["red","blue","green"];
var madeChanges = false;

$("#test_potion__submit").click(function(event){
  event.preventDefault();
  testPotion();
  checkAllBoxes();
});

$("#sell_potion__submit").click(function(event){
  event.preventDefault();
  sellPotion();
  checkAllBoxes();
});

$("#debunk_proof__submit").click(function(event){
  event.preventDefault();
  debunkProof();
  checkAllBoxes();
});

$("#log__edit").click(function(event){
  $('.delete').toggleClass('edit')
});

function removeLogItem(child){
  child.parent().remove();
  clearResults();
  rebuildFromLog();
};

function testPotion(){
  var ingredient1 = selectorValue($("#test_potion__ingredient1")[0]);
  var ingredient2 = selectorValue($("#test_potion__ingredient2")[0]);
  if (ingredient1 == ingredient2){ return };
  var result = selectorValue($("#test_potion__result")[0]);
  console.log(ingredient1,ingredient2,result);
  markResult(ingredient1,ingredient2,result);
  logResult(ingredient1, ingredient2, result);
};

function sellPotion(){
  var ingredient1 = selectorValue($("#sell_potion__ingredient1")[0]);
  var ingredient2 = selectorValue($("#sell_potion__ingredient2")[0]);
  if (ingredient1 == ingredient2){ return };
  var target = selectorValue($("#sell_potion__target")[0]);
  var pseudoResult = selectorValue($("#sell_potion__result")[0]);
  var resultMatrix = {
    "redplus":["redplus","greenblueplus","neutral","grayminus"],
    "redminus": ["redminus","greenblueminus","neutral","grayplus"],
    "greenplus": ["greenplus","blueredplus","neutral","grayminus"],
    "greenminus": ["greenminus","blueredminus","neutral","grayplus"],
    "blueplus": ["blueplus","redgreenplus","neutral","grayminus"],
    "blueminus": ["blueminus","redgreenminus","neutral","grayplus"]
  }
  var result = resultMatrix[target][pseudoResult]
  markResult(ingredient1,ingredient2,result);
  logResult(ingredient1, ingredient2, result);
};

function debunkProof(){
  ingredient1 = selectorValue($("#debunk_proof__ingredient1")[0]);
  result = selectorValue($("#debunk_proof__result")[0]);
  markResult(ingredient1,"unknown",result);
  logResult(ingredient1, "unknown", result);
};

function selectorValue(selectTag){
  var a = selectTag.options[selectTag.selectedIndex].value;
  if ((a == "Ingredient") || (a == "Result") || (a == "Target")){
    a = null
  };
  return a
};

function markResult(ingredient1,ingredient2,result){
  if (result == null){ return };
  var $targetBubble = $("." + ingredient1).filter("." + ingredient2);
  if(!(result.length > 10)&&!(result.slice(0,3) == "bla")){
    var definiteResults = [
      "redplus",
      "redminus",
      "greenplus",
      "greenminus",
      "blueplus",
      "blueminus",
      "neutral"
    ]
    for (i = 0; i < definiteResults.length; i++){
      var current = definiteResults[i]
      if ($targetBubble.hasClass("potion-" + current)){
        if (result != current){
          $targetBubble.addClass("ERROR");
        }
      };
    };

  };
  $targetBubble.addClass("potion-" + result);
  hasComponent(ingredient1,result);
  hasComponent(ingredient2,result);
};

function logResult(ingredient1, ingredient2, result){
  $('.delete').removeClass('edit')
  var attributes = "ing1='" + ingredient1 + "' ing2='" + ingredient2 + "' result='" + result + "'"
  var openTag = "<li class='" + ingredient1 + " " + ingredient2 + "'" + attributes + " >";
  var bubble1 = "<div class= 'bubble element " + ingredient1 + "'></div>"
  var bubble2 = "<div class= 'bubble element " + ingredient2 + "'></div>"
  var resultBubble = "<div class= 'bubble potion-" + result + "'></div>"
  var closeTag = "</li>"
  var deleteButton = "<div class='delete bubble'></div>"
  var elementString = openTag + bubble1 + "&nbsp;+&nbsp;" + bubble2 + "&nbsp;=&nbsp;" + resultBubble + deleteButton + closeTag;
  $(elementString).appendTo('#log__list');
  $(".delete").click(function(event){removeLogItem($(this))});
}

function hasComponent(ingredient,colorPolarity){
  var opposites = {
    "redplus":"redminus",
    "redminus":"redplus",
    "greenplus":"greenminus",
    "greenminus":"greenplus",
    "blueplus":"blueminus",
    "blueminus":"blueplus",
    "neutral":"neutral"
  };
  var polarOpposite = opposites[colorPolarity]
  var $boxes = $(".answer-grid__answer." + ingredient + "." + polarOpposite);
  $boxes.each(function(i){
    if (!($(this).hasClass("false"))) {
      madeChanges = true;
      $(this).addClass("false");
    }
  })
}

function checkColRow(selector){
  var $boxes = $(".answer-grid__answer." + selector);
  if ($boxes.filter(".true").length > 0) {
    var $falseBoxes = $boxes.not(".true");
    $falseBoxes.each(function(){
      if (!($(this).hasClass("false"))){
        $(this).addClass("false");
        madeChanges = true;
      };
    });
  }
  var $possibleBoxes = $boxes.not(".false");
  if (($possibleBoxes.length == 1) && !($possibleBoxes.first().hasClass("true"))){
    $possibleBoxes.first().addClass("true");
  };
  if ($possibleBoxes.length < 1){
    $(".results-tree ." + selector).addClass("ERROR");
  };
};

function checkForSolutions(selectorArray){
  for (i = 0; i < selectorArray.length; i++){
    checkColRow(selectorArray[i])
  };
}

function checkBig(){
  $.each(ingredients, function(i,ingredient){
    var $possibleBoxes = $(".answer-grid__answer." + ingredient).not(".false");
    var $elementLogEntries = $("#log__list li." + ingredient);
    $.each(colors, function(j,color){
      if ($possibleBoxes.filter("." + color + "big").length == 0){
        $elementLogEntries.each(function(k,entry){
          var entryColorLetter = $(entry).attr('result').slice(0,1);
          var otherIngredient = ""
          if ($(entry).attr('ing1') == ingredient){
            otherIngredient = $(entry).attr('ing2');
          } else {
            otherIngredient = $(entry).attr('ing1')
          }
          var thisColorLetter = color.slice(0,1);
          if (entryColorLetter == thisColorLetter){
            $(".answer-grid__answer." + otherIngredient).not("." + color + "big").addClass('false');
          }
        })
      }
    })
  })
}

function checkAllBoxes(){
  while (madeChanges == true){
    madeChanges = false;
    checkBig();
    checkForSolutions(ingredients);
    checkForSolutions(elements);
  };
}

function clearResults(){
  var allResults = "potion-redplus potion-redminus potion-greenplus potion-greenminus potion-blueplus potion-blueminus potion-redgreenplus potion-redgreenminus potion-greenblueplus potion-greenblueminus potion-blueredplus potion-blueredminus potion-grayplus potion-grayminus potion-neutral true false ERROR";
  $(".results-tree__row .bubble, .answer-grid__answer").removeClass(allResults);
}

function rebuildFromLog(){
  var $logEntries = $('#log__list li');
  $logEntries.each(function(i,entry){
    var ingredient1 = $(entry).attr('ing1');
    var ingredient2 = $(entry).attr('ing2');
    var result = $(entry).attr('result');
    markResult(ingredient1,ingredient2,result);
  })
}

function testBuilder(){
  markResult("mushroom","fern","redminus");
  logResult("mushroom","fern","redminus");
  markResult("mushroom", "toad", "blueplus");
  logResult("mushroom", "toad", "blueplus");
}