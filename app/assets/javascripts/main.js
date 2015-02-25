console.log('loaded, bru.');

var $randomPokemon, // page element references (set on load below...)
    $newPokeball,
    $pokeballs,
    $pokeballListEl,
    $pokemon;

// Below are the functions necessary to create the HTML for a Pokemon
// object on the screen. You need to call the first function with a
// JS object that has the attributes id, name, pkdx_id, and image_url
// (at least), and a string name of who can catch it

var attachLargePokemonTemplate = function(attributes) {
  clearRandomPokemon();
  $randomPokemon.removeClass('empty');
  $pokemon = $templatePokemonLarge(attributes, capitalize(iChoseNext()));
  $randomPokemon.append($pokemon);
}

var clearRandomPokemon = function() {
  $randomPokemon.children().fadeOut().remove();
}

var $templatePokemonLarge = function(attributes, person) {
  $template = $('<div class="pokemon template large animated zoomIn">')
                .attr('data-rid',     attributes.id) // rails id
                .attr('data-pkdx-id', attributes.pkdx_id);
  $('<h4>').text(attributes.name).appendTo($template);
  $image = $('<img class="poke-sprite" width="120"/>')
             .attr('src', attributes.image_url);
  $('<div class="sprite-canvas">')
    .append($image)
    .appendTo($template);
  $('<br>').appendTo($template);
  $('<button type="button" class="btn btn-md btn-default" id="catch-pokemon">')
    .text('Catch for ' + person + '!')
    .on('click', catchPokemon)
    .appendTo($template);
  return $template;
}

// Attach and template functions for new pokeballs and new pokemon in pokeballs!
var attachPokeball = function(attributes) {
  // call your pokeball template and then append it where it should go
}

var $templatePokeball = function(attributes) {
  // create a small jQuery template for pokéballs
}

var attachSmallPokemonTemplate = function(attributes, elementAppendedTo) {
  var $template = $templatePokemonSmall(attributes);
  $template.appendTo(elementAppendedTo);
}

var $templatePokemonSmall = function(attributes) {
  var $template = $('<div class="pokemon template small animated zoomIn">').attr('data-rid', attributes.id).attr('data-pkdx-id', attributes.pkdx_id)
  $('<h4>').text(attributes.name).appendTo($template);
  $('<img class="poke-sprite" width="100">').attr('src', attributes.image_url).appendTo($template)

  return $template;
}

var currentPokemonData = function(){
  return {
    id:        $pokemon.data('rid'),
    pkdx_id:   $pokemon.data('pkdx_id'),
    name:      $pokemon.find('h4').text(),
    image_url: $pokemon.find('img').attr('src')
  }
}

var catchPokemon = function(e) {
  $chosen_player = $('.chosen').children().first();
  $pokemon       = $(e.target).parent();

  // $.ajax({
  //   url:  'pokeballs/'+id+'/pokemons',
  //   type: 'POST'
  // })

  var data = currentPokemonData();
  clearRandomPokemon();
  attachSmallPokemonTemplate(data, $chosen_player.find(".panel-body"))

  console.log($chosen_player.data('name') + ' --> ' + $pokemon.data('rid'));
}

// these functions change the chosen pokeball and return whose pokeball it is
var iChoseNext = function() {
  $col    = $('.pokeball-col');
  $chosen = $('.chosen');
  if ($chosen.length != 0) { // if there is a chosen pokeball!
    $next   = $chosen.next();
    if ($next.hasClass('new-pokeball')) { // start over
      $next = $next.siblings().first();
    }
    $chosen.removeClass('chosen');
    $next.addClass('chosen');

    return currentPlayer($next);
  } else if ($col.length != 0) { // no one chosen yet!
    $chosen = $col.first().addClass('chosen');

    return currentPlayer($chosen);
  } else { // no pokeballs!
    return null;
  }
}

var currentPlayer = function($chosen) {
  return $chosen.children().first().data('name');
}

$(document).ready(function() {
  $randomPokemon = $('#show-random-poke');
  $newPokeball   = $('#add-pokeball');
  $pokeballs     = $('.panel');
  $pokeballListEl = $('.pokeballs');

  $('#generate-random-poke').on('click', function(e) {

    $.ajax({
      url: "http://localhost:3000/pokemons",
      type: "GET",
      dataType: "json",
      data: {random: true}
    }).done(function(data){
      attachLargePokemonTemplate(data)
    })
  });

  var philBall  = $pokeballs.find(".panel-body")[0]
  $.ajax({
    url: "http://localhost:3000/pokeballs/1/pokemons",
    type: "GET",
    dataType: "json"
  }).done(function(data){
    for(i=0;i<data.length;i++){
      attachSmallPokemonTemplate(data[i], philBall)
    }
  })

var sarahBall =$pokeballs.find(".panel-body")[1]
  $.ajax({
    url: "http://localhost:3000/pokeballs/2/pokemons",
    type: "GET",
    dataType: "json"
  }).done(function(data){
    for(i=0;i<data.length;i++){
      attachSmallPokemonTemplate(data[i], sarahBall)
    }
  })
});

// Utility function!

var capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
}
