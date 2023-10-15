"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bookmarks = function (_React$Component) {
    _inherits(Bookmarks, _React$Component);

    function Bookmarks() {
        _classCallCheck(this, Bookmarks);

        return _possibleConstructorReturn(this, (Bookmarks.__proto__ || Object.getPrototypeOf(Bookmarks)).apply(this, arguments));
    }

    _createClass(Bookmarks, [{
        key: "renderBookmarks",
        value: function renderBookmarks(linksGrouped, dataUrl) {
            return React.createElement(
                "div",
                { className: "container-fluid" },
                React.createElement(
                    "div",
                    { id: "dataUrl" },
                    "Bookmarks data: ",
                    dataUrl
                ),
                React.createElement(
                    "div",
                    { className: "text-center m-4" },
                    React.createElement("input", { className: "mr-2", size: "40", autoFocus: true, id: "searchInput",
                        onChange: this.filterItems.bind(this),
                        onKeyDown: this.openFirstLink.bind(this),
                        placeholder: "Search by keywords separated by space" })
                ),
                React.createElement(
                    "div",
                    { id: "links", className: "card-columns" },
                    React.createElement(Groups, { linksGroups: linksGrouped })
                )
            );
        }

        /* convert items to grouped format
        {
        "group1", [{name: "name1", url: "http://test"}, {name: "name3", url: "http://test2"}],
        "group2", [{name: "name3", url: "http://test"}, {name: "name4", url: "http://test2"}]
        }
        */

    }, {
        key: "groupBy",
        value: function groupBy(list, keyGetter) {
            var map = new Map();
            list.forEach(function (item) {
                var keys = keyGetter(item);
                keys.forEach(function (key) {
                    var collection = map.get(key);
                    if (!collection) {
                        map.set(key, [item]);
                    } else {
                        collection.push(item);
                    }
                });
            });
            return map;
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            var url = window.location.href;
            var urlObj = new URL(url);
            var urlParams = new URLSearchParams(urlObj.search);
            var dataUrl = void 0;
            if (urlParams.has("data")) {
                dataUrl = urlParams.get("data");
            } else {
                var bmName = "default";
                if (urlParams.has("name")) {
                    bmName = urlParams.get("name");
                }
                dataUrl = "data/links-" + bmName + ".json";
            }
            fetch(dataUrl).then(function (response) {
                return response.json();
            }).then(function (responseJson) {
                return _this2.setState({ items: responseJson, allItems: responseJson, dataUrl: dataUrl });
            }).catch(function (error) {
                console.error(error);
            });
            document.title = "Bookmarks"; // + bmName;
        }
    }, {
        key: "filterItems",
        value: function filterItems(event) {
            var keywords = event.target.value.split(" ");
            var filteredItems = this.state.allItems.filter(function (item) {
                var result = true;
                for (var i = 0; i < keywords.length; i++) {
                    result = result && (item.name.toUpperCase().includes(keywords[i].toUpperCase()) || item.url.toUpperCase().includes(keywords[i].toUpperCase()));
                }
                return result;
            });
            this.setState({ items: filteredItems });
        }
    }, {
        key: "openFirstLink",
        value: function openFirstLink(event) {
            if (event.which === 13 && this.state.items.length > 0) {
                window.location.href = this.state.items[0].url;
            }
        }
    }, {
        key: "render",
        value: function render() {
            if (this.state) {
                var linksGrouped = this.groupBy(this.state.items, function (item) {
                    return item.tag;
                });
                return this.renderBookmarks(linksGrouped, this.state.dataUrl);
            }
            return "";
        }
    }]);

    return Bookmarks;
}(React.Component);

var Groups = function (_React$Component2) {
    _inherits(Groups, _React$Component2);

    function Groups() {
        _classCallCheck(this, Groups);

        return _possibleConstructorReturn(this, (Groups.__proto__ || Object.getPrototypeOf(Groups)).apply(this, arguments));
    }

    _createClass(Groups, [{
        key: "renderLi",
        value: function renderLi(name, url) {
            return React.createElement(
                "li",
                { className: "list-group-item p-1", key: name },
                React.createElement(
                    "a",
                    { href: url },
                    name
                )
            );
        }
    }, {
        key: "renderUl",
        value: function renderUl(title, links) {
            var _this4 = this;

            return React.createElement(
                "ul",
                { className: "list-group card border-0", key: title },
                React.createElement(
                    "li",
                    { className: "list-group-item active p-1", key: title },
                    title
                ),
                links.map(function (link) {
                    return _this4.renderLi(link.name, link.url);
                })
            );
        }
    }, {
        key: "renderGroups",
        value: function renderGroups(linksGroups) {
            var _this5 = this;

            var bookmarkGroups = [];
            linksGroups.forEach(function (v, k) {
                return bookmarkGroups.push(_this5.renderUl(k, v));
            });
            return bookmarkGroups;
        }
    }, {
        key: "render",
        value: function render() {
            return this.renderGroups(this.props.linksGroups);
        }
    }]);

    return Groups;
}(React.Component);

ReactDOM.render(React.createElement(Bookmarks, null), document.getElementById('root'));