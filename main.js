import ToyReact, {Component} from './ToyReact';

class Square extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          value: props.value,
        };
    }

    componentWillMount() {
        console.log('componentWillMount Square', this.props.value);
    }

    componentDidMount() {
        console.log('componentDidMount Square', this.props.value);
    }
    
    componentWillUpdate() {
        console.log('componentWillUpdate Square', this.props.value);
    }

    componentDidUpdate() {
        console.log('componentDidUpdate Square', this.props.value);
    }

    render() {
      const {value} = this.state;

      return (
        <button
          className="square"
          onClick={() => {
            this.setState({value: this.state.value + 1});
          }}
        >
          {value}
        </button>
      );
    }
  }

class Board extends Component {
  
    renderSquare(i) {
      return (
        <Square
          value={i}
        />
      );
    }

    componentWillMount() {
        console.log('componentWillMount');
    }
    componentDidMount() {
        console.log('componentDidMount');
    }
  
    componentWillUpdate() {
        console.log('componentWillUpdate');
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
    }
  
    render() {
  
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }


ToyReact.render(
    <Board/>,
    document.body
)