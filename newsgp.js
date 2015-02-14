var overlay = null;
var overlayOwner = null;

var newsgp = {
    pageLoader: {
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
    },

    navigation: {
        reset: function (panel) {
            this._panel = panel;
        },
        next: function () {
            return this._panel.find("a:contains(Next)").attr("href");
        },
        hasNext: function () {
            return this._panel.find("a:contains(Next)").length > 0;
        },
        _panel: null        
    },

    loaders: {
        popup: {
            refCounter: 0,
            element: $('<div class="popup"><center><div><i class="fa fa-spinner fa-pulse" style="font-size: 40px; font-weight: 100; color: rgb(70, 86, 112);"></i></div></center></div>').appendTo("body"),
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
            element: $('<div style="min-height: 40px; --webkit-vertical-align: middle;"><center><div style="display: inline-block;"><i class="fa fa-spinner fa-pulse"style="font-size: 40px; font-weight: 100;"></i></div></center></div>').insertAfter(".pagination:first"),
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
    },

    giveaway: {
        element: $('<div class="popup"><p class="popup__heading"></p><center><div></div><p class="popup__actions"><div></div></p></center></div>').appendTo("body"),
        popup: null,
        show: function (heading, link, form) {
            this.element.find(".popup__heading").text(heading);
            link.appendTo(this.element.find("center > div:first"));
            form.appendTo(this.element.find("center > div:last"));
            this.popup = this.element.bPopup({
                onClose: function () {
                    this.element.find("center > div").empty();
                }
            });
        },
        hide: function () {
            this.popup.close();
        }
    }
};

function Request(href, callback, fallback, loader) {
    this.href = href;
    this.callback = callback;
    this.fallback = fallback;
    this.loader = loader;
    newsgp.pageLoader.add(this);
}

function tryLoadPage() {
    if (newsgp.navigation.hasNext()) {
        new Request(newsgp.navigation.next(), pageLoaded, function (href) { }, newsgp.loaders.inline);
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
    newsgp.giveaway.show($(link).closest(".giveaway__row-outer-wrap").find(".giveaway__heading__name").text(),
        $(link).clone().unbind('click'),
        form);
    /*
    $(link).after("<div id='newSGPOverlay'></div>");
    overlay = $("#newSGPOverlay");
    overlay.append(form);
    overlay.css({ "position": "absolute", "opacity": "0" });
    bounds = boundsOf(link);
    offs = overlay.offset();
    offs.left = bounds.left + (bounds.width - overlay.width()) / 2;
    overlay.offset(offs);
    overlay.animate({ 'top': bounds.top + bounds.height + 5, 'opacity': '1' }, 200);
    overlayOwner = link;*/
}

function tryLoadGiveaway(link) {
    if (link != overlayOwner) {
        new Request(link.href, function (href, obj) { giveawayLoaded(href, obj, link) }, function (href) { }, newsgp.loaders.no);
    }
    if(overlay !== null) {
        overlay.remove();
        overlay = null;
        overlayOwner = null;
    }
}

function processPage(obj, href) {
    $(obj.find(".giveaway__heading__name, .giveaway__columns, .giveaway__links, .giveaway__row-inner-wrap > .global__image-outer-wrap.global__image-outer-wrap--avatar-small")).hide();
    $(obj.find(".giveaway__heading__thin")).hide();
    $(obj.find(".fa.fa-steam")).css({"position": "relative", "top": "-15px", "left": "20px"});
    $(obj.find(".giveaway__icon.giveaway__hide.trigger-popup.fa.fa-eye-slash")).css({"position": "relative", "top": "15px"});
    $(obj.find(".giveaway__row-outer-wrap")).css("display", "inline-block").attr("data-loaded-from", href);
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
    if($(".giveaway__row-outer-wrap[data-loaded-from='" + href + "']").length === 0)
    {
        //add giveaways
    	$(".giveaway__row-outer-wrap:last").after(obj.find(".giveaway__row-outer-wrap"));
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
    newsgp.navigation.reset(obj.find(".pagination:first"));
    if (reloaded && newsgp.navigation.hasNext() && ($(".giveaway__row-outer-wrap[data-loaded-from='" + newsgp.navigation.next() + "']").length > 0)) {
        tryLoadPage();
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
    new Request(href, pageLoaded, function (href) { $(".giveaway__row-outer-wrap[data-loaded-from='" + href + "']").remove(); }, newsgp.loaders.popup);
}

(function (window) {
    if (window.self != window.top) {
        return;
    }
    for (var ss = 0; ss < document.styleSheets.length; ++ss) {
        for(var cr = 0; cr < document.styleSheets[ss].length; ++cr) {
            if (document.styleSheets[ss].cssRules[cr].selectorText.toLowerCase() == ".is-faded") {
                document.styleSheets[ss].cssRules[cr].style.opacity = '0.2';
            }
        }
    }
    $(".giveaway__hide").unbind('click');
    processPage($, window.location.href);
    $(".page__inner-wrap:first").css("maxWidth", "100%");
    newsgp.navigation.reset($(".pagination").hide());
    $(window).bind("scroll", function() {
        if( isElementVisible($(".widget-container.widget-container--margin-top:first")[0]) ) {
            tryLoadPage();
        }
    });
    $("")
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
                   $(".popup__actions > .b-close").trigger("click");
                   reloadPages(window.location.href);
               }
             });
        return false;
    });*/
    tryLoadPage();
})(window);