import React, {Component} from 'react';
import Service from '../services/Service';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Box, Button, ButtonGroup, Grid, Input} from '@material-ui/core';

class ListAnyComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.match.params.id,
            filters: [],
            tmp: "",
            columns_filters: [],
            page: 1,
            totalPages: 0,
            size: 1,
            total: 0,
            items: []
        };
        this.addItem = this.addItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previusPage = this.previusPage.bind(this);
        this.addColumnFilter = this.addColumnFilter.bind(this);
        this.removeColumnFilter = this.removeColumnFilter.bind(this);
    }


    buttonStyle() {
        console.log("buttonStyle()");
        return {mx: "auto", width: 100, color: "white"};
    }

    filterItemRows(items) {
        console.log(`filterItemRows(${items})`);
        return items.filter(i => i.includes(this.state.filters[0]));
    }

    inputValue(value) {
        console.log(`inputValue(${value})`);
        console.log(JSON.stringify(this.state));
        this.setState({tmp: value});
        console.log(JSON.stringify(this.state));
    }

    getItems() {
        console.log("filterItemRows()");
        return this.filterColumns();
    }
    getColumnFilters() {
        console.log("filterItemRows()");
        var filters = [...new Set(this.state.columns_filters.filter(f => f !== ''))];
        console.log("getColumnFilters: " + filters);
        return filters;
    }

    addColumnFilter() {
        var filter = this.state.tmp;
        console.log(`addColumnFilter(${filter})`);
        console.log(JSON.stringify(this.state));
        var filters = [];
        this.state.columns_filters.forEach(f => filters.push(f));
        filters.push(filter);
        this.setState({columns_filters: filters});
        this.getPage(this.state.page);
    }

    removeColumnFilter(filter) {
        console.log(`removeColumnFilter(${filter})`);
        console.log(JSON.stringify(this.state));
        var filters = [];
        this.state.columns_filters.forEach(f => {if (f !== filter) filters.push(f);});
        this.setState({columns_filters: filters});
        this.getPage(this.state.page);
    }

    filterColumns() {
        console.log("filterColumns()");
        return this.state.items.map(item => {
            var allKeys = Object.keys(item);
            var keysToKeep = [];
            var filters = this.state.columns_filters.filter(f => f !== '');
            if (filters.length !== 0) allKeys.forEach(k => {
                filters.forEach(filter => {
                    if (k.includes(filter)) keysToKeep.push(k);
                });
            });
            else keysToKeep = allKeys;

            allKeys.filter(k => !keysToKeep.includes(k)).forEach(k => {
                delete item[k];
            });
            return {...item};
        }
        );

    }

    appyFilters() {
        console.log("appyFilters()");
        const rows = new Set(this.state.filters.map(
            filter => this.state.items.filter(it => it.key.includes(filter))
        ));
        return rows;
    }

    deleteItem(id) {
        console.log("deleteItem()");
        Service.deleteItem(id).then(res => {
            this.setState({items: this.state.items.filter(item => item._id !== id)});
        });
    }
    viewItem(id) {
        console.log("viewItem()");
        this.props.history.push(`/view-item/${id}`);
    }
    editItem(id) {
        console.log("editItem()");
        this.props.history.push(`/add-item/${id}`);
    }

    componentDidMount() {
        console.log("componentDidMount" + this.state.page);
        this.getPage(0);
    }

    getPage(page, size = this.state.size) {
        Service.get(`${this.state.name}?page=${page}&size=${size}`).then((res) => {
            console.log("data=" + res.data.data.length);
            if (res.data == null) {
                this.props.history.push('/add-item/_add');
            }
            const totalPages = (((res.data.count % size) > 0) ? 1 : 0) + Math.floor(res.data.count / size);
            console.log("totalPages=" + totalPages);
            this.setState({total: res.data.count, totalPages: totalPages, items: res.data.data});
        });
        console.log("getPage=" + this.state.page + ", Status=" + JSON.stringify(this.state));
    }
    setPageSize(size) {
        console.log("setPageSize()");
        this.setState({size: size});
        this.setState({page: 1});
        this.getPage(0, size);
    }

    addItem() {
        console.log("addItem()");
        this.props.history.push('/add-item/_add');
    }

    nextPage() {
        console.log("nextPage()");
        const page = (this.state.page < this.state.totalPages) ? this.state.page + 1 : this.state.totalPages;
        this.setState({page: page});
        this.getPage(page);
    }


    previusPage() {
        console.log("previusPage()");
        const page = (this.state.page > 1) ? this.state.page - 1 : 1;
        this.setState({page: page});
        this.getPage(page);
    }


    render() {
        console.log("render()");
        return (
            <Box sx={{padding: 3, mx: "auto", nimHeight: "900px", width: "100%"}} color="secondary">
                <Grid container spacing={2} alignItems="center">
                    <Grid item sx={{width: "100%"}}>
                        <div>
                            <h2 className="text-center">Items List</h2>
                            <div className="row">
                                <button className="btn btn-primary btn-dark rounded" onClick={this.addItem}> Add Item</button>
                            </div>
                            <br></br>
                            <div className="row">
                                <table className="table table-striped table-bordered table-hover table-condensed rounded table-dark">

                                    <thead>
                                        <tr>
                                            {
                                                Object.keys(this.getItems()[0] || {}).map(
                                                    k =>
                                                        <th key={k}> {JSON.stringify(k)}</th>
                                                )
                                            }

                                            <th> Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.getItems().map(
                                                item =>
                                                    <tr>
                                                        {
                                                            Object.values(item).map(
                                                                k =>
                                                                    <td> {JSON.stringify(k)}</td>
                                                            )
                                                        }
                                                        <td>
                                                            <button style={this.buttonStyle()} onClick={() => this.editItem(item._id)} className="btn btn-info">Update </button>
                                                            <button style={this.buttonStyle()} onClick={() => this.deleteItem(item._id)} className="btn btn-danger">Delete </button>
                                                            <button style={this.buttonStyle()} onClick={() => this.viewItem(item._id)} className="btn btn-info">View </button>
                                                        </td>
                                                    </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary btn-dark" onClick={this.previusPage}>prev</button>
                                <h4 className="spaced-text"> page {this.state.page}</h4>
                                <h4 className="spaced-text"> of {this.state.totalPages}</h4>
                                <button className="btn btn-primary btn-dark" onClick={this.nextPage}>next</button>
                                <h4 className="spaced-text"> page size</h4>
                                <select className="btn-dark spaced-text" name="size" id="size" onChange={(val) => this.setPageSize(val.target.value)}>
                                    {
                                        [1, 3, 5, 10, 20, 50, 100, 500, 1000].map(n => <option key={n} className="btn-dark spaced-text" value={n}>{n}</option>)
                                    }
                                </select>

                            </div>
                            <br></br>
                            <div className="row">
                                <Input className="btn-dark" onKeyUp={(val) => this.inputValue(val.target.value)} style={{color: "#FAFAFA"}} />

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className="btn btn-primary btn-dark rounded spaced-text"
                                    onClick={() => this.addColumnFilter()}>
                                    Add filter
                                </Button>
                                {
                                    this.getColumnFilters().map(f =>
                                        <Button key={f} style={this.buttonStyle()} onClick={() => this.removeColumnFilter(f)}>{f}</Button>
                                    )
                                }
                            </div>
                        </div>
                    </Grid>

                </Grid>
            </Box>
        );
    }
}

export default ListAnyComponent;
