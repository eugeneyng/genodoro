
class PomodoroControl extends React.Component {
  render() { 
    return (
      <div className="col-4 m-3">
        <h2>{this.props.id}</h2>
        <div className="row align-items-center" style={{border: "1px", borderColor: "white", borderRadius: ".2em", borderStyle: "solid"}}>
          <input id={this.props.id}
            className="col bg-dark form-control text-white"
            defaultValue={this.props.length}
            key={this.props.length} // If a component’s key changes, the component will be destroyed and re-created with a new state. https://stackoverflow.com/questions/30146105/react-input-defaultvalue-doesnt-update-with-state
            // this creates issues with react re-rerendering this input every time the value (which is also the key) changes : https://reactkungfu.com/2015/09/react-js-loses-input-focus-on-typing/
            onBlur={this.props.onBlur}
            style={{border: "0px", fontSize: "5vw", textAlign: "center"}}
            type="text"
          />
          <div className="col row-cols-1">
            <button 
              className="btn btn-dark row m-0 p-0 g-0"
              onClick={this.props.onUpClick}
            >
              <i className="bi bi-arrow-up-square" style={{fontSize: "4vw"}}></i>
            </button>
            <button 
              className="btn btn-dark row m-0 p-0 g-0"
              onClick={this.props.onDownClick}
            >
              <i className="bi bi-arrow-down-square" style={{fontSize: "4vw"}}></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class Timer extends React.Component {

  render() {
    return (
      <div>
        <div className="col">
          <h1 className="row justify-content-center">
            {this.props.doing}
          </h1>
          <div className="row justify-content-center">
            <h1 className="display-1">
              {this.props.minutes}:{this.props.seconds}
            </h1>
          </div>
        </div>
        <div>
          <button 
            className="btn btn-dark btn-lg"
            onClick={this.props.onPlayClick}
          >
            <i className="bi bi-play-btn" style={{fontSize: "7.5vw"}}></i>
          </button>
          <button 
            className="btn btn-dark btn-lg"
            onClick={this.props.onPauseClick}
          >
            <i className="bi bi-pause-btn" style={{fontSize: "7.5vw"}}></i>
          </button>
          <button 
            className="btn btn-dark btn-lg"
            onClick={this.props.onStopClick}
          >
            <i className="bi bi-stop-btn" style={{fontSize: "7.5vw"}}></i>
          </button>
        </div>
      </div>
    );
  }
}

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doing: "Work",
      counting: false,
      workLength: 2700, // seconds
      playLength: 900,  // seconds
      minutes: 45,
      seconds: "00"
    };
  }

  stateCheck() {
    console.log(this.state);
  }

  onBlur(id) {
    let newVal = parseInt(document.getElementById(id).value);
    if (!this.state.counting) {
      if (id=="Work") {
        this.setState({
          minutes: newVal,
          workLength: newVal * 60,
        });
      } else if (id=="Play") {
        this.setState({
          playLength: newVal * 60
        });
      };
    }
  }

  // https://stackoverflow.com/questions/54713510/console-log-after-setstate-doesnt-return-the-updated-state
  onUpClick(id) {
    if (!this.state.counting) {
      if (id=="Work") {
        this.setState({
          minutes: this.state.minutes + 1,
          workLength: this.state.workLength + 60,
        });
      } else if (id=="Play") {
        this.setState({
          playLength: this.state.playLength + 60
        });
      }
    };
  }

  onDownClick(id) {
    if (!this.state.counting) {
      if (id=="Work") {
        this.setState({
          minutes: this.state.minutes - 1,
          workLength: this.state.workLength - 60,
        });
      } else if (id=="Play") {
        this.setState({
          playLength: this.state.playLength - 60
        });
      }
    }
  }

  updateTimer(doing) {

    if (this.state.workLength <= 0 || this.state.playLength <= 0) {
      if (this.state.workLength <= 0) {
        alert("Congratulations !! Done working. Now go play.")
        clearInterval(this.timerID)
        this.setState({
          counting: false,
          doing: "Play",
          workLength: 2700,
          minutes: this.state.playLength / 60
        })
      }
  
      if (this.state.playLength <= 0) {
        alert("Awww, done playing. Now go work.")
        clearInterval(this.timerID)
        this.setState({
          counting: false,
          doing: "Work",
          playLength: 900,
          minutes: this.state.workLength / 60,
        })
      }
    } else {
      if (this.state.doing=="Work") {
        this.setState({
          workLength: this.state.workLength - 1,
          minutes: Math.floor(this.state.workLength / 60),
          seconds: this.state.workLength % 60,
        })
      } else if (this.state.doing=="Play") {
        this.setState({
          playLength: this.state.playLength - 1,
          minutes: Math.floor(this.state.playLength / 60),
          seconds: this.state.playLength % 60,
        })
      }
    }

    
  }

  onPlayClick() {
    if (!this.state.counting) {
      this.setState({
        counting: true
      })
      this.timerID = setInterval(() => this.updateTimer(), 1000 );
    } else {
      console.log("Timer already counting ... ")
    }
    
  }

  onPauseClick() {
    clearInterval(this.timerID);
    this.setState({
      counting: false
    })
    this.stateCheck();
  }

  onStopClick() {
    clearInterval(this.timerID);
    this.setState({
      counting: false,
      workLength: 2700, // seconds
      playLength: 900,  // seconds
    })
  }

  renderPomodoroControl(id) {
    if (!this.state.counting) {
      if (id == "Work") {
        length = this.state.workLength / 60;
        return (
          <PomodoroControl 
            id={id}
            length={length}
            onBlur={ () => this.onBlur(id)}
            onUpClick={ () => this.onUpClick(id)}
            onDownClick={ () => this.onDownClick(id)}
          />
        );
      } else if (id=="Play") {
        length = this.state.playLength / 60;
        return (
          <PomodoroControl 
            id={id}
            length={length}
            onBlur={ () => this.onBlur(id)}
            onUpClick={ () => this.onUpClick(id)}
            onDownClick={ () => this.onDownClick(id)}
          />
        );
      };
    } 
  }

  renderTimer() {

    let minutes;
    let seconds;

    if (this.state.doing == "Work") {
      minutes = Math.floor(this.state.workLength / 60)
      seconds = this.state.workLength % 60
    } else if (this.state.doing == "Play") {
      minutes = Math.floor(this.state.playLength / 60)
      seconds = this.state.playLength % 60
    }

    return (
      <Timer
        doing={this.state.doing}
        minutes={minutes}
        seconds={seconds}
        onPlayClick={ () => this.onPlayClick()}
        onPauseClick={ () => this.onPauseClick()}
        onStopClick={ () => this.onStopClick()}
      />
    )
  }

  render() {
    return (
      <div>
        <h1>Genodoro</h1>
        <div className="row justify-content-center">
          {this.renderPomodoroControl("Work")}
          {this.renderPomodoroControl("Play")}
        </div>
        <div>
          {this.renderTimer()}
        </div>
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Pomodoro />);