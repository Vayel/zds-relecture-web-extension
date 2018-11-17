var Widget = function(section, id, wrapper) {
    // We use this syntax because ids may contain numbers
    var widget = wrapper.querySelector("[id='" + id + "']");
    if (widget) {
        return;
    }

    widget = document.createElement("div");
    widget.id = id;
    widget.className = "review-widget";
    widget.style.position = "fixed";
    widget.style.top = "30px";
    widget.style.width = "45%";

    function isSectionTitle(el) {
        return el.tagName == "H2" && el.className.split(" ").indexOf("subtitle") == -1;
    }

    function findNextSection(section) {
        var cur = section;
        while ((cur = cur.nextSibling) && !isSectionTitle(cur)) {}
        return cur;
    }

    function getAbsolutePos(element, prop) {
        var bodyRect = document.body.getBoundingClientRect(),
            elemRect = element.getBoundingClientRect();
        return elemRect[prop] - bodyRect.top;
    }

    var nextSection = findNextSection(section);
    var topSection = getAbsolutePos(section, "bottom");
    var topNextSection;
    if (nextSection) {
        topNextSection = getAbsolutePos(nextSection, "top");
    } else {
        topNextSection = Infinity;
    }

    function updatePosition() {
        var scrollTop = (((t = document.documentElement) || (t = document.body.parentNode))
                         && typeof t.scrollTop == 'number' ? t : document.body).scrollTop;
        
        var relYCur = topSection - scrollTop,
            relYNext = topNextSection - scrollTop,
            height = widget.getBoundingClientRect().height,
            yMargin = 25,
            totalHeight = height + 2*yMargin;

        if (relYCur > 0 && relYCur < window.innerHeight) {
            // The section title appears on the screen
            widget.style.visibility = "visible";
            widget.style.top = Math.max(relYCur, yMargin) + "px";
        } else if (relYCur < 0 && (relYNext - totalHeight) > 0) {
            // We are between the section title and the next section title
            // and we have enough space to display the whole widget (with the
            // margins).
            widget.style.visibility = "visible";
            widget.style.top = yMargin + "px";
            widget.style.opacity = "1";
        } else if (relYNext < window.innerHeight && relYNext > 0) {
            // We are between the section title and the next section title
            // but we don't have enough space to display the widget so we
            // reduce the opacity.
            widget.style.top = (relYNext - (height + yMargin)) + "px";
            widget.style.opacity = Math.pow(relYNext / window.innerHeight, 2).toString();
            widget.style.visibility = "visible";
        } else {
            widget.style.visibility = "hidden";
        }
    }

    document.addEventListener("scroll", updatePosition);

    wrapper.appendChild(widget);
    updatePosition();
    return widget;
};