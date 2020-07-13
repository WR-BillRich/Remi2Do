import React from 'react';
import './Home.css'
import Select from 'react-select'

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoaded: false,
            isManager: 1,
            error: null,
            refresh: false
        };
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidMount(){
          
    }

    handleRefresh() {
        this.setState({
            refresh: !this.state.refresh
        });
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
                           isManager = {this.state.isManager} 
                           handleRefresh = {this.handleRefresh}
                        />
                        <ul className="nav nav-tabs nav-fill justify-content-between" id="myTab" role="tablist">
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
                            <PendingTab 
                                refresh={this.state.refresh}
                                handleRefresh = {this.handleRefresh}
                             />
                        </div>
                        <div className="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="completed-tab">
                            <CompletedTab refresh={this.state.refresh} />
                        </div>
                        <div className="tab-pane fade" id="overdue" role="tabpanel" aria-labelledby="overdue-tab">
                            <OverdueTab refresh={this.state.refresh} />
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
            isLoaded: false,
            taskList: []
        };
    }

    componentWillReceiveProps(props) {
        const {refresh} = this.props;
        if (props.refresh !== refresh) {
            this.componentDidMount();
        }
    }

    componentDidMount(){
        fetch('http://localhost:4000/api/v1/completed-task')
        .then(res => res.json())
        .then(result => {
            this.setState({
                isLoaded: true,
                taskList: result
            });
        });
    }

    render() {
        const completedList = this.state.taskList.map(task => {
            let cardStyle = "card ";
            if(task.color !== 'bg-light'){
                cardStyle += "text-white ";
                cardStyle += task.color;
            } else {
                cardStyle += task.color;
            }

            const contentId = "content" + task.task_id;
            const target = "#" + contentId;
            
            const createdDate = new Date(task.created_date);
            const completedDate = new Date(task.completed_date);

            return (
                <a data-toggle="collapse" data-target={target}>
                    <div className={cardStyle} style={{"marginBottom":"1rem"}}>
                        <div className="card-body">
                            <div className="card-title">
                                <div className="row">
                                    <div className="col">
                                        <span><b>{task.task_title}</b></span>
                                    </div>
                                </div>   
                            </div>
                            <div className="card-subtitle text-muted">
                                <h6>completed at {completedDate.toDateString()}</h6>
                                
                                
                            </div>
                            <div id={contentId} className="collapse">
                                <span   className="card-text"
                                        style={{"whiteSpace":"pre-line"}}
                                >
                                    {task.task_desc}
                                </span>
                                <div class="text-right text-muted">
                                    <h6>created at {createdDate.toDateString()}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            )
        });

        return (
            <div>
                <br/>
                {completedList}
            </div>
        );
    };
}

class OverdueTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            taskList: []
        };
    }

    componentWillReceiveProps(props) {
        const {refresh} = this.props;
        if (props.refresh !== refresh) {
            this.componentDidMount();
        }
    }

    componentDidMount(){
        fetch('http://localhost:4000/api/v1/overdue-task')
        .then(res => res.json())
        .then(result => {
            this.setState({
                isLoaded: true,
                taskList: result
            });
        });
    }

    render() {
        const overdueList = this.state.taskList.map(task => {
            let cardStyle = "card ";
            if(task.color !== 'bg-light'){
                cardStyle += "text-white ";
                cardStyle += task.color;
            } else {
                cardStyle += task.color;
            }

            const contentId = "content" + task.task_id;
            const target = "#" + contentId;
            
            const createdDate = new Date(task.created_date);
            const overdueDate = new Date(task.overdue_date);

            return (
                <a data-toggle="collapse" data-target={target}>
                    <div className={cardStyle} style={{"marginBottom":"1rem"}}>
                        <div className="card-body">
                            <div className="card-title">
                                <div className="row">
                                    <div className="col">
                                        <span><b>{task.task_title}</b></span>
                                    </div>
                                    <div className="col ">
                                        <a title="Mark as complete">
                                            <i  class="far fa-circle float-right" 
                                                style={{"fontSize":"1.5rem"}}>
                                            </i>
                                        </a>
                                    </div>
                                </div>   
                            </div>
                            <div className="card-subtitle text-muted">
                                <h6>overdue at {overdueDate.toDateString()}</h6>
                            </div>
                            <div id={contentId} className="collapse">
                                <span   className="card-text"
                                        style={{"whiteSpace":"pre-line"}}
                                >
                                    {task.task_desc}
                                </span>
                                <div class="text-right text-muted">
                                    <h6>created at {createdDate.toDateString()}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            )
        });

        return (
            <div>
                <br/>
                {overdueList}
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
        this.handleTaskClick = this.handleTaskClick.bind(this);
    }
    
    componentWillReceiveProps(props) {
        const {refresh} = this.props;
        if (props.refresh !== refresh) {
            this.componentDidMount();
        }
    }

    componentDidMount(){
        const url = 'http://localhost:4000/api/v1/pending-task';
        fetch(url)
        .then(res => res.json())
        .then(response => 
            this.setState({
                taskList: response
            })
        )
    }

    handleTaskClick(taskId) {
        const url = 'http://localhost:4000/api/v1/task-complete';
        console.log({taskId});
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                'taskId': taskId,
                'username': 'ADMIN'
            }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(response => {
            console.log(response.message);
            this.props.handleRefresh();
        })
        .catch(error => {
            console.log(error);
            alert('Task complete fail');
        });
    }

    render() {
        console.log('Pending tasks: \n');
        console.log( this.state.taskList);

        const pendingList = this.state.taskList.map(task => {
            let cardStyle = "card ";
            if(task.color !== 'bg-light'){
                cardStyle += "text-white ";
                cardStyle += task.color;
            } else {
                cardStyle += task.color;
            }
        
            const contentId = "content" + task.task_id;
            const target = "#" + contentId;
            
            const createdDate = new Date(task.created_date);
            const overdueDate = new Date(task.overdue_date);

            return (
                <a data-toggle="collapse" data-target={target}>
                    <div className={cardStyle} style={{"marginBottom":"1rem"}}>
                        <div className="card-body">
                            <div className="card-title">
                                <div className="row">
                                    <div className="col">
                                        <span><b>{task.task_title}</b></span>
                                    </div>
                                    <div className="col ">
                                        <a title="Mark as complete" onClick={e => this.handleTaskClick(task.task_id)}>
                                            <i  class="far fa-circle float-right" 
                                                style={{"fontSize":"1.5rem"}}>
                                            </i>
                                        </a>
                                    </div>
                                </div>   
                            </div>
                            <div className="card-subtitle text-muted">
                                <h6>overdue {overdueDate.toDateString()}</h6>
                                
                                
                            </div>
                            <div id={contentId} className="collapse">
                                <span   className="card-text"
                                        style={{"whiteSpace":"pre-line"}}
                                >
                                    {task.task_desc}
                                </span>
                                <div class="text-right text-muted">
                                    <h6>created {createdDate.toDateString()}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            )
        });

        return (
            <div>
                <br/>
                {pendingList}
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
            overdueDate     : "",
            isLoaded        : false,
            picList         : []
        };
        this.collapseClick          = this.collapseClick.bind(this);
        this.handleSubmit           = this.handleSubmit.bind(this);
        this.handleDescChange       = this.handleDescChange.bind(this);
        this.handleDateChange       = this.handleDateChange.bind(this);
        this.handleDropdownChange   = this.handleDropdownChange.bind(this);
        this.handleTitleChange      = this.handleTitleChange.bind(this);
    }

    

    componentDidMount(){
        console.log("Task mounted");
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
                overdueDate     : "",
                isLoaded        : false,
                picList         : []
            });
            document.getElementById("formTask").reset();
            this.props.handleRefresh();
        })
        .catch(error => {
            alert("Add Fail");
            console.error(error);
        });
    }

    collapseClick(){
        console.log("before:",this.state.isCollapse);
        this.setState({
            isCollapse: !this.state.isCollapse
        });
        console.log("after:",this.state.isCollapse);
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
        const options = this.state.picList.map((pic) => {
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
                    </div>
                );
        } else {
            return null;
        }
    }
        
}

export default Home;