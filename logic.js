function testPotion(){
  ingredient1 = selectorValue($("#test_potion__ingredient1")[0]);
  ingredient2 = selectorValue($("#test_potion__ingredient2")[0]);
  result = selectorValue($("#test_potion__result")[0]);
  console.log(ingredient1,ingredient2,result);
  markResult(ingredient1,ingredient2,result);
};

function sellPotion(){
  
};

function debunkProof(){
  
};

function selectorValue(selectTag){
  var a = selectTag.options[selectTag.selectedIndex].value;
  if ((a == "Ingredient") || (a == "Result") || (a == "Target")){
    a = null
  };
  return a
};

function markResult(ingredient1,ingredient2,result){
  var targetBubble = $("." + ingredient1).filter("." + ingredient2);
  var potionColor = result.slice(0,-1)
  var polarity = result.slice(-1)
  if (polarity == "X") {
    polarity = "&#x20E0;"
  } else if (polarity == "-"){
    polarity = "&#8211";
  };
  targetBubble.addClass("potion-" + potionColor);
  targetBubble[0].innerHTML = polarity;
};