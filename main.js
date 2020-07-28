import ToyReact, {Component} from './ToyReact';

class MyComponent extends Component {
    render() {
        return <div id='rrr'><span>123</span></div>
    }
}

const a = (
        <MyComponent name='a' id='ida'>
            <span id='1'>Hello</span>
            <span id='2'>World</span>
            <span id='3'>!</span>
        </MyComponent>
    )

ToyReact.render(
    a,
    document.body
)