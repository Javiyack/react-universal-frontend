import React, {Component} from 'react'
import Service from '../services/Service'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class ListAnyComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: this.props.match.params.id,
            page: 1,
            totalPages: 0,
            size: 1,
            total: 0,
            items: []
        }
        this.addItem = this.addItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previusPage = this.previusPage.bind(this);
    }

    deleteItem(id) {
        Service.deleteItem(id).then(res => {
            this.setState({items: this.state.items.filter(item => item._id !== id)});
        });
    }
    viewItem(id) {
        this.props.history.push(`/view-item/${id}`);
    }
    editItem(id) {
        this.props.history.push(`/add-item/${id}`);
    }

    componentDidMount() {
        console.log("componentDidMount" + this.state.page)
        this.getPage(0)
    }

    getPage(page, size = this.state.size) {
        Service.get(`${this.state.name}?page=${page}&size=${size}`).then((res) => {
            console.log("data=" + res.data.data.length)
            if (res.data == null) {
                this.props.history.push('/add-item/_add');
            }
            const totalPages = (((res.data.count % size) > 0) ? 1 : 0) + Math.floor(res.data.count / size)
            console.log("totalPages=" + totalPages)
            this.setState({total: res.data.count, totalPages:totalPages,items: res.data.data});
        });
    }
    setPageSize(size) {
        this.setState({size: size});
        
        this.setState({page: 1});
        this.getPage(0, size)
    }

    addItem() {
        this.props.history.push('/add-item/_add');
    }

    nextPage() {
        const page = (this.state.page < this.state.totalPages) ? this.state.page + 1 : this.state.totalPages
        this.setState({page: page});
        this.getPage(page);
    }


    previusPage() {
        const page = (this.state.page > 1) ? this.state.page - 1 : 1
        this.setState({page: page});
        this.getPage(page);
    }


    render() {
        return (
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
                                    Object.keys(this.state.items[0] || {}).map(
                                        k =>
                                            <th> {JSON.stringify(k)}</th>
                                    )
                                }

                                <th> Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.items.map(
                                    item =>
                                        <tr key={item._id}>
                                            {
                                                Object.values(item).map(
                                                    k =>
                                                        <td> {JSON.stringify(k)}</td>
                                                )
                                            }
                                            <td>
                                                <button onClick={() => this.editItem(item._id)} className="btn btn-info">Update </button>
                                                <button style={{marginLeft: "10px"}} onClick={() => this.deleteItem(item._id)} className="btn btn-danger">Delete </button>
                                                <button style={{marginLeft: "10px"}} onClick={() => this.viewItem(item._id)} className="btn btn-info">View </button>
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
                        <select className="spaced-text" name="size" id="size" onChange={(val) => this.setPageSize(val.target.value)}>
                            {
                                [1, 3, 5, 10, 20, 50, 100, 500, 1000].map(n => <option className="spaced-text" value={n}>{n}</option>)
                            }
                        </select>
                    </div>
            </div>
        )
    }
}

export default ListAnyComponent
