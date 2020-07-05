import React from 'react';
import './Home.css'
import Select from 'react-select'

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoaded: false,
            picList: [],
            isManager: 1,
            error: null
        };
    }

    componentDidMount(){
        const picFetch = fetch('http://localhost:4000/api/v1/pic');
        picFetch
            .then(res => {return res.json()})
            .then(result => {
                //console.log(result);
                this.setState({
                    isLoaded: true,
                    picList : result
                });
            }
            ).catch(error => console.log(error));   
    }

    render() {
        return(
            <div>
                <nav className="navbar navbar-dark bg-dark">
                    <a className="navbar-brand text-center mx-auto" href="#" style={{"fontSize":"2rem"}}>
                        <i className="fab fa-earlybirds"></i> Remi2Do
                    </a>
                </nav>
                <br/>
                <div className="container justify-content-between">
                    <div></div>
                    <div>
                        <Summary />
                        <hr/>
                        <Task 
                           picList      = {this.state.picList}
                           isManager    = {this.state.isManager} 
                        />
                        <ul className="nav nav-pills nav-fill justify-content-between" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="pending-tab" data-toggle="tab" href="#pending" role="tab" aria-controls="pending" aria-selected="true">Pending</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="completed-tab" data-toggle="tab" href="#completed" role="tab" aria-controls="completed" aria-selected="false">Completed</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="overdue-tab" data-toggle="tab" href="#overdue" role="tab" aria-controls="overdue" aria-selected="false">Overdue</a>
                            </li>
                        </ul>
                        
                        <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="pending" role="tabpanel" aria-labelledby="pending-tab">
                            <PendingTab />
                        </div>
                        <div className="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="completed-tab">
                            <CompletedTab />
                        </div>
                        <div className="tab-pane fade" id="overdue" role="tabpanel" aria-labelledby="overdue-tab">
                            <OverdueTab />
                        </div>
                        </div>
                    </div>
                    
                    <div></div>
                </div>
            </div>
            
        );
    }
}

class Summary extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pending     : 0,
            completed   : 1,
            overdue     : 2,
        }
    }

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-4 col-sm-12 d-flex justify-content-center">
                        <div className="card text-white bg-success mb-3" style={{"width":"12rem"}}>
                            <div className="card-header text-center">Completed</div>
                            <div className="card-body">
                                <h5 className="card-title text-center" style={{"fontSize":"40px"}}>{this.state.completed}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 d-flex justify-content-center">
                        <div className="card text-white bg-danger mb-3" style={{"width":"12rem"}}>
                            <div className="card-header text-center">Overdue</div>
                            <div className="card-body">
                                <h5 className="card-title text-center" style={{"fontSize":"40px"}}>{this.state.overdue}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12 d-flex justify-content-center">
                        <div className="card text-white bg-info mb-3" style={{"width":"12rem"}}>
                            <div className="card-header text-center">Pending</div>
                            <div className="card-body">
                                <h5 className="card-title text-center" style={{"fontSize":"40px"}}>{this.state.pending}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class CompletedTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          taskList: []
        };
    }

    render() {
        return (
            <div>
                Completed tab
            </div>
        );
    };
}

class OverdueTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          taskList: []
        };
    }

    render() {
        return (
            <div>
                Overdue tab
            </div>
        );
    };
}

class PendingTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          taskList: []
        };
    }

    render() {
        return (
            <div>
                Pending tab
            </div>
        );
    };
}

class Task extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            selectedPic     : [],
            isCollapse      : true,
            title           : "",
            desc            : "",
            assignTo        : "",
            overdueDate     : ""
        };
        this.collapseClick          = this.collapseClick.bind(this);
        this.handleSubmit           = this.handleSubmit.bind(this);
        this.handleDescChange       = this.handleDescChange.bind(this);
        this.handleDateChange       = this.handleDateChange.bind(this);
        this.handleDropdownChange   = this.handleDropdownChange.bind(this);
        this.handleTitleChange      = this.handleTitleChange.bind(this);
    }

    collapseClick(){
        console.log("before:",this.state.isCollapse);
        this.setState({
            isCollapse: !this.state.isCollapse
        });
        console.log("after:",this.state.isCollapse);
    }

    componentDidMount(){
        console.log("Task mounted");
    }

    handleSubmit(e){
        e.preventDefault();
        fetch('http://localhost:4000/api/v1/task', {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.title,
                desc: this.state.desc,
                assignTo: this.state.assignTo,
                overdueDate: this.state.overdueDate
            }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(response => {
            alert(response.message);
            this.setState({
                selectedPic     : null,
                isCollapse      : true,
                title           : "",
                desc            : "",
                assignTo        : "",
                overdueDate     : ""
            });
            document.getElementById("formTask").reset();
        })
        .catch(error => {
            alert("Add Fail");
            console.error(error);
        });
    }

    handleTitleChange(e){
        console.log(this.state.title);
        this.setState({
            title: e.target.value
        });
    }

    handleDescChange(e){
        this.setState({
            desc : e.target.value
        });
    }

    handleDateChange(e){
        this.setState({
            overdueDate: e.target.value.toString()
        });
    }

    handleDropdownChange(selectedPIC){
        let selectedPICList = null;
        let assignTo = null;
        if (selectedPIC !== null){
            selectedPICList = selectedPIC.map((pic) => pic.value);
            assignTo = selectedPICList.join(',');
        }
        this.setState({
            selectedPic: selectedPIC,
            assignTo: assignTo
        });
    }

    render() {        
        const options = this.props.picList.map((pic) => {
            return ({
                "value": pic.username,
                "label": pic.full_name
            });
        });

        let arrowIcon;
        let hoverText;
        if(this.state.isCollapse){
            arrowIcon = <i className="fa fa-angle-right" style={{"fontSize":"1.5rem"}}></i>;
            hoverText = "Expand Task";
        }else{
            arrowIcon = <i className="fa fa-angle-down" style={{"fontSize":"1.5rem"}}></i>;
            hoverText = "Collapse Task";
        }

        if(this.props.isManager === 1){
                console.log(this.state);
                return (
                    <div>
                        <div className="container justify-content-between">
                            <a  id="toggleTask" 
                                data-toggle="collapse" 
                                href="#divInsertTask" 
                                aria-expanded={this.state.isCollapse} 
                                aria-controls="divInsertTask" 
                                onClick={this.collapseClick}
                                title={hoverText}
                                style={{"fontSize":"1rem",
                                    "textDecoration":"none",
                                    "margin":"5px"
                                    }}>
                                <div className="row">
                                    <div className="col-6 col-md-6 col-sm-6">CREATE TASK</div>
                                    <div className="col-6 col-md-6 col-sm-6 text-right">{arrowIcon}</div>
                                </div>
                            </a>
                        </div>
                        <div id="divInsertTask" className="container collapse">
                            <form id="formTask" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label for="txtTitle">Title </label>
                                    <input  id="txtTitle"
                                            type="text"
                                            value={this.state.title}
                                            onChange={this.handleTitleChange}
                                            className="form-control"
                                            placeholder="Enter title here ..."
                                            aria-labelledby="txtTitle"
                                            required
                                    />
                                </div>
                                <div className="form-group">
                                    <label for="txtTask">Task </label>
                                    <textarea   id="txtTask" 
                                                value={this.state.desc}
                                                onChange={this.handleDescChange}
                                                className="form-control" 
                                                rows="5" cols="50" 
                                                placeholder="Enter task here ..." 
                                                aria-labelledby="txtTask" 
                                                required></textarea>
                                </div>
                                <div className="form-group">
                                    <label for="assignTo">Assign to </label>
                                    <Select options = {options}
                                            isMulti
                                            closeMenuOnSelect={false}
                                            onChange={this.handleDropdownChange}
                                            value={this.state.selectedPic}
                                            required />
                                </div>
                                <div className="form-group">
                                    <label for="txtTask">Overdue </label>
                                    <input  type="date" 
                                            id="dateOverdue" 
                                            value={this.state.overdueDate}
                                            onChange={this.handleDateChange}
                                            className="form-control" 
                                            required></input>
                                </div>
                                <button className="btn btn-primary float-right" type="submit">CREATE</button>
                                <br/>
                                <br/>
                            </form>
                        </div>
                        <hr/>
                    </div>
                );
        } else {
            return null;
        }
    }
        
}

export default Home;