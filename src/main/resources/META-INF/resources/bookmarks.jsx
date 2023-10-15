class Bookmarks extends React.Component {
    renderBookmarks(linksGrouped, dataUrl) {
        return (
            <div className="container-fluid">
                <div id="dataUrl">Bookmarks data: {dataUrl}</div>
                <div className="text-center m-4">
                    <input className="mr-2" size="40" autoFocus id="searchInput"
                           onChange={this.filterItems.bind(this)}
                           onKeyDown={this.openFirstLink.bind(this)}
                           placeholder="Search by keywords separated by space"/>
                </div>
                <div id="links" className="card-columns">
                    <Groups linksGroups={linksGrouped}/>
                </div>
            </div>
        )
    }

    /* convert items to grouped format
    {
    "group1", [{name: "name1", url: "http://test"}, {name: "name3", url: "http://test2"}],
    "group2", [{name: "name3", url: "http://test"}, {name: "name4", url: "http://test2"}]
    }
    */
    groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach(item => {
            const keys = keyGetter(item);
            keys.forEach(key => {
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            })
        });
        return map;
    }

    componentDidMount() {
        const url = window.location.href;
        const urlObj = new URL(url);
        const urlParams = new URLSearchParams(urlObj.search);
        let dataUrl;
        if (urlParams.has("data")) {
            dataUrl = urlParams.get("data");
        } else {
            let bmName = "default";
            if (url.indexOf("?") > -1 && url.substring(url.indexOf("?")+1).length > 0) {
                bmName = url.substring(url.indexOf("?")+1);
            }
            dataUrl = "data/links-" + bmName + ".json"
        }
        fetch(dataUrl)
            .then(response => response.json())
            .then(responseJson => this.setState({items: responseJson, allItems: responseJson, dataUrl: dataUrl}))
            .catch(error => {
                console.error(error);
            });
        document.title = "Bookmarks";// + bmName;
    }


    filterItems(event) {
        let keywords = event.target.value.split(" ");
        let filteredItems = this.state.allItems.filter(item => {
            let result = true;
            for (let i = 0; i < keywords.length; i++) {
                result = result &&
                    (item.name.toUpperCase().includes(keywords[i].toUpperCase())
                        || item.url.toUpperCase().includes(keywords[i].toUpperCase())
                    )
            }
            return result;
        });
        this.setState({items:filteredItems});
    }

    openFirstLink(event) {
        if (event.which === 13 && this.state.items.length > 0) {
            window.location.href = this.state.items[0].url;
        }
    }

    render() {
        if (this.state) {
            let linksGrouped = this.groupBy(this.state.items, item => item.tag);
            return this.renderBookmarks(linksGrouped, this.state.dataUrl);
        }
        return "";
    }
}

class Groups extends React.Component {
    renderLi(name, url) {
        return <li className="list-group-item p-1" key={name}><a href={url}>{name}</a></li>;
    }

    renderUl(title, links) {
        return (
            <ul className="list-group card border-0" key={title}>
                <li className="list-group-item active p-1" key={title}>{title}</li>
                {links.map(link => this.renderLi(link.name, link.url))}
            </ul>
        )
    }

    renderGroups(linksGroups) {
        let bookmarkGroups = [];
        linksGroups.forEach((v, k) => bookmarkGroups.push(this.renderUl(k, v)));
        return bookmarkGroups;
    }

    render() {
        return this.renderGroups(this.props.linksGroups);
    }
}

ReactDOM.render(<Bookmarks/>, document.getElementById('root'));
