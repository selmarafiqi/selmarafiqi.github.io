/*------------------------------------------------------------------
Directory:
	/js/frame.js

Description:
	This file contains the JavaScript that handles
	functionalities within header, sidebar, website layouts, and
	ajax. Does not contain JavaScript for elements.
-------------------------------------------------------------------*/

var $doc = $(document);
var $window = $(window);
var $body = $("body");
var $html = $("html");
var $html$body = $body.add($html);
var $header = $("#header");
var $headerNavigation = $("#header-navigation");
var $pagesLoadArea = $("#pages-load-area");
var $sidebarArea = $("#sidebar-area");
var sidebarExist = $sidebarArea.length;
var isFrameLayout1 = $body.hasClass("frame-layout-1");
var isFrameLayout5 = $body.hasClass("frame-layout-5");
var animationEasing = "easeInOutQuad";





// Fade out and remove loading overlay
$window.one("load", function() {
	if( !$body.hasClass("no-loader") ) {
		$body.children(".loading-overlay").fadeOut(300, animationEasing, function() {
			$(this).remove();
		});
	}
});





/*-------------------------------------------------------------------
FRAME-LAYOUT-1 PAGES LOAD AREA SPACING
	The right spacing is added to the pages-load-area div and it
	depends on the width of the sidebar.
-------------------------------------------------------------------*/
if( sidebarExist ) {
	var sidebarWidth = parseFloat($sidebarArea.css("width"));
	if( isFrameLayout1 ) {
		var sidebarRightPos = parseFloat($sidebarArea.css("right"));
		var sidebarPageSpacing = parseFloat($sidebarArea.attr("data-sidebar-page-spacing"));
		var totalMargin = sidebarWidth + sidebarRightPos + sidebarPageSpacing;
		$pagesLoadArea.css("margin-right", totalMargin);
		$sidebarArea.css("visibility", "visible");
	}
}





/*-------------------------------------------------------------------
HEADER
	Responsive header, Search field toggle, tabs drop-menu
	functionality.
-------------------------------------------------------------------*/
if( !$body.hasClass("removed-header-area") ) {
	var dataResponsiveHeader = parseFloat($body.attr("data-responsive-header"));
	var extraResHeader = 0;
	var lessResHeader = 0;
	if( sidebarExist && !isFrameLayout5 ) { extraResHeader = 20; } else if( !sidebarExist ) { lessResHeader = 70 }
	var responsiveHeaderVal = dataResponsiveHeader + extraResHeader - lessResHeader;
	var $focusShadow2 = $("#focus-shadow-2");
	var $headerAreaAligner = $header.find(".area-aligner");
	var $headerDropmenu = $headerNavigation.find(".drop-menu");

	// Responsive header
	function responsiveHeader() {
		var headerAligner = $headerAreaAligner.width();
		if( headerAligner <= responsiveHeaderVal && !$html.hasClass("responsive-header-on") && !isFrameLayout5 ) {
			$html.addClass("responsive-header-on");
		} else if( headerAligner > responsiveHeaderVal && $html.hasClass("responsive-header-on") && !isFrameLayout5 ) {
			$html.removeClass("responsive-header-on header-absolute-on");
			$headerNavigation.css("display", "");
			$focusShadow2.hide();
		}
	}

	if( !isFrameLayout5 ) {
		responsiveHeader();
		checkHeaderOverflow();
		$window.on("resize", function() {
			responsiveHeader();
			checkHeaderOverflow();
		});
	}

	// Show responsive nav
	var responsiveNavSpeed = parseInt($body.attr("data-responsive-nav-speed"), 10);
	$("#show-header-nav-button").on("click", function() {
		if( $html.hasClass("header-absolute-on") ) { checkHeaderOverflow() }
		$headerNavigation.show("slide", {direction: "left", easing: animationEasing}, responsiveNavSpeed);
		$focusShadow2.fadeIn(responsiveNavSpeed, animationEasing);
	});

	// Hide on shadow & header tabs click
	$headerNavigation.find("a[href]").add($focusShadow2).on("click", function() {
		if( $html.hasClass("responsive-header-on") ) {
			$headerNavigation.hide("slide", {direction: "left", easing: animationEasing}, responsiveNavSpeed, function() {checkHeaderOverflow()});
			$focusShadow2.fadeOut(responsiveNavSpeed, animationEasing);
		}
	});

	// If responsive header nav overflows window vertically, make header & nav scrollable
	var $headerTabs = $headerNavigation.children("li");
	var headerTabsHeight = 0;
	$headerTabs.each(function() { headerTabsHeight += $(this).innerHeight() });
	function checkHeaderOverflow() {
		if( !isFrameLayout5 && $headerDropmenu.filter(":visible").length == 0 ) {
			var windowHeight = $window.height();
			if( windowHeight < headerTabsHeight && $html.hasClass("responsive-header-on") ) {
				$html.addClass("header-absolute-on");
			} else {
				$html.removeClass("header-absolute-on");
			}
		}
	}

	// Header navigation show drop-menu
	var dropMenuSpeed = parseInt($body.attr("data-drop-menu-speed"), 10);
	$headerTabs.on("mouseenter touchstart", function() {
		var activeDropMenu = $(this).find(".drop-menu");
		activeDropMenu.stop().fadeIn(dropMenuSpeed, animationEasing);
		if( activeDropMenu.length ) {
			var dropOffset = activeDropMenu.offset().top - $window.scrollTop();
			var dropHeight = activeDropMenu.innerHeight();
			var dropOverflow = dropOffset + dropHeight;
			// Drop menu window overflow, make header position absolute
			if( $html.hasClass("responsive-header-on") && !$html.hasClass("header-absolute-on") && activeDropMenu.length ) {
				if( dropOverflow > $window.height() ) {
					$html.addClass("header-absolute-on");
					$html$body.scrollTop(0);
				}
			} else if( isFrameLayout5 ) { // Frame-layout-5 drop menu overflow responsiveness
				if( dropOverflow > $window.height() && !$html.hasClass("layout-5-absolute-on") ) {
					$html.addClass("layout-5-absolute-on");
					$html$body.scrollTop(0);
				}
			}
		}
	});

	// Header navigation hide drop-menu
	$headerTabs.on("mouseleave", function() {
		$(this).children(".drop-menu").stop().fadeOut(dropMenuSpeed, animationEasing, function() {
			checkHeaderOverflow()
		});
		// Frame layout 5 sidebar res
		if( isFrameLayout5 && !$html.hasClass("layout-5-resize-abso") ) {
			$html.removeClass("layout-5-absolute-on");
		}
	});

	// Hide drop menu when drop tab is clicked
	$headerDropmenu.find("a").on("click", function() {
		$headerDropmenu.filter(":visible").fadeOut(100);
		if( $html.hasClass("header-absolute-on") ) {
			$headerDropmenu.hide();
		}
	});

	// Header search
	var searchSpeed = parseInt($body.attr("data-search-fade-speed"), 10);
	var $searchField = $("#search-field");
	var $focusShadow3 = $("#focus-shadow-3");
	var $searchField$focusShadow3 = $searchField.add($focusShadow3);
	var headerBackgroundColor = $.grep($header[0].className.split(" "), function(v, i){ return v.indexOf('background-color-') === 0 }).join();
	var headerBackgroundCode =  headerBackgroundColor.substr(headerBackgroundColor.lastIndexOf('-') + 1);
	var headerSearchActive = false;
	$("#search-button").on("click", function() {
		if( $body.hasClass("transparent-header") ) {
			$header.css("background-color", "#" + headerBackgroundCode);
		}
		$searchField$focusShadow3.fadeIn(searchSpeed, animationEasing, function() {
			$searchField.focus();
		});
		headerSearchActive = true;
	});
	$focusShadow3.on("click", function() {
		$header.css("background-color", "");
		$searchField$focusShadow3.fadeOut(searchSpeed, animationEasing);
		headerSearchActive = false;
	});

	// HEADER CHANGES ON SCROLL
	// switch to alt header logo image if present in filesystem
	var headerLogo = $header.find(".header-logo img");
	var scrollSwitchLogoEnabled = $header.hasClass("scroll-switch-header-logo");
	if( scrollSwitchLogoEnabled && headerLogo.length ) {
		var headerLogoSrc = headerLogo.attr("src"),
			headerLogoNewSrc = headerLogoSrc.split(".")[0] + "-alt." + headerLogoSrc.split(".")[1],
			headerLogoWidth = headerLogo.width,
			headerLogoHeight = headerLogo.height;
	}
	// switch header logo function
	function switchHeaderLogoImg(switchBool) {
		if( scrollSwitchLogoEnabled ) {
			if( switchBool ) {
				headerLogo[0].setAttribute("src", headerLogoNewSrc);
			} else {
				headerLogo[0].setAttribute("src", headerLogoSrc);
			}
		}
	}

	var transparentHeaderScrollOffset = parseInt($body.attr("data-transparent-header-scroll-offset"));
	if( $body.hasClass("header-overlap-on") ) {
		var initHeaderColor = $body.hasClass("init-header-text-light") ? "init-header-text-light" : "init-header-text-dark";
		$window.on("scroll", function() {
			if( $window.scrollTop() > transparentHeaderScrollOffset ) {
				$body.removeClass("transparent-header " + initHeaderColor);
				switchHeaderLogoImg(true);
			} else {
				$body.addClass("transparent-header " + initHeaderColor);
				if( headerSearchActive ) {
					$header.css("background-color", "#" + headerBackgroundCode);
				}
				switchHeaderLogoImg(false);
			}
		});
	}
}





/*-------------------------------------------------------------------
FRAME LAYOUT 5
-------------------------------------------------------------------*/
if( isFrameLayout5 ) {
	var responsiveLayout5WindowWidth = 1200;
	var $focusShadow4 = $("#focus-shadow-4");
	var $layout5SidebarFooter = $("#layout-5-sidebar-footer");
	if( $layout5SidebarFooter.is(":visible") ) { var footerHeight = $layout5SidebarFooter.outerHeight() } else { var footerHeight = 0 }

	// Vertical responsive
	var navPos = $headerNavigation.position().top;
	var navHeight = $headerNavigation.outerHeight();
	function layout5res() {
		// Vertical responsive
		if( ($window.height() - footerHeight) <= (navPos + navHeight) ) {
			$html.addClass("layout-5-absolute-on layout-5-resize-abso");
		} else {
			$html.removeClass("layout-5-absolute-on layout-5-resize-abso");
		}
		// Horizontal responsive
		if( $window.width() <= responsiveLayout5WindowWidth ) {
			$html.addClass("responsive-layout-5");
			$header.add($focusShadow4).hide();
		} else {
			$html.removeClass("responsive-layout-5");
			$header.show();
			$focusShadow4.hide();
		}
	}

	layout5res();
	$window.on("resize", function() { layout5res() });

	// show responsive sidebar nav for frame-layout-5
	$("#layout-5-show-header-button").on("click", function() {
		$header.show("slide", {direction: "left", easing: animationEasing}, responsiveNavSpeed);
		$focusShadow4.fadeIn(responsiveNavSpeed, animationEasing);
		if( $html.hasClass("layout-5-absolute-on") ) {
			$html$body.scrollTop(0);
		}
	});
	// hide responsive sidebar nav for frame-layout-5
	function hideHeaderSidebar() {
		$header.hide("slide", {direction: "left", easing: animationEasing}, responsiveNavSpeed);
		$focusShadow4.fadeOut(responsiveNavSpeed, animationEasing);
	}
	$focusShadow4.on("click", function() {
		hideHeaderSidebar();
	});
	// hide on sidebar tab click
	$headerNavigation.find("a").not("#header-navigation > li:has(.drop-menu) > a").on("click", function() {
		if( $html.hasClass("responsive-layout-5") ) {
			hideHeaderSidebar();
		}
	});
}





/*-------------------------------------------------------------------
SIDEBAR
	Sidebar responsive, scrolling, and tabs functionalities.
-------------------------------------------------------------------*/
if( sidebarExist ) {
	var sidebarNavExists = $sidebarArea.children("#sidebar-nav").length;
	var sidebarNavTabsLength = $("#sidebar-nav").children("li").length;
	var hideSidebarAt = $sidebarArea.attr("data-hide-sidebar");
	var activeTabSelector = $("#sidebar-tab-selector div");
	var focusShadow = $("#focus-shadow");
	var sidebarTransitionSpeed = parseInt($sidebarArea.attr("data-sidebar-transition-speed"), 10);
	var hideSidebarButtonHeight = $("#hide-sidebar-button").innerHeight();
	var sidebarContentContainer = $("#sidebar-content-container");
	var toggleSidebarSpeed = parseInt($sidebarArea.attr("data-toggle-sidebar-speed"), 10);
	var sidebarContentTopJSON = jQuery.parseJSON(sidebarContentContainer.attr("data-content-top"));
	var sidebarResOnContentTop = sidebarContentTopJSON["resOn"];
	var sidebarResOffContentTop = sidebarContentTopJSON["resOff"];

	// RESPONSIVE SIDEBAR
	// Toggle responsive sidebar for frame-layout-1
	function responsiveSidebar() {
		var windowWidth = $window.width();
		if( windowWidth < hideSidebarAt && !$html.hasClass("responsive-sidebar-on") ) {
			$html.addClass("responsive-sidebar-on");
			sidebarContentContainer.css("top", sidebarResOnContentTop + "px");
			$sidebarArea.hide();
		} else if( windowWidth > hideSidebarAt && $html.hasClass("responsive-sidebar-on") ) {
			$html.removeClass("responsive-sidebar-on");
			sidebarContentContainer.css("top", sidebarResOffContentTop + "px");
			$sidebarArea.css("max-width", "").show();
			focusShadow.hide();
			refreshTabsSelector();
			// initiate map if in sidebar
			var hiddenGmapContainer = $sidebarArea;
			hiddenGmapsInit(hiddenGmapContainer);
		}
	}

	if( isFrameLayout1 ) {
		responsiveSidebar();
		$window.on("resize", function() {
			responsiveSidebar()
		});
	} else {
		sidebarContentContainer.css("top", sidebarResOnContentTop + "px");
		$html.addClass("responsive-sidebar-on");
	}

	// hide sidebar if responsive sidebar is showing while resizing
	$window.on("resize", function() {
		if( $sidebarArea.is(":visible") && $html.hasClass("responsive-sidebar-on") ) {
			$sidebarArea.hide();
			focusShadow.hide();
		}
	});

	// Toggle responsive on shadow & button click
	$(".show-sidebar-button").on("click", function() {
		// if sidebar width overflows window width, adjust sidebar
		if( sidebarWidth >= $window.width() ) {
			$sidebarArea.css("max-width", $window.width());
		} else {
			$sidebarArea.css("max-width", "");
		}
		// show sidebar
		$sidebarArea.css("visibility", "visible").show("slide", {direction: "right", easing: animationEasing}, toggleSidebarSpeed, function() {
			var hiddenGmapContainer = $sidebarArea;
			hiddenGmapsInit(hiddenGmapContainer); // initiate map if present
		});
		focusShadow.fadeIn(toggleSidebarSpeed, animationEasing);
		refreshTabsSelector();
	});

	// hide responsive sidebar function
	function hideSidebarArea() {
		if( $html.hasClass("responsive-sidebar-on") ) {
			$sidebarArea.hide("slide", {direction: "right", easing: animationEasing}, toggleSidebarSpeed);
			focusShadow.fadeOut(toggleSidebarSpeed, animationEasing);
		}
	}

	focusShadow.add($("#hide-sidebar-button .fa")).on("click", function() { hideSidebarArea() });

	// sidebar scrollbar
	$window.one("load", function() {
		sidebarContentContainer.mCustomScrollbar({
			autoHideScrollbar: true,
			theme: "light-thin",
			advanced: { updateOnContentResize: true, updateOnBrowserResize: true },
			scrollInertia: 50,
			mouseWheel: { enable: true, preventDefault: true }
		});
	});

	// Select initial sidebar tab
	function refreshTabsSelector() {
		if( sidebarNavExists && sidebarNavTabsLength > 1 ) {
			var initialTab = $("#sidebar-nav .ui-tabs-active");
			activeTabSelector.css({
				"left": initialTab.position().left,
				"width": initialTab.width(),
			});
		}
	}

	// sidebar UI tabs if navigation is present
	if( sidebarNavExists && sidebarNavTabsLength > 1  ) {
		var sidebarTabPos;
		var sidebarTabWidth;
		var sidebarTransition = $sidebarArea.attr("data-sidebar-transition");

		if( sidebarTransition == 1 ) {var transEffect = "slide"; var transShowDirection = "left"; var transHideDirection = "right";}
		else if( sidebarTransition == 2 ) {var transEffect = "slide"; var transShowDirection = "right"; var transHideDirection = "left";}
		else if( sidebarTransition == 3 ) {var transEffect = "slide"; var transShowDirection = "up"; var transHideDirection = "down";}
		else if( sidebarTransition == 4 ) {var transEffect = "slide"; var transShowDirection = "down"; var transHideDirection = "up";}
		else if( sidebarTransition == 5 ) {var transEffect = "fade"; var transShowDirection = ""; var transHideDirection = "";}
		else if( sidebarTransition == 6 ) {var transEffect = "bounce"; var transShowDirection = "left"; var transHideDirection = "right";}
		else if( sidebarTransition == 7 ) {var transEffect = "bounce"; var transShowDirection = "up"; var transHideDirection = "down";}
		else if( sidebarTransition == 8 ) {var transEffect = "blind"; var transShowDirection = "up"; var transHideDirection = "down";}

		// apply tabs and transition
		$sidebarArea.tabs({
			event: "click",
			activate : function(event, ui) {
				var newTab = ui.newTab;
				var newPanel = ui.newPanel;
				sidebarTabPos = $(newTab).position().left;
				sidebarTabWidth = $(newTab).width();
				activeTabSelector.stop().animate({
					"left": sidebarTabPos,
					"width": sidebarTabWidth
				}, sidebarTransitionSpeed, animationEasing);
				hiddenGmapsInit(newPanel);
			},
			beforeActivate: function() {
				sidebarContentContainer.mCustomScrollbar("scrollTo","top",{
					scrollInertia: 0,
					timeout: 60
				});
			},
			show: {
				effect: transEffect,
				direction: transShowDirection,
				duration: sidebarTransitionSpeed,
				easing: animationEasing
			},
			hide: {
				effect: transEffect,
				direction: transHideDirection,
				duration: sidebarTransitionSpeed,
				easing: animationEasing
			}
		});

		refreshTabsSelector();
	}

} else {
	$(".show-sidebar-button").remove();
}





/*-------------------------------------------------------------------
ACTIVE TAB
	Activates the corresponding header tab based on the current page
-------------------------------------------------------------------*/
var headerAnchors = $headerNavigation.find("a");
function activeTabSync() {
	if( headerAnchors.length ) {
		var activePage = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
		headerAnchors.filter(".nav-active-tab").removeClass("nav-active-tab");
		headerAnchors.filter("[href^='"+ activePage +"']").addClass("nav-active-tab");
		// if active tab is in drop menu, activate main tab
		var dropMenuParent = $headerNavigation.find(".nav-active-tab").parents(".drop-menu");
		if( dropMenuParent.length ) {
			dropMenuParent.prev("a").addClass("nav-active-tab");
		}
		// if activePage is empty, activate index tab
		if( activePage == "" ) {
			$headerNavigation.find("a[href*='index.html']").addClass("nav-active-tab");
		}
	}
}
activeTabSync();





/*-------------------------------------------------------------------
SMOOTH SCROLL
	Scroll to specific sections within the page
-------------------------------------------------------------------*/
if( $doc.find("a[data-scroll]").length ) {
	var smoothScroll = new SmoothScroll("a[data-scroll]", {
		updateURL: false,
		popstate: false,
		speed: 800,
		offset: function() {
			if( !$body.hasClass("removed-header-area") ) {
				return $header.height();
			} else {
				return 0;
			}
		}
	});
}





/*-------------------------------------------------------------------
AJAX FUNCTIONALITY
	Loads only the new content; skipping the already loaded
	files.
-------------------------------------------------------------------*/
if( !$body.hasClass("ajax-off") && Modernizr.history && ~["http:", "https:"].indexOf(location.protocol) ) {
	var pagesFadeSpeed = 500;
	SmartAjax_load("js/plugins-js/smartajax/", function() {
		var $pagesContainer = $("#pages-container");
		var $loadingOverlay = $("#pages-load-area .loading-overlay");
		var scrollSpeed = parseInt($body.attr("data-scroll-top-speed"), 10);
		var animComplete;
		SmartAjax.isDebug = false;
		SmartAjax.setOptions({
			cache: false, /* NOTICE: Setting cache to 'true' may result in a bug with Internet Explorer where the latest HTML content is not retrieved. */
			history: true,
			containers: [{selector: "#pages-container"}],
			before: function() {
				$("a[data-ajax-page]").on("click.ajaxUrlOff", function(e) { e.preventDefault() }); // prevent ajax link double click bug
				animComplete = false;
				if( sidebarExist ) { hideSidebarArea() } // hide sidebear on AJAX page switch
				$html$body.animate({scrollTop: 0}, scrollSpeed, function() {
					if( animComplete == false ) {
						$pagesContainer.fadeTo(pagesFadeSpeed, 0, animationEasing, function() {
							$loadingOverlay.removeClass("pause-css-animation").show();
							$pagesContainer.css({"height":"1500px", "overflow":"hidden"});
							SmartAjax.proceed();
						});
					}
					animComplete = true;
				});
			},
			success: function() {
				$("a[data-ajax-page]").off("click.ajaxUrlOff"); // remove event that prevents link double click.
				var gcRemovedElementsArea = $pagesContainer;
				instancesGarbageCollector(gcRemovedElementsArea);
				SmartAjax.proceed();
				activeTabSync();
				intervalsGarbageCollector();
				refresh();
			},
			done: function( url, replacedContainers, $data ) {
				// switch page background color
				var currentPageBG = jQuery.parseJSON($pagesLoadArea.attr("data-pb-co-current"))["background-color"];
				var newPageBG = jQuery.parseJSON($($data).find("#pages-load-area").attr("data-pb-co-current"))["background-color"];
				if( currentPageBG !== newPageBG ) {
					$pagesLoadArea.addClass("background-color-"+ newPageBG).removeClass("background-color-"+ currentPageBG).attr("data-pb-co-current", '{"background-color":"'+ newPageBG +'"}');
				}
				// wait for images and hide overlay
				$pagesContainer.waitForImages(true).done(function() {
					$pagesContainer.css({"height":"", "overflow":"visible"});
					$loadingOverlay.hide().addClass("pause-css-animation");
					$pagesContainer.fadeTo(pagesFadeSpeed, 1, animationEasing);
				});
			},
			error: function(url, status) {
				if( status == "404" ) {
					window.location.replace("404.php");
				} else {
					alert("An error occured while loading the page. (ERROR CODE: "+ status +")");
				}
			}
		});
		SmartAjax.bind("a[data-ajax-page]");
	}, true);

	$.getScript("js/plugins-js/jquery.waitforimages.min.js");
}

$.ajaxSetup({cache: true}); // Enable AJAX cache globally
