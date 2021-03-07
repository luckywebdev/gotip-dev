import React, { Component } from 'react';
import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Card from '../../UI/Card';
import Text from '../../UI/text';
import Btn from '../../UI/btn';
import Anchor from '../../UI/a';
import DivideLine from '../../UI/Divider';
import Div from '../../UI/div';
import Modal from '../../UI/Modal/Modal';

const UlStyle = styled.ul`
  width: 95%;
  margin: auto;
  padding: 0;
  &>li {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
const RankingEditSection = styled.div`
  width: 80%;
  margin: 2rem auto 1rem auto;
`
const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 2%;
`
const TabUl = styled.ul`
  margin-right: 1rem;
  margin-left: 1rem;
  &:before {
    border: none;
  }
  &>.uk-active>a {
    border-color: #30AA89 !important;
    border-bottom-width: 2px !important;
  }
`

const RankingLists = {
  weekly: [
    {rank: "1位", name: "いちろうさん", point: 1000},
    {rank: "2位", name: "じろうさん", point: 900},
    {rank: "3位", name: "さぶろうさん", point: 800},
    {rank: "4位", name: "ごろうさん", point: 700},
    {rank: "5位", name: "りくろうさん", point: 600},
    {rank: "6位", name: "さぶろうさん", point: 500},
    {rank: "6位", name: "いちろうさん", point: 500},
    {rank: "6位", name: "りくろうさん", point: 500},
    {rank: "6位", name: "りくろうさん", point: 500},
    {rank: "7位", name: "さぶろうさん", point: 400},
  ],
  monthly: [
    {rank: "1位", name: "じろうさん", point: 1000},
    {rank: "2位", name: "ごろうさん", point: 900},
    {rank: "2位", name: "いちろうさん", point: 900},
    {rank: "3位", name: "りくろうさん", point: 800},
    {rank: "4位", name: "さぶろうさん", point: 700},
    {rank: "5位", name: "いちろうさん", point: 600},
    {rank: "6位", name: "りくろうさん", point: 500},
    {rank: "7位", name: "さぶろうさん", point: 400},
    {rank: "7位", name: "いちろうさん", point: 400},
  ]
  
}

class RankingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditableModal: false,
      showType: 'weekly'
    }
  }

  EditableChange = () => {
    this.setState({
      showEditableModal: !this.state.showEditableModal
    });
  }

  
  
  render() {
    return(
      <Card width="100%" margin="1%">
        <h4 className="uk-text-bold">視聴者ランキング</h4>
        <UlStyle className="uk-list">
          <li>
            <Text fontSize=".7rem" str="1位 いちろうさん"></Text>
            <Text fontSize=".7rem" str="1,000チップ"></Text>
          </li>
          <li>
            <Text fontSize=".7rem" str="2位 じろうさん"></Text>
            <Text fontSize=".7rem" str="900チップ"></Text>
          </li>
          <li>
            <Text fontSize=".7rem" str="3位 さぶろうさん"></Text>
            <Text fontSize=".7rem" str="800チップ"></Text>
          </li>
        </UlStyle>
          <div className="uk-flex uk-flex-center">
            <Anchor fontSize=".8rem" className="uk-text-center" color="#30AA89" href="#" text="詳しく見る" clicked={this.EditableChange} />
          </div>

        <Modal width="50%" show={this.state.showEditableModal} modalClosed={this.EditableChange}>
          <ModalTitle>視聴者ランキング</ModalTitle>
          <RankingEditSection>
            <TabUl className="uk-flex-center" data-uk-tab="{connect:'#my-id'}">
                <li><a href="#">週間</a></li>
                <li><a href="#">月間</a></li>
            </TabUl>

            <ul id="my-id" className="uk-switcher uk-margin">
                <li>
                  <Div width="90%" margin=".1rem auto" padding=".5rem" justify="center" direction="column">
                  {
                    RankingLists.weekly.map((item, index) => {
                      return (
                        <Div width="100%" margin=".1rem auto" padding=".5rem" justify="space-between" key={index}>
                          <Div width="70%" margin="0rem" padding="0" justify="flex-start">
                            <Text str={item.rank} color="#313131" margin="0rem .5rem 0rem 0rem" ></Text>
                            <Text str={item.name} color="#313131"></Text>
                          </Div>
                          <Div width="30%" margin="0rem" padding="0" justify="flex-end">
                            <Text str={item.point + "チップ"} color="#313131"></Text>
                          </Div>
                        </Div>
                      )
                    })
                  }
                  </Div>
                </li>
                <li>
                  <Div width="90%" margin=".1rem auto" padding=".5rem" justify="center" direction="column">
                  {
                    RankingLists.monthly.map((item, index) => {
                      return (
                        <Div width="100%" margin=".1rem auto" padding=".5rem" justify="space-between" key={index}>
                          <Div width="70%" margin="0rem" padding="0" justify="flex-start">
                            <Text str={item.rank} color="#313131" margin="0rem .5rem 0rem 0rem"></Text>
                            <Text str={item.name} color="#313131"></Text>
                          </Div>
                          <Div width="30%" margin="0rem" padding="0" justify="flex-end">
                            <Text str={item.point + "チップ"} color="#313131"></Text>
                          </Div>
                        </Div>
                      )
                    })
                  }
                  </Div>
                </li>
            </ul>
          </RankingEditSection>
        </Modal>
      </Card>
    )
  }

}

export default RankingList;