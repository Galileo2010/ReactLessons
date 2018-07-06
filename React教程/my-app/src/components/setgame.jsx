import React, { Component } from "react";
import { Button } from 'antd-mobile';
import { Slider, WingBlank, WhiteSpace} from 'antd-mobile';

import PubSub from "pubsub-js";
export default class SetGame extends Component {

    state = {
        autoEvolution:false,
        speed:400,
        size:20
    }

    // 设置细胞数
    setSize = (value) => {
        let { autoEvolution, speed, size } = this.state;
        size = value;
        this.setState({
            autoEvolution: autoEvolution,
            speed: speed,
            size: size
        })
        PubSub.publish('setSize', size)
    }
    // 设置速度
    setSpeed = (value) => {
        let {autoEvolution, speed, size}= this.state;
        speed = value;
        this.setState({ 
            autoEvolution: autoEvolution,
            speed: speed,
            size: size})
        // 改变速度的时候若已经自动演化，就要立即改变定时器的时间间隔
        if (autoEvolution === true)
        {
            clearInterval(this.timerID);
            this.timerID = setInterval(() => { PubSub.publish('evolution', 1) }, speed)
        }
    }

    // 单步演化
    stepEvolution = () => {
        let { autoEvolution, speed, size } = this.state;
        // 若处于自动演化的状态，则应当暂停（取消定时器）
        if (autoEvolution === true) {
            // 清除定时器
            clearInterval(this.timerID);
            this.timerID = undefined
            // 设置state
            this.setState({
                autoEvolution: false,
                speed: speed,
                size: size
            });
        }
        else
            PubSub.publish('evolution', 1)
    }
    // 自动演化
    setAutoEvolution = () => {
        let { autoEvolution, speed, size} = this.state;
        // 若之前是单步演化才响应
        if (autoEvolution === false) {
            this.setState({
                autoEvolution: true,
                speed: speed,
                size: size
            });
            this.timerID = setInterval(() => { PubSub.publish('evolution', 1) }, speed)
        }
    }
    // 渲染
    render() {
        let colorStep = (this.state.autoEvolution === true) ? "#ffffff" : "blue";
        let colorAuto = (this.state.autoEvolution === true) ? "blue" : "#ffffff";
        return (<div>
            <Button type="ghost" style={{ backgroundColor: colorStep }} onClick={this.stepEvolution}>单步演化</Button>
            <WhiteSpace size="xs"/>
            <Button type="ghost" style={{ backgroundColor: colorAuto }} onClick={this.setAutoEvolution}>自动演化</Button>
            <WingBlank size="lg">
                <p className="sub-title">尺寸 : {this.state.size + "×" + this.state.size}</p>
                <Slider
                    style={{ marginLeft: 30, marginRight: 30 }}
                    defaultValue={20}
                    min={3}
                    max={100}
                    onChange={this.setSize}
                />
            </WingBlank>
            <WhiteSpace size="md" />
            <WingBlank size="lg">
                <p className="sub-title">间隔 : {this.state.speed + "ms"}</p>
                <Slider
                    style={{ marginLeft: 30, marginRight: 30 }}
                    defaultValue={400}
                    min={1}
                    max={800}
                    onChange={this.setSpeed}
                />
            </WingBlank>
            <WhiteSpace size="lg" />
            <WhiteSpace size="lg" />
        </div>)
    }
}