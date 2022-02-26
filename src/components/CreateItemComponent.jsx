import React, {Component} from 'react'
import ItemService from '../services/Service';

class CreateItemComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // step 2
            id: this.props.match.params.id,
            firstName: '',
            lastName: '',
            emailId: ''
        }
        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
        this.saveOrUpdateItem = this.saveOrUpdateItem.bind(this);
    }

    // step 3
    componentDidMount() {

        // step 4
        if (this.state.id === '_add') {
            return
        } else {
            ItemService.getItemById(this.state.id).then((res) => {
                let utem = res.data;
                this.setState({
                    firstName: utem.firstName,
                    lastName: utem.lastName,
                    emailId: utem.emailId
                });
            });
        }
    }
    saveOrUpdateItem = (e) => {
        console.log('Click on save');
        e.preventDefault();
        let utem = {firstName: this.state.firstName, lastName: this.state.lastName, emailId: this.state.emailId};
        console.log('utem => ' + JSON.stringify(utem));

        // step 5
        if (this.state.id === '_add') {
            ItemService.createItem(utem).then(res => {
                this.props.history.push('/utems');
            });
        } else {
            ItemService.updateItem(utem, this.state.id).then(res => {
                this.props.history.push('/utems');
            });
        }
    }

    changeFirstNameHandler = (event) => {
        this.setState({firstName: event.target.value});
    }

    changeLastNameHandler = (event) => {
        this.setState({lastName: event.target.value});
    }

    changeEmailHandler = (event) => {
        this.setState({emailId: event.target.value});
    }

    cancel() {
        console.log('Click on cancel');
        this.props.history.push('/utems');
    }

    getTitle() {
        if (this.state.id === '_add') {
            return <h3 className="text-center">Add Item</h3>
        } else {
            return <h3 className="text-center">Update Item</h3>
        }
    }
    render() {
        return (
            <div>
                <br></br>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            {
                                this.getTitle()
                            }
                            <div className="card-body">
                                <form>{
                                        Object.values(this.state).map(
                                            k =>
                                                <td> {JSON.stringify(k)}</td>
                                        )
                                   
                                }
                                    <button className="btn btn-success" onClick={this.saveOrUpdateItem}>save</button>
                                    <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>cancel</button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default CreateItemComponent
