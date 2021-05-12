// Calculator logic
// Expressions are parsed to correctly evaluate results

// Show intermediate input on calculator display (individual numbers)
function display_show(x){
  if(document.querySelector("#rad_on").innerHTML == "1"){
    // alert("rad help is on");
  }
  else{
    var disp = document.querySelector("#row1");
    var ans = document.querySelector("#ans").innerHTML;
    if(disp.innerHTML == "0"){
      disp.innerHTML = "";
    }
    if(ans == "1"){
      disp.innerHTML = "";
      document.querySelector("#ans").innerHTML = "0";
    }
    var digit = x;
    var d;
    if(x == -1){
      d = ".";
    }
    else{
      d = digit.toString();
    }
    var str = disp.innerHTML + d;
    disp.innerHTML = str;
  }
}

// Add operator symbols to calculator display + handle radicals / unary negation
function operator(x){
  // If radical is selected
  if(document.querySelector("#rad_on").innerHTML == "1"){
    // alert("rad helper is on!");
    var rad = document.querySelector("#rad_help");
    rad.style.visibility = "hidden";
    document.querySelector("#base").style.color = "inherit";
    document.querySelector("#rad_on").innerHTML = "0";
  }
  else{
    document.querySelector("#ans").innerHTML = "0";
    var disp = document.querySelector("#row1");
    if(x == 's'){ // radical
      var rad = document.querySelector("#rad_help");
      if(document.querySelector("#rad_on").innerHTML == "1"){
        rad.style.visibility = "hidden";
        document.querySelector("#base").style.color = "inherit";
        document.querySelector("#rad_on").innerHTML = "0";
      }
      else{
        // activate radical helper
        rad.style.visibility = "visible";
        document.querySelector("#base").style.color = "#202020";
        document.querySelector("#rad_on").innerHTML = "1";
      }
    }
    else if(x == '?'){ // neg unary
      if(disp.innerHTML == "0" || disp.innerHTML == "Error"){
        disp.innerHTML = "";
        disp.innerHTML = disp.innerHTML + "-";
      }
      else if(disp.innerHTML.charAt(disp.innerHTML.length - 1) == ' '){
        disp.innerHTML = disp.innerHTML + "-";
      }
    }
    else if(x == '(' || x == ')'){
      if(disp.innerHTML == "0" || disp.innerHTML == "Error"){
        disp.innerHTML = "";
      }
      disp.innerHTML = disp.innerHTML + x;
    }
    else{
      if(disp.innerHTML == "Error"){
        disp.innerHTML = "0";
      }
      // Show the operator on the screen
      disp.innerHTML = disp.innerHTML + " " + x + " ";
    }
  }
}

// When C button is clicked, reset the calculator screen + reset intermediate cells
function reset_disp(){
  if(document.querySelector("#rad_on").innerHTML == "1"){
    // alert("rad helper is on!");
  }
  else{
    var disp1 = document.querySelector("#row1");
    var disp2 = document.querySelector("#row2");
    var disp3 = document.querySelector("#row3");
    disp1.innerHTML = "0";
    disp2.innerHTML = "";
    disp3.innerHTML = "";
  }
}

// Parse expressions into their correct evaluation
function exp_parser(){
  // Set required decimal places
  var decimal_places = 4;
  // Fetch the expression
  var expression = document.querySelector("#row1").innerHTML;
  // Check for balanced parentheses
  if(bracketCoherence(expression)){
    // Check if expression is missing operand
    expression = strayOperator(expression);
    // Re-arrange three display slots
    document.querySelector("#row1").innerHTML = expression;
    document.querySelector("#row3").innerHTML = document.querySelector("#row2").innerHTML;
    document.querySelector("#row2").innerHTML = expression;
    var loop = true;
    while(loop){
      loop = parse_bit("no_br");
    }
    if(document.querySelector("#row1").innerHTML == ""){
      document.querySelector("#row1").innerHTML = "0";
    }
    document.querySelector("#ans").innerHTML = "1";
    // TEMPORARY decimal places
    var tmp_str = document.querySelector("#row1").innerHTML;
    if(tmp_str.length > 1){
      // identify floating points
      if(is_float(tmp_str)){
        var dot_index = -1;
        // identify dot
        for(var i = 0; i < tmp_str.length; i++){
          if(tmp_str.charAt(i) == '.'){
            dot_index = i;
            break;
          }
        }
        if(tmp_str.length > (i + decimal_places)){
          tmp_str = tmp_str.substr(0, (dot_index + (decimal_places + 1)));
          document.querySelector("#row1").innerHTML = tmp_str;
        }
      }
    }
  }
  else{
    document.querySelector("#row3").innerHTML = document.querySelector("#row2").innerHTML;
    document.querySelector("#row2").innerHTML = expression;
    expression = "Error";
    document.querySelector("#row1").innerHTML = expression;
    document.querySelector("#ans").innerHTML = "1";
  }
}

// Parse through whole string, evaluating brackets first, then operators by importance
function parse_bit(str){
  var expression;
  if(str == "no_br"){
    expression = document.querySelector("#row1").innerHTML;
  }
  if(str == "br"){
    // Save expression with brackets to an intermediate register (for display purposes)
    expression = document.querySelector("#bracket_register").innerHTML;
  }
  var type = ".";
  var importance = -1;
  for(var i = 0; i < expression.length; i++){
    if(expression.charAt(i) == '('){
      type = "(";
      importance = 3;
      break;
    }
    if(expression.charAt(i) == '＾'){
      type = "＾";
      importance = 2;
    }
    if(expression.charAt(i) == '√'){
      type = "√";
      importance = 2;
    }
    if(expression.charAt(i) == '×'){
      if(importance <= 1){
        importance = 1;
        type = "×";
      }
    }
    if(expression.charAt(i) == '÷'){
      if(importance <= 1){
        importance = 1;
        type = "÷";
      }
    }
    if(expression.charAt(i) == '+'){
      if(importance <= 0){
        type = "+";
        importance = 0;
      }
    }
    if(expression.charAt(i) == '-'){
      if(expression.charAt(i + 1) == ' '){ // ignore unary -
        if(importance <= 0){
          type = "-";
          importance = 0;
        }
      }
    }
  }
  // alert("Importance is: " + importance);
  // importance determined
  if(importance == -1){ // no operators found
      // return same num
      // alert("no operator.");
      return false;
  }
  if(importance == 0){ // add & subs
    // sum or subs only remain (l to r)
    // find first term
    var op = "none";
    var first_index = 0;
    for(var i = 0; i < expression.length; i++){
      if(expression.charAt(i) == ' '){
        first_index = i;
        break;
      }
    }
    var term_1 = expression.substring(0, first_index);
    // determine operator
    var second_index = 0;
    for(var i = first_index; i < expression.length; i++){
      if(expression.charAt(i) == '+'){
        op = "plus";
        second_index = i + 2;
        break;
      }
      if(expression.charAt(i) == '-'){
        op = "minus";
        second_index = i + 2;
        break;
      }
    }
    if(op == "none"){
      alert("parse_bit() : No operator detected.");
      return false;
    }
    // store second term
    var end = true;
    var term_2 = 0;
    var extract;
    for(var i = second_index; i < expression.length; i++){
      if(expression.charAt(i) == ' '){
        term_2 = expression.substring(second_index, i);
        extract = i;
        end = false;
        break;
      }
    }
    if(end){
      term_2 = expression.substring(second_index);
    }
    // perform arithmetic
    var t1 = parseFloat(term_1);
    var t2 = parseFloat(term_2);
    var t3 = 0;
    if(op == "plus"){
      t3 = t1 + t2;
      // alert(t3);
    }
    else{
      t3 = t1 - t2;
      // alert(t3);
    }
    var str_ans = t3.toString();
    if(end){
      expression = str_ans;
      if(str == "no_br"){
        document.querySelector("#row1").innerHTML = expression;
        return false;
      }
      else if(str == "br"){
        document.querySelector("#bracket_register").innerHTML = expression;
        return false;
      }
    }
    else{
      expression = str_ans + expression.substring(extract);
      if(str == "no_br"){
        document.querySelector("#row1").innerHTML = expression;
        return true;
      }
      else if(str == "br"){
        document.querySelector("#bracket_register").innerHTML = expression;
        return true;
      }
    }
  }
  if(importance == 1){ // mult/div
    // alert("div/mult");
    // extract operands
    var left_side = -1;
    var right_side = -1;
    var type = "none";
    var op_index = -1;
    var start = 0;
    var end = 0;
    // find our operator
    for(var i = 0; i < expression.length; i++){
      if(expression.charAt(i) == '×'){
        type = "mult";
        // alert("M");
        op_index = i;
        break;
      }
      else if(expression.charAt(i) == '÷'){
        type = "div";
        // alert("D");
        op_index = i;
        break;
      }
    }
    if(type == "none"){
      alert("Type not detected (mult/div)!");
      return false;
    }
    // find left side operand
    for(var i = (op_index - 2); i >= 0; i--){
      if(i == 0){
        // left is 0 to (op_index - 2)
        left_side = parseFloat(expression.substring(0, (op_index - 1)));
        start = 0;
        break;
      }
      else if(expression.charAt(i) == ' '){
        // left is (i + 1) to (op_index - 2)
        left_side = parseFloat(expression.substring((i + 1), (op_index - 1)));
        start = (i + 1);
        break;
      }
    }
    // find right side operand
    for(var i = (op_index + 2); i < expression.length; i++){
      if(i == (expression.length - 1)){
        // right is (op_index + 2) to end
        right_side = parseFloat(expression.substring(op_index + 2));
        end = -1;
        // alert("end -1");
        break;
      }
      else if(expression.charAt(i) == ' '){
        // right is (op_index + 2) to (i - 1)
        right_side = parseFloat(expression.substring((op_index + 2), (i)));
        end = i;
        // alert("end " + end);
        break;
      }
    }
    // do operation
    var result;
    var str_ans;
    if(type == "mult"){
      result = left_side * right_side;
      str_ans = result.toString();
    }
    else if(type == "div"){
      result = left_side / right_side;
      str_ans = result.toString();
    }
    // update new expression
    if(end == -1){
      expression = expression.substring(0, start);
      // alert("|" + expression + "|");
      expression = expression + str_ans;
    }
    else{
      if(start == 0){
        // alert("starty");
        expression = expression.substring(end);
        // alert("|" + expression + "|");
        expression = str_ans + expression;
      }
      else{
        // its a sandwich
        var exp_left = expression.substring(0, start);
        var exp_right = expression.substring(end);
        // alert("Sandwich");
        expression = exp_left + str_ans + exp_right;
      }
    }
    // return result
    if(expression == str_ans){
      if(str == "no_br"){
        document.querySelector("#row1").innerHTML = expression;
        return false;
      }
      else if(str == "br"){
        document.querySelector("#bracket_register").innerHTML = expression;
        return false;
      }
    }
    else{
      if(str == "no_br"){
        document.querySelector("#row1").innerHTML = expression;
        return true;
      }
      else if(str == "br"){
        document.querySelector("#bracket_register").innerHTML = expression;
        return true;
      }
    }
  }
  if(importance == 2){ // exponents
    // alert("exp");
    // extract operands
    var left_side = -1;
    var right_side = -1;
    var op_index = -1;
    var start = 0;
    var end = 0;
    var type = "none";
    // find our operator
    for(var i = 0; i < expression.length; i++){
      if(expression.charAt(i) == '＾'){
        // alert("exp");
        op_index = i;
        type = "exp";
        break;
      }
      if(expression.charAt(i) == '√'){
        // alert("exp");
        op_index = i;
        type = "rad";
        break;
      }
    }
    // find left side operand
    for(var i = (op_index - 2); i >= 0; i--){
      if(i == 0){
        // left is 0 to (op_index - 2)
        left_side = parseFloat(expression.substring(0, (op_index - 1)));
        start = 0;
        break;
      }
      else if(expression.charAt(i) == ' '){
        // left is (i + 1) to (op_index - 2)
        left_side = parseFloat(expression.substring((i + 1), (op_index - 1)));
        start = (i + 1);
        break;
      }
    }
    // find right side operand
    for(var i = (op_index + 2); i < expression.length; i++){
      if(i == (expression.length - 1)){
        // right is (op_index + 2) to end
        right_side = parseFloat(expression.substring(op_index + 2));
        end = -1;
        // alert("end -1");
        break;
      }
      else if(expression.charAt(i) == ' '){
        // right is (op_index + 2) to (i - 1)
        right_side = parseFloat(expression.substring((op_index + 2), (i)));
        end = i;
        // alert("end " + end);
        break;
      }
    }
    // do operation
    var result;
    var str_ans;
    if(type == "rad"){
      result = Math.pow(right_side, (1 / left_side));
      str_ans = result.toString();
    }
    else if(type == "exp"){
      result = Math.pow(left_side, right_side);
      str_ans = result.toString();
    }
    // update new expression
    if(end == -1){
      expression = expression.substring(0, start);
      // alert("|" + expression + "|");
      expression = expression + str_ans;
    }
    else{
      if(start == 0){
        // alert("starty");
        expression = expression.substring(end);
        // alert("|" + expression + "|");
        expression = str_ans + expression;
      }
      else{
        // its a sandwich
        var exp_left = expression.substring(0, start);
        var exp_right = expression.substring(end);
        // alert("Sandwich");
        expression = exp_left + str_ans + exp_right;
      }
    }
    // return result
    if(expression == str_ans){
      if(str == "no_br"){
        document.querySelector("#row1").innerHTML = expression;
        return false;
      }
      else if(str == "br"){
        document.querySelector("#bracket_register").innerHTML = expression;
        return false;
      }
    }
    else{
      if(str == "no_br"){
        document.querySelector("#row1").innerHTML = expression;
        return true;
      }
      else if(str == "br"){
        document.querySelector("#bracket_register").innerHTML = expression;
        return true;
      }
    }
  }
  if(importance == 3){ // brackets
    // find and extract bracket section
    var l_index = -1;
    var r_index = -1;
    for(var i = 0; i < expression.length; i++){
      if(expression.charAt(i) == '('){
        l_index = i;
      }
      if(expression.charAt(i) == ')'){
        r_index = i;
        // alert("index ) : " + r_index);
        break;
      }
    }
    // pass the bracket section to brackProc()
    var proc_result;
    var str_ans;
    if(l_index == (r_index - 1)){ // if empty bracket
      str_ans = "";
    }
    else if(l_index == (r_index - 2)){
      // alert("here!");
      // alert(expression.charAt(l_index + 1));
      str_ans = expression.charAt(l_index + 1);
    }
    else{
      // alert("sending indeces (" + (l_index + 1) + "," + (r_index - 2) + ")");
      // alert("sending str: " + (expression.substr((l_index + 1), (r_index - 2))));
      proc_result = brackProc(expression.substr((l_index + 1), ((r_index - 1) - l_index)));
      str_ans = proc_result.toString();
    }
    // check if multiplier in left side
    if((l_index != 0) && is_num(expression.charAt(l_index - 1))){
      var multiplier = 0;
      for(var i = (l_index - 1); i >= 0; i--){
        if(expression.charAt(i) == '(' || expression.charAt(i) == ' '){
          multiplier = parseFloat(expression.substr((i + 1), (r_index - (i + 1))));
          l_index = (i + 1);
          break;
        }
        if(i == 0){
          multiplier = parseFloat(expression.substr(0, l_index));
          l_index = 0;
          break;
        }
      }
      var tmp_ans = parseFloat(str_ans);
      // alert("Multiplier: " + multiplier);
      tmp_ans = tmp_ans * multiplier;
      // alert("tmp_ans: " + tmp_ans);
      str_ans = tmp_ans.toString();
    }
    // readjust expression with new result
    var expr_prev = expression.substr(0, l_index);
    // alert("E_Bfore" + expr_prev);
    var expr_aftr = expression.substr(r_index + 1);
    // alert("E_After" + expr_aftr);
    expression = expr_prev + str_ans + expr_aftr;
    // return result
    if(expression == str_ans){
      document.querySelector("#row1").innerHTML = expression;
      return false;
    }
    else{
      document.querySelector("#row1").innerHTML = expression;
      return true;
    }
  }
}

function brackProc(str){
  document.querySelector("#bracket_register").innerHTML = str;
  var loop = true;
  while(loop){
    loop = parse_bit("br");
  }
  // alert("brackProc() returning: " + document.querySelector("#bracket_register").innerHTML);
  return document.querySelector("#bracket_register").innerHTML;
}

// If expression is missing right-hand operand, remove last operator
function strayOperator(str){
  var result = str;
  if(result.charAt(result.length - 1) == ' '){
    result = result.substring(0, (result.length - 3));
  }
  return result;
}

// Checks if expression has balanced parentheses
function bracketCoherence(str){
  let balance = 0
  // Iterate over string to identify parentheses
  for(let i = 0; i < str.length; i++){
    if(str[i] == '('){
      // If opening, add to balance
      balance++
    }
    else if(str[i] == ')'){
      // If closing AND balance is positive (AND non-zero)
      if(balance > 0){
        balance--
      }
      else{
        // Balance is already broken
        balance = -1
        break
      }
    }
  }
  // If balance is exactly zero, then expression was balanced
  if(balance == 0){
    return true
  }
  else{
    alert("Parentheses are not balanced!")
    return false
  }
}

function is_float(str){
  var float = false;
  for(var i = 0; i < str.length; i++){
    if(str.charAt(i) == '.'){
      float = true;
      break;
    }
  }
  return float;
}

function is_num(str){
  var tmp_num = parseFloat(str);
  if(tmp_num >= 0 && tmp_num <= 9){
    // alert("isNUM!");
    return true;
  }
  else{
    // alert("noNUM.");
    return false;
  }
}

// IMPLEMENT sub_rad!!!
function sub_rad(){
  var l_box = document.querySelector("#left_rad");
  var r_box = document.querySelector("#right_rad");
  if(l_box.value == "" || r_box.value == ""){
    alert("Expecting non-zero value in root expression!");
    return false;
  }
  var root = l_box.value;
  // alert("l_Box: " + root);
  var num_r = r_box.value;
  // alert("r_Box: " + num_r);
  var disp = document.querySelector("#row1");
  if(disp.innerHTML == "0"){
    disp.innerHTML = "";
  }
  // place formulated expression in display
  disp.innerHTML = disp.innerHTML + "(" + root + " √ " + num_r + ")";
  // deactivate rad helper
  l_box.value = "";
  r_box.value = "";
  var rad = document.querySelector("#rad_help");
  rad.style.visibility = "hidden";
  document.querySelector("#base").style.color = "inherit";
  document.querySelector("#rad_on").innerHTML = "0";
}
