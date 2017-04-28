/*global jQuery, unsafeWindow, GM_getValue, GM_setValue, GM_setClipboard, GM_openInTab, GM_info, GM_listValues, GM_getResourceURL, window, document, setInterval */

(function () {
    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- GLOBAL FUNCTIONS ----------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------
    function setValue(variable, val) {
        GM_setValue(variable, val);
    }

    function clipboardCopy(variable) {
        GM_setClipboard(variable, 'text');
    }

    function getValue(variable) {
        return GM_getValue(variable, false);
    }

    function programVariables() {
        return GM_listValues();
    }

    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- Build container for toolbox ----------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------
    var QAtoolbox = {
            init: function () {
                this.createElements();
                this.toolbarStyles();
                this.cacheDOM();
                this.attachTools();
            },
            // ----------------------------------------
            // tier 1 functions
            // ----------------------------------------
            createElements: function () {
                QAtoolbox.config = {
                    $legendContainer: jQuery('<div>').attr({
                        id: 'legendContainer'
                    }),
                    $toolbarContainer: jQuery('<div>').attr({
                        id: 'toolboxContainer'
                    }),
                    // ----------------------------------------
                    // Toolbar Resources
                    // ----------------------------------------
                    $toolbarStyles: jQuery('<style>').attr({
                        id: 'qa_toolbox',
                        type: 'text/css'
                    }),
                };
            },
            toolbarStyles: function () {
                QAtoolbox.config.$toolbarStyles
                    // general toolbox styles
                    .append('.toolBox { text-align: center; position: relative; border: 1px solid black; z-index: 50000; }')
                    .append('#toolboxContainer { background: linear-gradient(to bottom, #70e1f5, #ffd194); right: 0; bottom: 20%; font-family: "Montserrat"; font-size: 12px; line-height: 20px; position: fixed; text-transform: lowercase; width: 140px; z-index: 99999999; }')
                    .append('.toolsPanel { display: none; }')
                    // panel title styles
                    .append('.panelTitle { border-bottom: 1px solid #000000; color: white; cursor: pointer; text-transform: lowercase; }')
                    // default highlight style
                    .append('#toolboxContainer .highlight { background: linear-gradient(to right, #83a4d4 , #b6fbff) !important; color: #ffffff;}')
                    // even button styles
                    .append('.evenEDObutts {background: linear-gradient(to left, #457fca , #5691c8);}')
                    // off button styles
                    .append('.oddEDObutts {background: linear-gradient(to left, #6190E8 , #A7BFE8);}')
                    // default button styles
                    .append('.myEDOBut { border: 2px solid rgb(0,0,0); border-radius: 5px; color: #ffffff !important; cursor: pointer; font-family: "Montserrat"; font-size: 12px; top: 15%; padding: 4px 0px; position: relative; text-transform: lowercase; width: 135px; }')
                    .append('.myEDOBut.notWorking { background: purple; }')
                    .append('.myEDOBut.offButt { width: 90%; height: 50px; margin: 0px; }')
                    .append('.myEDOBut[disabled] { border: 2px outset ButtonFace; background: #ddd; background-color: #ddd; color: grey !important; cursor: not-allowed; }')
                    .append('.offButt { background: linear-gradient(to left, #085078 , #85D8CE) !important; }')
                    .append('.myEDOBut:hover { background: linear-gradient(to left, #141E30 , #243B55) !important; border: 2px solid rgb(0,0,0); }')
                    // legend styles
                    .append('.legendTitle { font-weight: bold; font-size: 18px; }')
                    .append('.legendContent { padding: 5px; margin: 5px; }')
                    .append('.legendList { list-style-type: none; margin: 10px 0px; padding: 0px; }')
                    .append('#legendContainer { font-family: "Montserrat"; position: fixed; bottom: 20px; width: 260px; z-index: 99999999; }')
                    .append('.tbLegend { background: white; border: 1px solid black; display: none; text-align: center; padding: 5px; margin: 5px 0; }')
                    .append('.hint { font-style: italic; line-height: 10px; margin: 10px 0 0 0; }')
                    // toggle style
                    .append('.toggleTool { background: linear-gradient(to right, rgb(236, 233, 230) , rgb(255, 255, 255)); border-top: 1px solid #999999; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } '); // end
            },
            cacheDOM: function () {
                this.head = jQuery('head');
                this.body = jQuery('body');
                this.phoneWrapper = jQuery('body .phone-wrapper');
            },
            attachTools: function () {
                this.head.append(QAtoolbox.config.$toolbarStyles);
                this.head.append(QAtoolbox.config.$myFont);
                this.head.append(QAtoolbox.config.$fontAwe);
                this.body.before(QAtoolbox.config.$toolbarContainer);
                this.body.before(QAtoolbox.config.$legendContainer);
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            styleTools: function ($toolPanel) {
                $toolPanel.children('.myEDOBut:even').addClass('evenEDObutts');
                $toolPanel.children('.myEDOBut:odd').addClass('oddEDObutts');
            },
        },
        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- H Tags ----------------------------------------
        // ------------------------------------------------------------------------------------------------------------------------
        hTags = {
            init: function () {
                this.createElements();
                this.cacheDOM();
                this.buildTool();
                this.displayData();
                this.tagDetails();
                this.addStyles();
                this.bindEvents();
                // return finished tool
                return this.returnTool();
            },
            // ----------------------------------------
            // tier 1 functions
            // ----------------------------------------
            createElements: function () {
                hTags.config = {
                    $hTagsContainer: jQuery('<div>').attr({
                        id: 'hTagsContainer'
                    }),
                    $hTagsTitle: jQuery('<label>').attr({
                        class: 'tbLabel'
                    }).text('h tags'),
                    $hTags: jQuery('<div>').attr({
                        title: 'Click to show hTags on page',
                        id: 'hTags'
                    }),
                    hTagsTotal: {
                        h1: 0,
                        h2: 0,
                        h3: 0,
                        h4: 0
                    },
                    hTags: {},
                    $removeBut: jQuery('<input>').attr({
                        type: 'button',
                        class: 'myEDOBut removeDiv',
                        value: 'REMOVE'
                    }).css({
                        background: 'inherit'
                    }),
                    $hTagDisplay: jQuery('<div>').attr({
                        class: 'hTagDisplay'
                    }),
                    $hTagDisplayContainer: jQuery('<div>').attr({
                        id: 'hTagContainer'
                    }),
                };
            },
            cacheDOM: function () {
                var key, total, tags;
                for (key in hTags.config.hTagsTotal) {
                    tags = jQuery(key);
                    hTags.config.hTags[key] = tags; // save matches for later
                    total = tags.length;
                    hTags.config.hTagsTotal[key] = total;
                }
                this.metaTags = jQuery('head').find('meta');
                this.$toolbarStyles = jQuery('#qa_toolbox');
                this.$body = jQuery('body');
            },
            buildTool: function () {
                hTags.config.$hTagsContainer.append(hTags.config.$hTagsTitle);
                hTags.config.$hTagsContainer.append(hTags.config.$hTags);

                hTags.config.$hTagDisplayContainer.append(hTags.config.$hTagDisplay);
                hTags.config.$hTagDisplayContainer.append(hTags.config.$removeBut);
            },
            displayData: function () {
                var html = '',
                    key,
                    $hContainer,
                    $hCount = jQuery('<span>').attr({
                        class: 'count'
                    });

                for (key in hTags.config.hTagsTotal) {
                    $hContainer = jQuery('<div>').attr({
                        class: 'hCount',
                        id: key + 'Count'
                    }).text(key + ' : ');

                    $hCount.text(hTags.config.hTagsTotal[key]);

                    this.highlightZero($hContainer, $hCount);

                    $hContainer.append($hCount);

                    html += $hContainer.prop('outerHTML');
                }

                hTags.config.$hTags.html(html);
            },
            tagDetails: function () {
                var key, a, c = 0,
                    metaTags = '',
                    metaLength = this.metaTags.length,
                    length, html = '',
                    metaTag = '',
                    $selectMe = jQuery('#content').find('.contentWrapper').find('meta, p:visible, h1:visible, h2:visible, h3:visible, h4:visible, li:visible'),
                    x = 0,
                    mylength = $selectMe.length,
                    newText = '';

                $selectMe.css({
                    background: '#ef32d9'
                });

                // ---------------------------------------- add h tags to pop up
                for (key in hTags.config.hTags) {
                    length = hTags.config.hTags[key].length;
                    a = 0;
                    html += '- ' + key + ' -<br>';
                    for (a; a < length; a += 1) {
                        html += jQuery.trim(jQuery(hTags.config.hTags[key][a]).html()) + '<br>';
                    }
                }
                hTags.config.$hTagDisplay.html(html);

                // ---------------------------------------- add meta tags to pop up
                for (c; c < metaLength; c += 1) {
                    metaTag = this.metaTags[c].outerHTML;
                    metaTags += metaTag + '<br>';
                }
                hTags.config.$hTagDisplay.append('<hr>');
                hTags.config.$hTagDisplay.append(metaTags);

                // ---------------------------------------- add SEO text to pop up
                for (x; x < mylength; x += 1) {
                    if (jQuery.trim($selectMe[x].innerText) === '') {
                        continue;
                    }
                    newText = newText + '<' + $selectMe[x].nodeName.toLowerCase() + '>' + jQuery.trim($selectMe[x].innerText) + '</' + $selectMe[x].nodeName.toLowerCase() + '><br>';
                }
                hTags.config.$hTagDisplay.append('<hr>');
                hTags.config.$hTagDisplay.append(newText);
            },
            addStyles: function () {
                // apply module styles to main tool bar style tag
                this.$toolbarStyles
                    // styles of colored overlay placed on images
                    .append('.hCount { display: block; }')
                    .append('#hTags { cursor: pointer; background: white; border-top: 1px solid #000000; }')
                    .append('.count { font-weight: bold; }')
                    .append('.zeroTotal { background: linear-gradient(to right, #F2994A , #F2C94C); }')
                    .append('.hTagDisplay { padding: 10px; position: absolute; top: 25%; left: 25%; width: 50%; height: 50%; overflow: auto; background: rgb(180, 180, 180);}')
                    .append('#hTagContainer { background: rgba(0, 0, 0, 0.75); color: rgb(0, 0, 0); z-index: 99999; position: fixed; top: 0%; left: 0%; width: 100%; height: 100%; font-size: 16px; }')
                    .append('.removeDiv { position: fixed; top: 15%; left: 25%; height: 5%; width: 50%;}'); // end of addStyles
            },
            bindEvents: function () {
                hTags.config.$hTagsContainer.on('click', this.showDetails.bind(this));
                hTags.config.$removeBut.on('click', this.removeDisplay);

                // add change to text area function
                hTags.config.$hTagDisplay.on('click', this.changeToTextarea.bind(this));
            },
            returnTool: function () {
                var panel = hTags.config.$hTagsContainer;
                return panel;
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            highlightZero: function ($hContainer, hCount) {
                var count = jQuery(hCount).text();

                if (count === '0') {
                    $hContainer.attr({
                        class: 'zeroTotal'
                    });
                }
            },
            showDetails: function () {
                this.$body.append(hTags.config.$hTagDisplayContainer);
            },
            removeDisplay: function () {
                // remove display container
                hTags.config.$hTagDisplayContainer.detach();
            },
            changeToTextarea: function (event) {
                var $this = jQuery(event.currentTarget),
                    input = hTags.config.$hTagDisplay.html(),
                    $seoTextArea = jQuery('<textarea>').attr({
                        class: 'hTagDisplay'
                    });

                // replace <br> with txt area line break
                input = input.replace(/<br>/g, '\n');
                input = input.replace(/<hr>/g, '-----------------------------\n');

                $seoTextArea.html(input);
                jQuery($this).replaceWith($seoTextArea);
                $seoTextArea.focus();
                $seoTextArea.blur(this.revertDiv.bind(this));
            },
            // ----------------------------------------
            // tier 3 functions
            // ----------------------------------------
            revertDiv: function (event) {
                var $this = jQuery(event.target),
                    $thisText = jQuery(event.target).text(),
                    $replacementArea = hTags.config.$hTagDisplay;

                // replace <br> with txt area line break
                $thisText = $thisText.replace(/\n/g, '<br>');
                $thisText = $thisText.replace(/-----------------------------/g, '<hr>');

                $replacementArea.html($thisText);
                jQuery($this).replaceWith($replacementArea);
                $replacementArea.click(this.changeToTextarea.bind(this));
            }
        },
        // ------------------------------------------------------------------------------------------------------------------------
        // ---------------------------------------- Page Information Panel ----------------------------------------
        // ------------------------------------------------------------------------------------------------------------------------
        pageInformation = {
            init: function () {
                // initialize module
                this.createElements();
                this.buildPanel();
                this.cacheDOM();
                this.addTool();
                this.addStyles();
                this.bindEvents();
                this.displayPanel();
            },
            // ----------------------------------------
            // tier 1 functions
            // ----------------------------------------
            createElements: function () {
                // main panel container
                pageInformation.config = {
                    $pageInfoContainer: jQuery('<div>').attr({
                        class: 'toolBox',
                        id: 'pageInfoContainer'
                    }),
                    // panel title
                    $pageInfoTitle: jQuery('<div>').attr({
                        class: 'panelTitle',
                        id: 'pageInfoTitle',
                        title: 'Click to Minimize/Maximize'
                    }).text('Page Information'),
                    // tool panel
                    $pageInfo: jQuery('<div>').attr({
                        class: 'toolsPanel',
                        id: 'pageInfo'
                    })
                };
            },
            buildPanel: function () {
                // attach panel elements to container
                pageInformation.config.$pageInfo
                    .append(hTags.init());
                // attach to continer
                pageInformation.config.$pageInfoContainer
                    .append(pageInformation.config.$pageInfoTitle)
                    .append(pageInformation.config.$pageInfo);
            },
            cacheDOM: function () {
                // DOM elements
                this.$toolbarStyles = jQuery('#qa_toolbox');
                this.$toolBoxContainer = jQuery('#toolboxContainer');
                this.variableList = this.programData();
            },
            addTool: function () {
                // add to main toolbox
                this.$toolBoxContainer.prepend(pageInformation.config.$pageInfoContainer);
            },
            addStyles: function () {
                // apply module styles to main tool bar style tag
                this.$toolbarStyles
                    .append('.tbInfo { background: linear-gradient(to right, #ECE9E6 , #FFFFFF); color: #000000 !important; clear: both; cursor: pointer; line-height: 15px; padding: 3px 0px; text-transform: none; border-top: 1px solid #000000; border-bottom: 1px solid #000000; font-size: 10px; word-wrap: break-word; user-select: none; }')
                    .append('.tbLabel { font-weight: bold; font-size: inherit; }');
            },
            bindEvents: function () {
                // minimize
                pageInformation.config.$pageInfoTitle.on('click', this.toggleFeature);
                pageInformation.config.$pageInfoTitle.on('click', this.saveState);
                // hover effect
                pageInformation.config.$pageInfo.on('mouseover mouseleave', '.tbInfo', this.hoverEffect);
                // click
                pageInformation.config.$pageInfo.on('click', '.tbInfo', this.copyToClipboard);
            },
            displayPanel: function () {
                // loop through variable list to find the panel title
                var variables = this.variableList,
                    state = '',
                    key = '';
                for (key in variables) {
                    if (key === 'pageInfo') {
                        state = variables[key] ? 'show' : 'hide';
                        this.setState(pageInformation.config.$pageInfo, state);
                    }
                }
            },
            // ----------------------------------------
            // tier 2 functions
            // ----------------------------------------
            programData: function () {
                var allVariables = programVariables(),
                    length = allVariables.length,
                    a = 0,
                    varList = {},
                    key = '',
                    value = '';
                // add variables to list
                for (a; a < length; a += 1) {
                    key = allVariables[a];
                    value = getValue(key);
                    varList[key] = value;
                }
                return varList;
            },
            toggleFeature: function () {
                return pageInformation.config.$pageInfo.slideToggle(500);
            },
            saveState: function (event) {
                // get current state
                var vName = jQuery(event.target).siblings('.toolsPanel').attr('id'),
                    currState = getValue(vName);
                // sets usingM4 value
                setValue(vName, !currState);
            },
            hoverEffect: function (event) {
                // apply hover effects
                var element = event.currentTarget;
                jQuery(element).toggleClass('highlight');
            },
            copyToClipboard: function (event) {
                // copy page info
                var copyThisText = event.currentTarget.innerHTML;
                clipboardCopy(copyThisText);
            },
            setState: function ($panel, state) {
                if (state === 'show') {
                    $panel.css({
                        display: 'block'
                    });
                } else if (state === 'hide') {
                    $panel.css({
                        display: 'none'
                    });
                }
            }
        },
        toolbar = {
            init: function () {
                this.main();
                this.pageInfoPanel();
            },
            main: function () {
                QAtoolbox.init();
            },
            pageInfoPanel: function () {
                pageInformation.init();
            }
        };
    // ------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------- initialize toolbox ----------------------------------------
    // ------------------------------------------------------------------------------------------------------------------------
    toolbar.init();
})(); // end main function
