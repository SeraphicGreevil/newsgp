var navigationPanel = null;
var overlay = null;
var overlayOwner = null;

var image = {
    'loadinggif': 'data:image/gif;base64,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'
}

var newsgp = {
    navigationPanel: {

        },
    loaders: {
        popup: {
            refCounter: 0,
            element: $('<div class="popup"><p class="popup__heading"></p><center><div><img src="' + image["loadinggif"] + '"></div></center></div>').appendTo("body"),
            popup: null,
            show: function () {
                if (this.refCounter == 0) {
                    this.popup = this.element.bPopup();
                }
                this.refCounter++;
            },
            hide: function () {
                this.refCounter--;
                if (this.refCounter == 0) {
                    this.popup.close();
                }
            },
            visible: function () {
                return this.refCounter > 0;
            }
        },

        inline: {
            refCounter: 0,
            element: $('<div style="min-height: 40px; --webkit-vertical-align: middle;"><center><div style="display: inline-block;"><img src="' + image["loadinggif"] + '"></div></center></div>').insertAfter(".pagination:first"),
            show: function () {
                if (this.refCounter == 0) {
                    this.element.show();
                }
                this.refCounter++;
            },
            hide: function () {
                this.refCounter--;
                if (this.refCounter == 0) {
                    this.element.hide();
                }
            },
            visible: function () {
                return this.refCounter > 0;
            }
        },

        no: {
            show: function () { },
            hide: function () { },
            visible: function () { return false; }
        }
    }
};

function Request(href, callback, fallback, loader) {
    this.href = href;
    this.callback = callback;
    this.fallback = fallback;
    this.loader = loader;
}

var pageLoader = {
    add: function (request) {
        if (!this._contains(request)) {
            this._queue.push(request);
        }
        if (this._current == null) {
            this._run();
        }
    },
    _current: null,
    _queue: [],
    _contains: function (request) {
        if ((this._current !== null) && (this._current.href == request.href)) {
            return true;
        }
        for (var i = 0; i < this._queue.length; ++i) {
            if (this._queue[i].href == request.href) {
                return true;
            }
        }
        return false;
    },
    _run: function () {
        var self = this;
        self._current = self._queue.shift();
        self._current.loader.show();
        $.get(self._current.href, function (data) {
            if ((data === null) || (data == '')) {
                self._current.fallback(self._current.href);
            } else {
                self._current.callback(self._current.href, $(data));
            }
            self._current.loader.hide();
            self._current = null;
            if (self._queue.length > 0) {
                self._run();
            }
        });
    }
};

function tryLoadPage() {
    var nextLink = $(navigationPanel).find("a:contains(Next)");
    if (nextLink.length > 0) {
        pageLoader.add(new Request(nextLink[0].href, pageLoaded, function (href) { }, newsgp.loaders.inline));
    }
}

function giveawayLoaded(href, obj, link) {
    form = null;
    if(obj.find(".sidebar__error.is-disabled").length > 0) {
    	form = obj.find(".sidebar__error.is-disabled")[0];
    }
    else {
        form = obj.find(".sidebar:first > form");
        $(form).find(".sidebar__entry-insert, .sidebar__entry-delete").click(function() {
            var e = $(this);
            e.addClass("is-hidden");
            e.closest("form").find(".sidebar__entry-loading").removeClass("is-hidden");
            e.closest("form").find("input[name=do]").val(e.attr("data-do"));
            $.ajax({
                url:ajax_url,
                type:"POST",
                dataType:"json",
                data:e.closest("form").serialize(),
                success:function(t) {
                    e.closest("form").find(".sidebar__entry-loading").addClass("is-hidden");
                    if(t.type==="success") {
                        if(e.hasClass("sidebar__entry-insert")) {
                            e.closest("form").find(".sidebar__entry-delete").removeClass("is-hidden");
                            $(link).parent().addClass("is-faded");
                        } else if(e.hasClass("sidebar__entry-delete")) {
                            e.closest("form").find(".sidebar__entry-insert").removeClass("is-hidden");
                            $(link).parent().removeClass("is-faded");
                        }
                    }
                    else if(t.type==="error") {
                        if(typeof t.link!=="undefined"&&t.link!==false) {
                            e.closest("form").html('<a href="'+t.link+'" class="sidebar__error"><i class="fa fa-exclamation-circle"></i> '+t.msg+"</a>");
                        } else {
                            e.closest("form").html('<div class="sidebar__error is-disabled"><i class="fa fa-exclamation-circle"></i> '+t.msg+"</div>");
                        }
                    }
                    if(typeof t.entry_count!=="undefined"&&t.entry_count!==false) {
                        $(".live__entry-count").text(t.entry_count);
                    }
                    $(".nav__points").text(t.points);
                }
            });
        });
    }
    $(link).after("<div id='newSGPOverlay'></div>");
    overlay = $("#newSGPOverlay");
    overlay.append(form);
    overlay.css({ "position": "absolute", "opacity": "0" });
    bounds = boundsOf(link);
    offs = overlay.offset();
    offs.left = bounds.left + (bounds.width - overlay.width()) / 2;
    overlay.offset(offs);
    overlay.animate({ 'top': bounds.top + bounds.height + 5, 'opacity': '1' }, 200);
    overlayOwner = link;
}

function tryLoadGiveaway(link) {
    if (link != overlayOwner) {
        pageLoader.add(link.href, function (href, obj) { giveawayLoaded(href, obj, link) }, function (href) { }, newsgp.loaders.no);
    }
    if(overlay !== null) {
        overlay.remove();
        overlay = null;
        overlayOwner = null;
    }
}

function processPage(obj, href) {
    $(obj.find(".giveaway__heading__name, .giveaway__columns, .giveaway__links, .giveaway__row-inner-wrap > .global__image-outer-wrap.global__image-outer-wrap--avatar-small")).css("display", "none");
    $(obj.find(".giveaway__heading__thin")).css("display", "none");
    $(obj.find(".fa.fa-steam")).css({"position": "relative", "top": "-15px", "left": "20px"});
    $(obj.find(".giveaway__icon.giveaway__hide.trigger-popup.fa.fa-eye-slash")).css({"position": "relative", "top": "15px"});
    $(obj.find(".giveaway__row-outer-wrap")).css("display", "inline-block").attr("data-loaded-from", href);
    $(obj.find(".giveaway__row-inner-wrap.is-faded")).css("opacity", "0.2");
    //hide giveaways without popup
    $(obj.find(".giveaway__hide")).removeClass("trigger-popup").click( function() {
        elem = $(this);
        $(".popup--hide-games input[name=game_id]").val(elem.attr("data-game-id"));
		$.ajax({
               type: "POST",
               url: window.location.href,
               data: $(".popup--hide-games > form").serialize(), // serializes the form's elements.
               success: function(data) {
                   reloadPages(elem.closest(".giveaway__row-outer-wrap").attr("data-loaded-from"));
               }
             });
    });
    //make popup window for giveaway hiding work properly
    /*$(obj.find(".giveaway__hide")).click( function() {
        $(".popup--hide-games input[name=game_id]").val($(this).attr("data-game-id"));
		$(".popup--hide-games .popup__heading__bold").text($(this).closest("h2").find(".giveaway__heading__name").text());
    });
    $(obj.find(".trigger-popup")).click(function() {
        $("."+$(this).attr("data-popup")).bPopup({opacity:0.85,fadeSpeed:200,followSpeed:500,modalColor:"#3c424d"});
    });*/
    $(obj.find(".global__image-outer-wrap--game-medium")).click(function() {
        tryLoadGiveaway(this);
        return false;
    });
    return obj;
}

function pageLoaded(href, obj) {
    var reloaded = false;
    obj = processPage(obj, href);
    if($.find(".giveaway__row-outer-wrap[data-loaded-from='" + href + "']").length === 0)
    {
        //add giveaways
    	$($.find(".giveaway__row-outer-wrap:last")[0]).after(obj.find(".giveaway__row-outer-wrap"));
    }
    else
    {
        reloaded = true;
        //remove current giveaways
        $(".giveaway__row-outer-wrap[data-loaded-from='" + href + "']:last").after("<div id='newSGPReplace'>");
        $(".giveaway__row-outer-wrap[data-loaded-from='" + href + "']").remove();
        //add giveaways
        $("#newSGPReplace").replaceWith(obj.find(".giveaway__row-outer-wrap"));
    }    
    navigationPanel = obj.find(".pagination:first")[0];
    if(reloaded) {
        var nextLink = $(navigationPanel).find("a:contains(Next)");
    	if(nextLink.length > 0) {
            if($.find(".giveaway__row-outer-wrap[data-loaded-from='" + nextLink[0].href + "']").length > 0) {
                tryLoadPage();
            }
        }
    }
}

function boundsOf(obj) {
    if (obj === null) {
        return null;
    }
    var bounds = {
        left: obj.offsetLeft,
        top: obj.offsetTop,
        width: obj.offsetWidth,
        height: obj.offsetHeight
    };
    while (obj.offsetParent) {
        obj = obj.offsetParent;
        bounds.left += obj.offsetLeft;
        bounds.top += obj.offsetTop;
    }
    return bounds;
}

function isElementVisible(obj) {
    if (obj === null) {
        return;
    }
    var bounds = boundsOf(obj);
    return ((bounds.top + bounds.height / 4) >= window.pageYOffset) && (bounds.top <= (window.pageYOffset + window.innerHeight));
}

function reloadPages(startFrom) {
    href = startFrom;
    prevElem = $(".giveaway__row-outer-wrap[data-loaded-from='" + startFrom + "']:first").prev(".giveaway__row-outer-wrap");
    if( prevElem.length !== 0 ) {
        href = prevElem.attr("data-loaded-from");
    }
    pageLoader.add(href, pageLoaded, function (href) { $(".giveaway__row-outer-wrap[data-loaded-from='" + href + "']").remove(); }, newsgp.loaders.popup);
}

(function (window) {
    if (window.self != window.top) {
        return;
    }
    $(".giveaway__hide").unbind('click');
    processPage($, window.location.href);
    $($.find(".page__inner-wrap:first")).css("maxWidth", "100%");
    navigationPanel = $.find(".pagination")[0];
    $(navigationPanel).hide();
    $(window).bind("scroll", function() {
        if( isElementVisible($.find(".widget-container.widget-container--margin-top:first")[0]) ) {
            tryLoadPage();
        }
    });
    //hide giveaways without page reloading
    /*$(".js__submit-form").unbind('click').click(function() {
        if($(this).hasClass("js__edit-giveaway")) {
            $(this).closest("form").find("input[name=next_step]").val(1)
        }
        $.ajax({
               type: "POST",
               url: window.location.href,
               data: $(this).closest("form").serialize(), // serializes the form's elements.
               success: function(data) {
                   $($.find(".popup__actions > .b-close")).trigger("click");
                   reloadPages(window.location.href);
               }
             });
        return false;
    });*/
    tryLoadPage();
})(window);