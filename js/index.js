simons_game = function () {
  var strict = false,
      game_is_on = false,
      comp_turn = true,
      random_array = void 0,
      turn = 0,
      show_count = document.getElementById("show_count_number"),
      snippet = [],
      snippet_copy = [],
      sequence_to_copy = [],
      next = void 0,
      go = void 0,
      timer = void 0,
      colors = ['g', 'r', 'b', 'y'],
      light_colors = {
    "g": "lightgreen",
    "r": "#ff0000",
    "y": "#FFFF00",
    "b": "#00fff3"
  },
      dark_colors = {
    "g": "#008000",
    "r": "#bf0000",
    "y": "#cccc00",
    "b": "#1000ff"
  };
  var play_g = document.getElementById("g_tone"),
      play_r = document.getElementById("r_tone"),
      play_b = document.getElementById("b_tone"),
      play_y = document.getElementById("y_tone");
  var tones = {
    "g": play_g,
    "r": play_r,
    "y": play_y,
    "b": play_b
  };

  function give_player_two_secs_to_answer() {
    timer = setTimeout(check_if_player_has_answered, 2000);
  }
  function check_if_player_has_answered() {
    if (snippet_copy.length > snippet.length) {
      snippet_copy = snippet;
      return;
    } else {
      wrong_button_clicked();
    }
  }
  // click on any of the 4 buttons to display a light color (i.e. flash quickly)
  function click_color(light, color, div_id) {
    if (comp_turn === true || game_is_on === false) {
      return;
    }
    clearTimeout(timer);
    clearInterval(go);
    var color_id = document.getElementById(div_id);
    color_id.style.backgroundColor = light;
    setTimeout(function () {
      color_id.style.backgroundColor = color;
    }, 200);
    play_tone(div_id);
    if (div_id !== snippet[0]) {
      comp_turn = true;
      wrong_button_clicked();
    }
    var a = snippet.shift();
    if (snippet.length > 0 && div_id === a) {
      setTimeout(display_count, 1000);
      snippet_copy = snippet;
      give_player_two_secs_to_answer();
    }
    if (snippet.length === 0 && div_id === a) {
      turn++;
      setTimeout(display_count, 1000);
      display_sequence_to_mem();
    }
  }
  function wrong_button_clicked() {
    clearInterval(go);
    clearTimeout(timer);
    comp_turn = true;
    //make buzzer sound!!!!!!

    if (strict) {
      turn = 1;
      flash_count_screen("! !");
      random_array = create_random_array();
      setTimeout(display_count, 1000);
      setTimeout(display_sequence_to_mem, 1000);
    } else {
      flash_count_screen("! !");
      setTimeout(display_count, 1000);
      setTimeout(display_sequence_to_mem, 1000);
    }
  }
  function on_button() {
    document.getElementById("on_button").style.display = "none";
    document.getElementById("off_button").style.display = "inline-block";
    game_is_on = true;
    show_count_number.style.display = "inline";
    show_count_number.innerHTML = "- -";
  }
  function off_button() {
    document.getElementById("on_button").style.display = "inline-block";
    document.getElementById("off_button").style.display = "none";
    document.getElementById("strict_light").style.backgroundColor = "black";
    game_is_on = false;
    strict = false;
    show_count.innerHTML = "";
    clearInterval(go);
    clearTimeout(timer);
    colors.map(function (a) {
      return document.getElementById(a).style.backgroundColor = dark_colors[a];
    });
  }

  function start_game() {
    if (!game_is_on) {
      return;
    }
    turn = 1;
    random_array = create_random_array();
    flash_count_screen("- -");
    setTimeout(display_count, 1000);
    setTimeout(display_sequence_to_mem, 1000);
  }
  function your_turn() {
    comp_turn = false;
    snippet = snippet_copy;
    give_player_two_secs_to_answer();
  }

  function display_sequence_to_mem() {
    comp_turn = true;
    snippet = random_array.slice(0, turn);
    snippet_copy = Array.from(snippet);
    go = setInterval(show_colors_flashing_with_ton, 1100);
    function show_colors_flashing_with_ton() {
      if (turn === 3) {
        clearInterval(go);
        clearTimeout(timer);
        youve_won();
        return;
      } else if (!snippet.length) {
        clearInterval(go);
        your_turn();
      } else {
        var first = snippet[0];
        document.getElementById(first).style.backgroundColor = light_colors[first];
        delay_flashing(first);
        play_tone(first);
        snippet.shift();
      }
    }
  }
  function delay_flashing(first) {
    setTimeout(function () {
      document.getElementById(first).style.backgroundColor = dark_colors[first];
    }, 1000);
  }

  function flash_count_screen(val) {
    document.getElementById("show_count_number").innerHTML = val;
    $("#show_count_number").fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300);
  }
  function strict_button() {
    if (!game_is_on) {
      return;
    }
    var strict_id = document.getElementById("strict_light");
    if (!strict) {
      strict = true;
      strict_id.style.backgroundColor = "#FF4500";
    } else {
      strict = false;
      strict_id.style.backgroundColor = "black";
    }
  }
  function create_random_array() {
    var array = [];
    for (var i = 0; i < 20; i++) {
      array[i] = colors[Math.floor(Math.random() * 4)];
    }
    return array;
  }
  function display_count() {
    if (turn < 10) {
      show_count.innerHTML = "0" + turn;
    } else {
      show_count.innerHTML = turn;
    }
  }
  function play_tone(val) {
    tones[val].pause();
    tones[val].play();
  }

  function youve_won() {
    flash_count_screen("WIN");
    setTimeout(start_game, 3000);
  }

  return {
    click_color: click_color,
    on_button: on_button,
    off_button: off_button,
    strict_button: strict_button,
    start_game: start_game
  };
}();