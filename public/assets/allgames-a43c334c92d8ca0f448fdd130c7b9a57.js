/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Kenneth Moy, kpmoy88@gmail.com, Bronx, New York, 06.2014
 */


$('.inDevelopment ul').hide();
$('.comingSoon ul').hide();
$('.playNow .arrow-down').hide();
$('.comingSoon .arrow-up').hide();
$('.inDevelopment .arrow-up').hide();

$('.gamelist div h4').click(openMenu);

// Toggle Menu Headers and Arrows
function openMenu() {
	$(this).siblings('ul').toggle();
	$(this).find(".arrow-up, .arrow-down").toggle();
}
;
