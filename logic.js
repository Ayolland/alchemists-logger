var ingredients = ["mushroom","fern","toad","foot","flower","root","scorpion","feather"];
var elements = ["type1","type2","type3","type4","type5","type6","type7","type8"];
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

function testPotion(){
  var ingredient1 = selectorValue($("#test_potion__ingredient1")[0]);
  var ingredient2 = selectorValue($("#test_potion__ingredient2")[0]);
  if (ingredient1 == ingredient2){ return };
  var result = selectorValue($("#test_potion__result")[0]);
  console.log(ingredient1,ingredient2,result);
  markResult(ingredient1,ingredient2,result);
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
};

function debunkProof(){
  ingredient1 = selectorValue($("#debunk_proof__ingredient1")[0]);
  result = selectorValue($("#debunk_proof__result")[0]);
  markResult(ingredient1,"unknown",result);
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
  logResult(ingredient1, ingredient2, result);
};

function logResult(ingredient1, ingredient2, result){
  var openTag = "<li ing1=" + ingredient1 + " ing2=" + ingredient2 + " result=" + result + ">";
  var bubble1 = "<div class= 'bubble element " + ingredient1 + "'></div>"
  var bubble2 = "<div class= 'bubble element " + ingredient2 + "'></div>"
  var resultBubble = "<div class= 'bubble potion-" + result + "'></div>"
  var closeTag = "</li>"
  var elementString = openTag + bubble1 + "&nbsp;+&nbsp;" + bubble2 + "&nbsp;=&nbsp;" + resultBubble + closeTag;
  $(elementString).appendTo('#log__list');
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
};

function checkForSolutions(selectorArray){
  for (i = 0; i < selectorArray.length; i++){
    checkColRow(selectorArray[i])
  };
}

function checkAllBoxes(){
  while (madeChanges == true){
    madeChanges = false;
    checkForSolutions(ingredients);
    checkForSolutions(elements);
  };
}