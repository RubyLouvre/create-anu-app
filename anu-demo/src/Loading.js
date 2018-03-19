import React from "react";

export let Loading = class extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            dots: ["."]
        }
    }
    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({
                dots: [".."]
            })
        }, 300)
    }
    componentDidUpdate() {
        this.timer = setTimeout(() => {
            var n = this.state.dots.length
            if (n < 7) {
                this.setState({
                    dots: new Array(n + 1).fill(".")
                })
            } else {
                this.setState({
                    dots: ["."]
                })
            }
        }, 300)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        return <p>加载中{this.state.dots}</p>
    }
}