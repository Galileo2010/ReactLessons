import React, { Component } from "react";
import { Button } from 'antd-mobile';
import { List, InputItem } from 'antd-mobile';
import { Slider, WingBlank, WhiteSpace} from 'antd-mobile';

import PubSub from "pubsub-js";
export default class SetGame extends Component {
    // 修改行列数目
    handleClick1 = () => {
        let size = [this.autoFocusInst2.value, this.autoFocusInst2.value]
        console.log(this.autoFocusInst2.value);
        debugger
        PubSub.publish('setSize', size)
    }
    // 单步演化
    handleClick2 = () => {
        if (this.timerID !== undefined) {
            clearInterval(this.timerID);
            this.timerID = undefined
        }
        else
            PubSub.publish('evolution', 1)
    }
    // 自动演化
    handleClick3 = () => {
        this.timerID = setInterval(() => { PubSub.publish('evolution', 1) }, 400)
    }
    // 渲染
    render() {
        return (<div>
            <List renderHeader={() => '输入整数'}>
                <InputItem ref={el => this.autoFocusInst2 = el} >列数</InputItem>
                <InputItem ref={el => this.autoFocusInst1 = el} >行数</InputItem>
            </List>
            <WingBlank size="lg">
                <p className="sub-title">Slider</p>
                <Slider
                    style={{ marginLeft: 30, marginRight: 30 }}
                    defaultValue={20}
                    min={3}
                    max={100}
                    onChange={console.log('change')}
                    onAfterChange={console.log('afterChange')}
                >Speed</Slider>
            </WingBlank>
            <WhiteSpace size="lg" />
            <Button onClick={this.handleClick1}>修改行列</Button>
            <Button onClick={this.handleClick2}>单步演化</Button>
            <Button onClick={this.handleClick3}>自动演化</Button>
        </div>)
    }
}