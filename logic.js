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
  var result = selectorValue($("#test_potion__result")[0]);
  console.log(ingredient1,ingredient2,result);
  markResult(ingredient1,ingredient2,result);
};

function sellPotion(){
  var ingredient1 = selectorValue($("#sell_potion__ingredient1")[0]);
  var ingredient2 = selectorValue($("#sell_potion__ingredient2")[0]);
  var target = selectorValue($("#sell_potion__target")[0]);
  var pseudoResult = selectorValue($("#sell_potion__result")[0]);
  var resultMatrix = {
    "redplus":["redplus","greenblueplus","neutral","blankminus"],
    "redminus": ["redminus","greenblueminus","neutral","blankplus"],
    "greeenplus": ["greenplus","blueredplus","neutral","blankminus"],
    "greenminus": ["greenminus","blueredminus","neutral","blankplus"],
    "blueplus": ["blueplus","redgreenplus","neutral","blankminus"],
    "blueminus": ["blueminus","redgreenminus","neutral","blankplus"]
  }
  var result = resultMatrix[target][pseudoResult]
  markResult(ingredient1,ingredient2,result);
};

function debunkProof(){
  ingredient1 = selectorValue($("#debunk_proof__ingredient1")[0]);
  result = selectorValue($("#debunk_proof__result")[0]);
  console.log(ingredient1,result);
  hasComponent(ingredient1,result);
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
  var targetBubble = $("." + ingredient1).filter("." + ingredient2);
  var polarity = result.slice(-4)
  if (polarity == "tral") {
    polarity = "&#x20E0;"
  } else if (polarity == "inus"){
    polarity = "&#8211";
  } else if (polarity == "plus"){
    polarity = "+";
  };
  targetBubble.addClass("potion-" + result);
  targetBubble[0].innerHTML = polarity;
  hasComponent(ingredient1,result);
  hasComponent(ingredient2,result);
};

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