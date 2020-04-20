/*------------------------------------------------------------------
Directory:
	/js/elements.js

Description:
	Contains elements functionality.
-------------------------------------------------------------------*/

var isSiteBuilder = $html.hasClass("luminal-sitebuilder"); // [sitebuilder]
var elementsAnimationEasing = "easeInOutQuad";
var pageIntervals = [];
var customJSDocReadyPageLoadExists = typeof customJSDocReadyPageLoad !== 'undefined' && $.isFunction(customJSDocReadyPageLoad);
var customJSPageUnloadExists = typeof customJSPageUnload !== 'undefined' && $.isFunction(customJSPageUnload);
window.elementsEventsDisabled = false;





/*-------------------------------------------------------------------
SECTIONS FULLSCREEN
-------------------------------------------------------------------*/
function sectionsFullscreenUpdate($sectionFullscreen) {
	var pageOffsetTop = !isSiteBuilder ? $pagesLoadArea.offset().top : $("#page-canvas").offset().top;
	var windowHeight = $window.height();
	$sectionFullscreen.each(function() {
		var $this = $(this);
		var $sectionContent = $this.children(".page-content-aligner");
		if( $sectionContent.outerHeight() >= windowHeight - 250 ) {
			$this.addClass("section-fullscreen-off").css("height", "");
		} else {
			$this.removeClass("section-fullscreen-off");
		}
		if( $this.not(".section-fullscreen-off").length ) {
			$this.css("height", windowHeight - pageOffsetTop + "px");
		}
	});
}
var $sectionFullscreenInit = $doc.find(".section-fullscreen-on");
if( !isSiteBuilder && $sectionFullscreenInit.length ) {
	$window.on("resize", function() {
		sectionsFullscreenUpdate($sectionFullscreenInit);
	});
}





/*-------------------------------------------------------------------
SCROLL REVEAL (all options: https://github.com/jlmakes/scrollreveal)
-------------------------------------------------------------------*/
$doc.on("ready", function() {
	window.sr = ScrollReveal({
		reset: false,
		origin: "bottom",
		distance: "100px",
		duration: 1000,
		delay: 150,
	});
});
function scrollRevealInit(scrollRevealElements) {
	sr.reveal(scrollRevealElements);
}





/*-------------------------------------------------------------------
IMAGE OVERLAY ELEMENT
-------------------------------------------------------------------*/
var imageOverlayAnimSpeed = 120;
var imageOverlays = ".image-gallery-element .image-overlay-element, .image-overlay-element[data-pb-element]:not(html.luminal-sitebuilder #sand-types .image-overlay-element)";
$doc.on("mouseenter", imageOverlays, function() {
	if( !elementsEventsDisabled ) {
		$(this).find(".image-overlay-details").stop().fadeIn(imageOverlayAnimSpeed, elementsAnimationEasing);
	}
});

$doc.on("mouseleave", imageOverlays, function() {
	if( !elementsEventsDisabled ) {
		$(this).find(".image-overlay-details").stop().fadeOut(imageOverlayAnimSpeed, elementsAnimationEasing);
	}
});





/*-------------------------------------------------------------------
TABS ELEMENT
-------------------------------------------------------------------*/
function tabsElement(refreshTabsElements) {
	refreshTabsElements.tabs({
		activate: function(event, ui) {
			var newPanel = ui.newPanel;
			var oldPanel = ui.oldPanel;
			hiddenGmapsInit(newPanel);
			builderSortablesToggle(newPanel, oldPanel); // [sitebuilder]
		}
	});
}





/*-------------------------------------------------------------------
SLIDER ELEMENT (jQueryUI tabs in disguise)
-------------------------------------------------------------------*/
// Extend jQuery UI tabs
$.widget("custom.tabs", $.ui.tabs, {
	_getList: function() { // Prevent UI tabs from choosing wrong list as navigation
		var list = this.element.find("> .this-tabs-nav");
		return list.length ? list.eq(0) : this._super();
	},
	_tabKeydown: function(e) { // [sitebuilder] Fix space bug when editing text
		this._super("_tabKeydown");
	}
});

function sliderElementInit(refreshSliderElement1) {
	refreshSliderElement1.each(function(i, el) {
		var thisSlider = $(this);
		var slidesContainer = thisSlider.children(".slider-1-slides-container");
		var effect = thisSlider.attr("data-slider-effect");
		var duration = parseInt(thisSlider.attr("data-slider-duration"), 10);
		var autoPlay = parseInt(thisSlider.attr("data-slider-autoplay"), 10);
		var easing = thisSlider.attr("data-slider-easing");
		var hoverPause = thisSlider.attr("data-slider-hover-pause");
		var sliderInfinite = thisSlider.attr("data-slider-infinite");
		var arrowsOff = thisSlider.hasClass("slider-arrows-off");
		var thisSliderNav = thisSlider.children(".slider-1-nav");
		var thisSliderRightArrow = slidesContainer.children(".slider-1-arrow-right");
		var thisSliderLeftArrow = slidesContainer.children(".slider-1-arrow-left");
		var thisSliderRightLeftArrow = thisSliderRightArrow.add(thisSliderLeftArrow);

		// when "slider" is created
		thisSlider.tabs({
			create: function(event, ui) {
				if( !arrowsOff ) {
					thisSliderRightLeftArrow.removeClass("slider-arrow-disabled");
					if( sliderInfinite == "false" ) {
						if( thisSlider.tabs("option", "active") === 0 ) {
							thisSliderLeftArrow.addClass("slider-arrow-disabled");
						} else if( (thisSlider.tabs("option", "active") + 1) === thisSliderNav.children(".ui-tabs-tab").length ) {
							thisSliderRightArrow.addClass("slider-arrow-disabled");
						}
					}
				}
			}
		});

		// initiate
		if( effect !== "slide" && effect !== "drop" ) {
			thisSlider.tabs({
				show: {effect:effect, duration:duration, easing:easing},
				hide: {effect:effect, duration:duration, easing:easing},
				beforeActivate: function(event, ui) {
					var newPanel = ui.newPanel;
					tabsPagejumpFix(slidesContainer, newPanel, duration);
				}
			});
		} else {
			thisSlider.tabs({
				beforeActivate: function(event, ui) {
					var oldTab = ui.oldTab;
					var newTab = ui.newTab;
					var newPanel = ui.newPanel;
					tabsPagejumpFix(slidesContainer, newPanel, duration);
					sliderAnimation(thisSlider, oldTab, newTab, effect, duration, easing);
				}
			});
		}

		// when "slider" switches
		thisSlider.tabs({
			activate: function(event, ui) {
				var newPanel = ui.newPanel;
				var oldPanel = ui.oldPanel;
				var activeTab = ui.newTab.index();
				slidesContainer.css("height", ""); // remove fixed height style
				hiddenGmapsInit(newPanel);
				sectionsFullscreenUpdate(newPanel.find(".section-fullscreen-on"));
				builderSortablesToggle(newPanel, oldPanel); // [sitebuilder]
				// disable arrow if slider is finite and last slide or first slide is active
				if( sliderInfinite == "false" && !arrowsOff && thisSlider.hasClass("ui-tabs") ) {
					var activeTab = thisSlider.tabs("option", "active") + 1;
					var tabsLength = slidesNavTabs.length;
					if( thisSliderRightLeftArrow.hasClass("slider-arrow-disabled") ) {
						thisSliderRightLeftArrow.removeClass("slider-arrow-disabled");;
					}
					if( activeTab === tabsLength ) {
						thisSliderLeftArrow.removeClass("slider-arrow-disabled");
						thisSliderRightArrow.addClass("slider-arrow-disabled");
					} else if( activeTab === 1 ) {
						thisSliderRightArrow.removeClass("slider-arrow-disabled");
						thisSliderLeftArrow.addClass("slider-arrow-disabled");
					}
				}
				// [sitebuilder] switch to first tab if not active after animation
				if( isSiteBuilder && thisSlider.hasClass("identify-options-element") && activeTab !== 0 ) {
					thisSlider.tabs("option", "active", 0);
				}
			}
		})

		// autoplay
		var slidesNavTabs = thisSliderNav.children(".ui-tabs-tab");
		var slidesNavTabsAndArrows = slidesNavTabs.add(thisSliderRightLeftArrow);
		if( autoPlay > 0 ) {
			var slider1Ints = window.setInterval(function() {
				sliderElementAutoplay(thisSlider, hoverPause, slidesContainer, slidesNavTabs);
			}, autoPlay);
			pageIntervals.push({id:slider1Ints, elem:thisSlider});

			// restart autoplay interval when arrow/tab is clicked
			slidesNavTabsAndArrows.off("click.reset-slider-interval").on("click.reset-slider-interval", function() {
				window.clearInterval(slider1Ints);
				slider1Ints = window.setInterval(function() {
					sliderElementAutoplay(thisSlider, hoverPause, slidesContainer, slidesNavTabs);
				}, autoPlay);
				pageIntervals.push({id:slider1Ints, elem:thisSlider});
			});
		} else if( isSiteBuilder ) { // [sitebuilder]
			slidesNavTabsAndArrows.off("click.reset-slider-interval"); // remove 'reset-interval' event if autoplay is disabled in sitebuilder
		}
	});
}

// slider element autoplay function
window.pauseAutoSlider = false;
function sliderElementAutoplay(thisSlider, hoverPause, slidesContainer, slidesNavTabs) {
	if( thisSlider.is(":hover") ) {
		if( hoverPause == "true" ) { return false } // cancel autoslide if hover pause option is enabled
		else if( isSiteBuilder ) { return false } // [sitebuilder] cancel autoslide in sitebuilder regardless of option
	}
	if( thisSlider.find(".identify-options-element, .identify-color-options-element, .slider-1-slide .cke_focus").andSelf(".identify-options-element").length == 0 && !pauseAutoSlider && isScrolledIntoView(slidesContainer.children(".slider-1-slide:visible")) ) {
		var activeTab = thisSlider.tabs("option", "active");
		var tabsLength = slidesNavTabs.length - 1;
		if( activeTab < tabsLength ) {
			thisSlider.tabs("option", "active", activeTab + 1);
		} else {
			thisSlider.tabs("option", "active", 0);
		}
	}
}

// animate height of slides container on slide switch
function tabsPagejumpFix(slidesContainer, newPanel, duration) {
	slidesContainer.animate({"height": newPanel.outerHeight()}, duration);
}

// arrow navigation
$doc.on("click", ".slider-1-arrow-right, .slider-1-arrow-left", function() {
	var $this = $(this);
	var rightArrowClicked = $this.hasClass("slider-1-arrow-right");
	var leftArrowClicked = $this.hasClass("slider-1-arrow-left");
	var thisSlider = $this.closest(".slider-element-1");
	var activeTab = thisSlider.tabs("option", "active");
	var tabsLength = thisSlider.children(".slider-1-nav").children("li").length - 1;
	var sliderInfinite = thisSlider.attr("data-slider-infinite");

	if( rightArrowClicked ) { var direction = activeTab + 1 } // right arrow
	else if( leftArrowClicked ) { var direction = activeTab - 1 } // left arrow

	if( direction <= tabsLength && direction >= 0 ) {
		thisSlider.tabs("option", "active", direction);
	} else if( sliderInfinite == "true" ) {
		if( rightArrowClicked ) { thisSlider.tabs("option", "active", 0) }
		else if( leftArrowClicked ) { thisSlider.tabs("option", "active", tabsLength) }
	}
});

// animation direction
function sliderAnimation(thisSlider, oldTab, newTab, effect, duration, easing) {
	if( oldTab.index() < newTab.index() ) {
		thisSlider.tabs({
			show: {effect:effect, direction:"right", duration:duration, easing:easing},
			hide: {effect:effect, direction:"left", duration:duration, easing:easing}
		});
	} else {
		thisSlider.tabs({
			show: {effect:effect, direction:"left", duration:duration, easing:easing},
			hide: {effect:effect, direction:"right", duration:duration, easing:easing}
		});
	}
}

// element is in scroll view
function isScrolledIntoView(element) {
	var $element = $(element);
	if( $element.is(":visible") ) {
		var scrollTop = $window.scrollTop();
		var bottomView = scrollTop + $window.height();
		var elementOffsetTop = $element.offset().top;
		var elementBottomView = elementOffsetTop + $element.height();
		return((( elementOffsetTop >= scrollTop) && (elementOffsetTop <= bottomView)) || ((elementBottomView >= scrollTop) && (elementBottomView <= bottomView)));
	}
}





/*-------------------------------------------------------------------
ELEMENT ALIGNER 10 TABS
-------------------------------------------------------------------*/
var aligner10AnimSpeed = 300;
function aligner10Tabs(refreshElementAligner10) {
	refreshElementAligner10.each(function() {
		var $this = $(this);
		var slidesContainer = $this.children(".aligner-10-slides-container");
		$this.tabs({
			hide: { effect: "drop", duration: aligner10AnimSpeed, direction: "up", easing: elementsAnimationEasing },
			show: { effect: "drop", duration: aligner10AnimSpeed, direction: "up", easing: elementsAnimationEasing },
			beforeActivate: function(event, ui) {
				var newPanel = ui.newPanel;
				tabsPagejumpFix(slidesContainer, newPanel, aligner10AnimSpeed);
			},
			activate: function(event, ui) {
				var newPanel = ui.newPanel;
				var oldPanel = ui.oldPanel;
				slidesContainer.css("height", ""); // remove fixed height
				hiddenGmapsInit(newPanel);
				builderSortablesToggle(newPanel, oldPanel); // [sitebuilder]
			}
		});
	});
}





/*-------------------------------------------------------------------
ELEMENT ALIGNER 11 TABS
-------------------------------------------------------------------*/
function aligner11Tabs(refreshElementAligner11Tabs) {
	refreshElementAligner11Tabs.tabs({
		activate: function(event, ui) {
			var newPanel = ui.newPanel;
			var oldPanel = ui.oldPanel;
			hiddenGmapsInit(newPanel);
			builderSortablesToggle(newPanel, oldPanel); // [sitebuilder]
		}
	});
}





/*-------------------------------------------------------------------
TABS DROPDOWN ELEMENT
-------------------------------------------------------------------*/
var tabsToggleAnimSpeed = 200;
$doc.on("click", ".tabs-dropdown-element .dropdown-arrow-q", function() {
	if( !elementsEventsDisabled ) {
		var $this = $(this);
		var $thisTabDropdownContent = $this.parent("li").children(".tabs-dropdown-content");
		var allTabsDropdownContent = $this.parents("ul").children("li").children(".tabs-dropdown-content");

		allTabsDropdownContent.filter(":visible").stop().slideUp(tabsToggleAnimSpeed, elementsAnimationEasing);
		$thisTabDropdownContent.stop().slideToggle(tabsToggleAnimSpeed, elementsAnimationEasing, function() {
			$thisTabDropdownContent.css("height", "");
			if( $thisTabDropdownContent.is(":visible") ) { hiddenGmapsInit($thisTabDropdownContent) }
			builderSortablesToggle(allTabsDropdownContent.filter(":visible"), allTabsDropdownContent.filter(":hidden")); // [sitebuilder]
		});
	}
});





/*-------------------------------------------------------------------
INFO CELL 4
-------------------------------------------------------------------*/
var info4AnimSpeed = 500;
$doc.on("mouseenter touchstart", ".info-cell-4-group .info-cell-4-group-containers:not(html.luminal-sitebuilder .current-builder-mode.edit-text-on .info-cell-4-group .info-cell-4-group-containers), .info-cell-4:not(html.luminal-sitebuilder #sand-types .info-cell-4, .info-cell-4-group .info-cell-4, html.luminal-sitebuilder .current-builder-mode.edit-text-on .info-cell-4)", function() {
	if( !elementsEventsDisabled ) {
		var info4slideContent = $(this).find(".info-cell-4-top");
		info4slideContent.stop().slideUp(info4AnimSpeed, "easeInOutExpo", function() {
			info4slideContent.css("height", "");
		});
	}
});

$doc.on("mouseleave touchend", ".info-cell-4-group .info-cell-4-group-containers:not(html.luminal-sitebuilder .current-builder-mode.edit-text-on .info-cell-4-group .info-cell-4-group-containers), .info-cell-4:not(html.luminal-sitebuilder #sand-types .info-cell-4, .info-cell-4-group .info-cell-4, .info-cell-4-group .info-cell-4, html.luminal-sitebuilder .current-builder-mode.edit-text-on .info-cell-4)", function() {
	if( !elementsEventsDisabled ) {
		var info4slideContent = $(this).find(".info-cell-4-top");
		info4slideContent.stop().slideDown(info4AnimSpeed, "easeOutBounce", function() {
			info4slideContent.css("height", "");
		});
	}
});





/*-------------------------------------------------------------------
STELLAR PARALLAX
-------------------------------------------------------------------*/
function stellarParallax() {
	$window.stellar({
		horizontalOffset: 0,
		verticalScrolling: true,
		horizontalScrolling: false,
		parallaxBackgrounds: true,
		parallaxElements: false,
		hideDistantElements: false,
		responsive: false
	}).stellar("refresh");
}





/*-------------------------------------------------------------------
GOOGLE MAPS ELEMENT
-------------------------------------------------------------------*/
var gMapsLoaded = false;
var map;

// load Google Maps API if not already loaded
function loadGMaps(refreshGoogleMapsEmbed) {
	var refreshGoogleMapsEmbedElement = refreshGoogleMapsEmbed.hasClass("google-maps-embed") ? refreshGoogleMapsEmbed : refreshGoogleMapsEmbed.find(".google-maps-embed");
	var gMapsLoadingScript = false;
	if( gMapsLoaded === false ) {
		if( gMapsLoadingScript === false ) {
			gMapsLoadingScript = true;
			$.getScript("https://maps.googleapis.com/maps/api/js?async=2&key="+ $body.attr("data-gmaps-apikey") +"&callback=GMapsInit").done(function() {
				gMapsLoadingScript = false;
			}).fail(function() {
				gMapsLoadingScript = false;
			});
		}
	} else if( gMapsLoaded === true ) {
		GMapsInit(refreshGoogleMapsEmbedElement);
	}
}

// initialize map
function GMapsInit(refreshGoogleMapsEmbed) {
	gMapsLoaded = true;
	if( !refreshGoogleMapsEmbed ) {
		refreshGoogleMapsEmbed = $body.find(".google-maps-embed:not(.map-initialized, html.luminal-sitebuilder #sand-types .google-maps-embed)");
	}
	refreshGoogleMapsEmbed.not(":hidden").each(function() {
		if( typeof google === 'object' && typeof google.maps === 'object' ) {
			map = new google.maps.Map(this);
		} else {
			return false;
		}

		var $this = $(this);
		var data = $this.data();
		var scrollzoom = data.scrollzoom;
		var hidecontrols = data.hidecontrols;
		var zoom = data.zoom;
		var lat = data.lat || 40.7577;
		var lng = data.lng || -73.9857;
		var marker = data.usemarker;
		var maptype = data.maptype;
		var latlng = {lat:lat, lng:lng};

		map.setOptions({
			scrollwheel: scrollzoom || false,
			center: new google.maps.LatLng(lat, lng),
			disableDefaultUI: hidecontrols || false,
			zoom: zoom || 10
		});

		// map type
		if( maptype == "roadmap" ) {
			map.setOptions({
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
		} else if( maptype == "satellite" ) {
			map.setOptions({
				mapTypeId: google.maps.MapTypeId.SATELLITE
			});
		} else if( maptype == "hybrid" ) {
			map.setOptions({
				mapTypeId: google.maps.MapTypeId.HYBRID
			});
		} else if( maptype == "terrain" ) {
			map.setOptions({
				mapTypeId: google.maps.MapTypeId.TERRAIN
			});
		}

		// marker
		if( marker == true ) {
			var marker = new google.maps.Marker({
				position: latlng,
				map: map
			});
		}

		// refresh maps
		google.maps.event.addListenerOnce(map, "idle", function() {
			google.maps.event.trigger(this, "resize");
		});

		$this.addClass("map-initialized");
	});
}

// initialize and resize hidden maps
function hiddenGmapsInit(hiddenGmapContainer) {
	var refreshGoogleMapsEmbed = hiddenGmapContainer.find(".google-maps-embed:not(.map-initialized)");
	if( refreshGoogleMapsEmbed.length ) { GMapsInit(refreshGoogleMapsEmbed) }
	hiddenGmapContainer.find(".google-maps-embed.map-initialized").each(function() { google.maps.event.trigger(this, "resize") });
}





/*-------------------------------------------------------------------
IMAGE CARD ELEMENT
-------------------------------------------------------------------*/
var imgCardAnimSpeed = 200;
$doc.on("mouseenter", ".image-card-element:not(html.luminal-sitebuilder #sand-types .image-card-element, html.luminal-sitebuilder .current-builder-mode.element-options-on .image-card-element, html.luminal-sitebuilder .current-builder-mode.edit-text-on .image-card-element, html.luminal-sitebuilder .current-builder-mode.colors-option-on .image-card-element, .image-card-element-hover-effect-off, .image-card-gallery.image-card-element-hover-effect-off .image-card-element)", function() {
	if( !elementsEventsDisabled ) {
		var $this = $(this);
		var filterOverlay = $this.find(".img-card-filter-overlay");
		if( filterOverlay.queue("fx").length == 0 ) {
			$this.find(".img-card-info-h1").hide("drop", {direction: "up"}, imgCardAnimSpeed);
			$this.find(".img-card-info-h4").hide("drop", {direction: "down"}, imgCardAnimSpeed);
			filterOverlay.fadeOut(imgCardAnimSpeed);
		}
	}
});

$doc.on("mouseleave", ".image-card-element:not(html.luminal-sitebuilder #sand-types .image-card-element, html.luminal-sitebuilder .current-builder-mode.element-options-on .image-card-element, html.luminal-sitebuilder .current-builder-mode.edit-text-on .image-card-element, html.luminal-sitebuilder .current-builder-mode.colors-option-on .image-card-element, .image-card-element-hover-effect-off, .image-card-gallery.image-card-element-hover-effect-off .image-card-element)", function() {
	if( !elementsEventsDisabled ) {
		var $this = $(this);
		$this.find(".img-card-filter-overlay").fadeIn(imgCardAnimSpeed);
		$this.find(".img-card-info-h1").show("drop", {direction: "up"}, imgCardAnimSpeed);
		$this.find(".img-card-info-h4").show("drop", {direction: "down"}, imgCardAnimSpeed);
	}
});





/*-------------------------------------------------------------------
IMAGE MENU ELEMENT
-------------------------------------------------------------------*/
$doc.on("mouseenter touchstart", ".image-menu-element .image-menu-items > li", function() {
	var $this = $(this);
	var imgUrl = $this.attr("data-pb-opt-bg-src");
	// [sitebuilder] override 'imgUrl' variable and get image from style
	if( isSiteBuilder ) {
		imgUrl = $this.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1')
	}
	$this.parents(".image-menu-items").siblings(".image-menu-img").children("img").attr("src", imgUrl);
	// active menu item
	$this.parent().children("li").removeClass("image-menu-item-hover");
	$this.addClass("image-menu-item-hover");
});





/*-------------------------------------------------------------------
FILTER ELEMENT
-------------------------------------------------------------------*/
function filterElementInit(refreshFilterElement) {
	refreshFilterElement.each(function() {
		var $this = $(this);
		var filterCategories = $this.children(".filter-element-header").children(".filter-categories");
		var filterSearch = $this.find(".filter-search input");
		var filterOrigCategories = $this.find(".filter-orig-categories");

		// filter options
		var animationType = $this.attr("data-animation-type");
		var displayType = $this.attr("data-display-type");
		var displayTypeSpeed = parseInt($this.attr("data-display-type-speed"), 10);
		var layoutMode = $this.attr("data-layout-mode");
		var gapHorizontal = parseInt($this.attr("data-gap-horizontal"), 10);
		var gapVertical = parseInt($this.attr("data-gap-vertical"), 10);

		$this.children(".filter-containers").cubeportfolio({
			filters: filterCategories,
			animationType: animationType,
			displayType: displayType,
			displayTypeSpeed: displayTypeSpeed,
			layoutMode: layoutMode,
			gapHorizontal: gapHorizontal,
			gapVertical: gapVertical,
			search: filterSearch,
			gridAdjustment: "responsive",
			mediaQueries: [{width: 1440, cols: 4}, {width: 1024, cols: 3}, {width: 768, cols: 2}, {width: 480, cols: 1}]
		});

		// drop menu element initial
		var filterDropMenuEl = filterCategories.find(".drop-menu-element");
		var filterDropMenuElLabel = filterDropMenuEl.find(".dropmenu-label");
		filterDropMenuElLabel.text( filterDropMenuEl.find("li.cbp-filter-item-active > .filter-category-name").text() );

		// filter categories menu's active tab sync
		if( !$this.hasClass("version-3") ) {
			$this.on("filterComplete.cbp", function() {
				if( filterOrigCategories.is(":hidden") ) {
					var hiddenFilterMenu = filterOrigCategories;
					var activeFilterTab = filterDropMenuEl.find("li.cbp-filter-item-active");
				} else if( filterDropMenuEl.is(":hidden") ) {
					var hiddenFilterMenu = filterDropMenuEl;
					var activeFilterTab = filterOrigCategories.find("li.cbp-filter-item-active");
					// update filter menu label
					filterDropMenuElLabel.text( activeFilterTab.text() );
				}
				hiddenFilterMenu.find("li.cbp-filter-item-active").removeClass("cbp-filter-item-active");
				hiddenFilterMenu.find("li[data-filter='"+ activeFilterTab.attr("data-filter") +"']").addClass("cbp-filter-item-active");
			});
		}

		$this.addClass("filter-initialized");
	});
}





/*-------------------------------------------------------------------
DROP MENU ELEMENT
-------------------------------------------------------------------*/
function dropmenuElementSlideUp(dropmenu) {
	dropmenu.stop().slideUp(150, elementsAnimationEasing, function() {
		dropmenu.css("height", "");
	});
}

$doc.on("mouseenter touchstart", ".drop-menu-element:not(#sand-types .drop-menu-element)", function() {
	var dropmenu = $(this).children(".dropmenu-menu");
	dropmenu.stop().slideDown(150, elementsAnimationEasing, function() {
		dropmenu.css("height", "");
	});
});

$doc.on("mouseleave", ".drop-menu-element:not(#sand-types .drop-menu-element)", function() {
	var dropmenu = $(this).children(".dropmenu-menu");
	dropmenuElementSlideUp(dropmenu);
});

$doc.on("click", ".drop-menu-element li", function() {
	var $this = $(this);
	var parentFilterElDropmenu = $this.parents(".filter-el-dropmenu");
	if( !isSiteBuilder || parentFilterElDropmenu.length ) { // [sitebuilder]
		var parentDropmenuElement = $this.parents(".drop-menu-element");
		if( parentFilterElDropmenu.length ) {
			var labelText = $this.children(".filter-category-name").text();
		} else {
			var labelText = $this.children("a").text();
		}
		parentDropmenuElement.find(".dropmenu-label").text(labelText);

		// slide up on tab click if enabled
		if( parentDropmenuElement.attr("data-slide-up-menu-onchange") == "true" && !$this.find("[contenteditable='true']").length ) {
			var dropmenu = $this.parents(".dropmenu-menu");
			dropmenuElementSlideUp(dropmenu);
		}
	}
});





/*-------------------------------------------------------------------
CONTACT FORMS AJAX SUBMISSION
	Submit the contact forms using AJAX
-------------------------------------------------------------------*/
var formMaxAttachments = 20;
var closeFormAjaxSubmitResponse;
var formSubmitFailedMessage = "An error occured. The message could not be sent.";
if( !isSiteBuilder ) { // [sitebuilder]
	var fileReaderSupport = Modernizr.filereader;
	var formDataSupport = Modernizr.xhr2;
}

function ajaxContactFormElements(refreshFormElement4) {
	if ( formDataSupport ) { // Submit form with ajax if 'FormData' is supported
		refreshFormElement4.each(function() {
			var form = $(this);
			var formInputFile = form.find("input[type='file']");
			var formInputFileLength = formInputFile.length;
			var submitResponseContainer = form.find(".form-ajax-submit-response .form-ajax-submit-response-content");
			var origFormMessage = submitResponseContainer.html();

			form.submit(function(event) {
				var formFiles = 0;
				if( formInputFileLength && fileReaderSupport ) {
					formFiles = formInputFile[0].files;
				}

				// Set original message, Disable response hiding, Show form message container
				submitResponseContainer.html(origFormMessage);
				closeFormAjaxSubmitResponse = false;
				form.find(".form-ajax-submit-response").show("fade", 200, elementsAnimationEasing);

				if( !fileReaderSupport || formInputFileLength == 0 || formFiles.length <= formMaxAttachments ) {
					$.ajax({
						url: form.attr("action"),
						type: "POST",
						data: new FormData(form[0]),
						cache: false,
						contentType: false,
						processData: false,
						complete: function() {
							closeFormAjaxSubmitResponse = true;
						}
					}).done(function(response) {
						submitResponseContainer.html(response);
					}).fail(function() {
						submitResponseContainer.html("<i class='fa fa-times'></i><div class='form-ajax-submit-response-message'>"+ formSubmitFailedMessage +"</div>");
					});
				} else {
					closeFormAjaxSubmitResponse = true;
					submitResponseContainer.html("<i class='fa fa-times'></i><div class='form-ajax-submit-response-message'>No more than <strong>"+ formMaxAttachments +"</strong> attachments allowed.</div>");
				}

				event.preventDefault();
			}).addClass("form-ajaxified");
		});
	}
}

// Hide ajax submit response after completion
$doc.on("click touchstart", "form .form-ajax-submit-response", function() {
	if( closeFormAjaxSubmitResponse == true ) {
		$(this).hide("fade", 200, elementsAnimationEasing);
	}
});

// Submit contact forms
if( !isSiteBuilder ) { // [sitebuilder]
	$doc.on("click", "form [data-submit-form]", function() {
		$(this).parents("form").submit();
	});
}





/*-------------------------------------------------------------------
INPUT FIELD FOCUS LABEL HIGHLIGHT
	When an input field is focused, its label is highlighted.
-------------------------------------------------------------------*/
$doc.on("focus focusout", ".input-focus-label-highlight input, .input-focus-label-highlight textarea", function() {
	$(this).parents(".input-focus-label-highlight").find(".input-focus-label").toggleClass("input-label-focus");
});





/*-------------------------------------------------------------------
INPUT FILES FUNCTIONALITY
	The custom version of input[file] within forms. Updates label
	text with the name/number of selected file(s).
-------------------------------------------------------------------*/
if( fileReaderSupport ) {
	$doc.on("change", ".forms-input-file-style input", function() {
		var $this = $(this);
		var inputVal = $this.siblings(".forms-input-file-span").find(".forms-input-file-val");
		var inputFilesLength = $this[0].files.length;
		if( inputFilesLength > 1 ) {
			inputVal.text( inputFilesLength + " " + $this.attr("data-multiple-files-text") )
		} else if( inputFilesLength === 1 ) {
			inputVal.text( $this.val().split(/(\\|\/)/g).pop() );
		} else if( inputFilesLength === 0 ) {
			inputVal.text( $this.attr("data-no-files-text") );
		}
	});
}





/*-------------------------------------------------------------------
INPUT CUSTOM CHECKBOX AND RADIO FUNCTIONALITY
	Checks/unchecks the custom checkbox and radio inputs depending on
	the status of the original.
-------------------------------------------------------------------*/
$doc.on("change", ".input-checkbox-style input, .input-radio-style input", function() {
	var $this = $(this);
	// checkbox
	if( $this.is(":checkbox") ) {
		var $inputCheckboxStyle = $this.parents(".input-checkbox-style");
		if( $this.is(":checked") ) {
			$inputCheckboxStyle.addClass("custom-checkbox-checked");
		} else {
			$inputCheckboxStyle.removeClass("custom-checkbox-checked");
		}
	}
	// radio
	else if( $this.is(":radio") ) {
		var $inputRadioStyle = $this.parents(".input-radio-style");
		var radioName = $this.attr("name");
		$this.parents("fieldset").find("input[type='radio'][name='"+ radioName +"']").parents(".input-radio-style").removeClass("custom-radio-enabled");
		if( $this.is(":checked") ) {
			$inputRadioStyle.addClass("custom-radio-enabled");
		} else {
			$inputRadioStyle.removeClass("custom-radio-enabled");
		}
	}
});

// Checkboxes and radio input status on load
function inputCheckboxRadioStyleChecked(refreshCheckboxInputStyle, refreshRadioInputStyle) {
	// checkbox
	refreshCheckboxInputStyle.filter(":checked").each(function() {
		$(this).parents(".input-checkbox-style").addClass("custom-checkbox-checked");
	});
	// radio
	refreshRadioInputStyle.filter(":checked").each(function() {
		$(this).parents(".input-radio-style").addClass("custom-radio-enabled");
	});
	// verified
	refreshCheckboxInputStyle.add(refreshRadioInputStyle).addClass("input-initial-status-verified");
}





/*-------------------------------------------------------------------
TRIGGER CODE WHEN DOCUMENT IS READY AND WHEN PAGE IS LOADED WITH AJAX
	The 'refresh' function checks if an element has been
	loaded and initiates the js for that element.
-------------------------------------------------------------------*/
function refresh() {
	// TABS ELEMENT
	var refreshTabsElements = $body.find(".tabs-element:not(.ui-tabs)");
	if( refreshTabsElements.length ) {
		tabsElement(refreshTabsElements)
	}

	// ELEMENT ALIGNER 10 TABS
	var refreshElementAligner10 = $body.find(".element-aligner-10:not(.ui-tabs)");
	if( refreshElementAligner10.length ) {
		aligner10Tabs(refreshElementAligner10)
	}

	// ELEMENT ALIGNER 11 TABS
	var refreshElementAligner11Tabs = $body.find(".element-aligner-11-uitabs:not(.ui-tabs)");
	if( refreshElementAligner11Tabs.length ) {
		aligner11Tabs(refreshElementAligner11Tabs)
	}

	// SLIDER ELEMENT 1
	var refreshSliderElement1 = $body.find(".slider-element-1:not(.ui-tabs)");
	if( refreshSliderElement1.length ) {
		sliderElementInit(refreshSliderElement1)
	}

	// GOOGLE MAPS EMBED
	var refreshGoogleMapsEmbed = $body.find(".google-maps-embed:not(.map-initialized)");
	if( refreshGoogleMapsEmbed.length ) {
		loadGMaps(refreshGoogleMapsEmbed)
	}

	// FILTER ELEMENT
	var refreshFilterElement = $body.find(".filter-element:not(.filter-initialized)");
	if( refreshFilterElement.length ) {
		filterElementInit(refreshFilterElement)
	}

	// CONTACT FORMS AJAX
	var refreshFormElement4 = $body.find(".form-input-element-4 form:not(.form-ajaxified)");
	if( refreshFormElement4.length ) {
		ajaxContactFormElements(refreshFormElement4)
	}

	// CUSTOM INPUT CHECKBOX & RADIO STYLE
	var refreshCheckboxInputStyle = $body.find(".input-checkbox-style input:not(.input-initial-status-verified)");
	var refreshRadioInputStyle = $body.find(".input-radio-style input:not(.input-initial-status-verified)");
	if( refreshCheckboxInputStyle.length || refreshRadioInputStyle.length ) {
		inputCheckboxRadioStyleChecked(refreshCheckboxInputStyle, refreshRadioInputStyle)
	}

	// SECTIONS FULL SCREEN
	var $sectionFullscreen = $doc.find(".section-fullscreen-on");
	if( $sectionFullscreen.length ) {
		sectionsFullscreenUpdate($sectionFullscreen);
	}

	// STELLAR PARALLAX EFFECT
	if( $body.find("[data-stellar-background-ratio]").length ) {
		stellarParallax()
	}

	// SCROLL REVEAL
	var scrollRevealElements = $doc.find("[data-scrollreveal]").removeAttr("data-scrollreveal");
	if( scrollRevealElements.length ) {
		scrollRevealInit(scrollRevealElements);
	}

	// CUSTOM JS CODE
	if( customJSDocReadyPageLoadExists ) {
		customJSDocReadyPageLoad()
	}
}

// Initiate elements on website load
$doc.one("ready", function() {
	if( !isSiteBuilder ) { // [sitebuilder]
		refresh()
	}
});

// [sitebuilder] toggle sortable if 'move elements' option is enabled
function builderSortablesToggle(visibleSortable, hiddenSortable) {
	if( isSiteBuilder ) {
		if( $(".current-builder-mode").hasClass("move-elements-on") ) {
			visibleSortable.add(visibleSortable.find(".ui-sortable[data-pb-accept]:visible")).not("[data-pb-accept-aligners], #sidebar-canvas .sidebar-content").sortable("enable");
			hiddenSortable.add(hiddenSortable.find(".ui-sortable[data-pb-accept]")).not("[data-pb-accept-aligners], #sidebar-canvas .sidebar-content").sortable("disable");
		}
	}
}





/*-------------------------------------------------------------------
GARBAGE COLLECTORS
	The following functions get rid of uneeded data and operations.
	setIntervals and instances are dumped when the elements are
	removed from the DOM on page switch when using AJAX.
-------------------------------------------------------------------*/
// DESTROY INSTANCES
function instancesGarbageCollector(gcRemovedElementsArea) {
	// jQuery UI tabs
	var jQueryUITabs = gcRemovedElementsArea.find(".ui-tabs").addBack(".ui-tabs");
	if( jQueryUITabs.length ) {
		jQueryUITabs.each(function() {
			$(this).tabs("destroy");
		});
	}

	// CubePortfolio
	var filterElements = gcRemovedElementsArea.find(".filter-element.filter-initialized").addBack(".filter-element");
	if( filterElements.length ) {
		filterElements.each(function() {
			var $this = $(this);
			$this.find(".filter-containers").cubeportfolio("destroy");
			$this.removeClass("filter-initialized");
		});
	}

	// Custom JS
	if( customJSPageUnloadExists ) {
		customJSPageUnload(gcRemovedElementsArea);
	}
}

// CLEAR INTERVALS
function intervalsGarbageCollector() {
	if( pageIntervals.length > 0 ) {
		pageIntervals = pageIntervals.filter(function(item) {
			if( $doc.find(item.elem).length === 0 || !$doc.find(item.elem).hasClass("ui-tabs") ) {
				window.clearInterval(item.id);
				return false;
			}
			return true;
		});
	}
}
