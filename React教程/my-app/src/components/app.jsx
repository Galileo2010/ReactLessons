import React,{ Component } from "react";
import PubSub from "pubsub-js";
import SetGame from "./setgame";
export default class App extends Component{
    // 设置状态
    state = {
        size: 20,
        ages: []
    }
    // 组件将要加载
    componentWillMount() {
        let size = this.state.size;
        let ages = new Array(size)
        for (var i = 0; i < size; i++) {        //一维长度为i,i为变量，可以根据实际情况改变  
            ages[i] = new Array(size);    //声明二维，每一个一维数组里面的一个元素都是一个数组
        }
        for (let i = 0; i < size; i++)
            ages[10][i] = 1

        this.setState({
            size: size,
            ages: ages
        })
    }

    componentDidMount() {
        // 订阅消息，注册消息
        PubSub.subscribe('setSize', (message, size) => {
            console.log(size);
            let ages = new Array(size)
            for (var i = 0; i < size; i++) {        //一维长度为i,i为变量，可以根据实际情况改变  
                ages[i] = new Array(size);    //声明二维，每一个一维数组里面的一个元素都是一个数组
            }
            this.setState({
                size: size,
                ages: ages
            })
            this.DrawReacts("mycanvas")
        })

        PubSub.subscribe('evolution', (message, parm) => {
            this.updateAges()
            this.DrawReacts("mycanvas")
        })

        this.DrawReacts("mycanvas")
    }

    handleClick = (event) => {
        let ev = event || window.event;
        let x = ev.clientX - ev.target.offsetLeft;
        let y = ev.clientY - ev.target.offsetTop;
        let cellSize = ev.target.width / this.state.size;

        let i = parseInt(y / cellSize, 10);
        let j = parseInt(x / cellSize, 10);
        let { size, ages } = this.state;
        if (ages[i][j] === undefined) {
            ages[i][j] = 1;
        } else {
            ages[i][j] = undefined;
        }
        this.setState({ size: size, ages: ages })
        this.DrawReacts("mycanvas")
    }

    // 判断点是否越界
    isillegal = (i, j) => {
        return (i < 0 || i >= this.state.ages.length || j < 0 || j >= this.state.ages[0].length);
    }
    // 统计细胞周围存活的细胞数目
    countCells = (i, j) => {
        let oldAges = this.state.ages;
        let counter = 0;
        if (!this.isillegal(i - 1, j - 1) && oldAges[i - 1][j - 1] !== undefined) counter++;
        if (!this.isillegal(i - 1, j    ) && oldAges[i - 1][j    ] !== undefined) counter++;
        if (!this.isillegal(i - 1, j + 1) && oldAges[i - 1][j + 1] !== undefined) counter++;
        if (!this.isillegal(i    , j - 1) && oldAges[i    ][j - 1] !== undefined) counter++;
        if (!this.isillegal(i    , j + 1) && oldAges[i    ][j + 1] !== undefined) counter++;
        if (!this.isillegal(i + 1, j - 1) && oldAges[i + 1][j - 1] !== undefined) counter++;
        if (!this.isillegal(i + 1, j    ) && oldAges[i + 1][j    ] !== undefined) counter++;
        if (!this.isillegal(i + 1, j + 1) && oldAges[i + 1][j + 1] !== undefined) counter++;
        return counter;
    }
    // 根据演化规则确定细胞的状态
    getNewAge = (i, j) => {
        let oldAges = this.state.ages;
        let counter = this.countCells(i, j)
        // 演化规则
        if (counter === 3)  return (oldAges[i][j] === undefined) ? 1 : oldAges[i][j] + 1;
        else if (counter === 2) return (oldAges[i][j] === undefined) ? undefined : oldAges[i][j] + 1;
        else    return undefined
    }
    // 更新所有细胞的状态
    updateAges = () => {
        let { size, ages } = this.state;
        let newAges = new Array(ages.length);
        for (let i = 0; i < ages.length; i++) {
            [...newAges[i]] = ages[i];// 数组深拷贝
            for (let j = 0; j < ages[i].length; j++) {
                newAges[i][j] = this.getNewAge(i, j);
            }
        }
        this.setState({
            size: size,
            ages: newAges
        })
    }
    // 在cancvs上绘制细胞
    DrawReacts = (id) => {
        let {size, ages} = this.state;
        let canvas = document.getElementById(id);
        let canvasCtx = canvas.getContext("2d");

        let cellWidth = canvas.width / size;
        let cellHeight = canvas.height / size;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (ages[i][j] === undefined) canvasCtx.fillStyle = "#e6e6e6";
                else if (ages[i][j] === 1) canvasCtx.fillStyle = "#00ffff";
                else if (ages[i][j] === 2) canvasCtx.fillStyle = "#0066ff";
                else if (ages[i][j] === 3) canvasCtx.fillStyle = "#0000ff";
                else canvasCtx.fillStyle = "#0000ff";
                canvasCtx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)
            }
        }
    }

    render() {
        return (<div>
            <canvas className="shit" id="mycanvas" width = {window.innerWidth} height = {window.innerWidth} onClick={this.handleClick} />
            <SetGame />
        </div>)
    }
}