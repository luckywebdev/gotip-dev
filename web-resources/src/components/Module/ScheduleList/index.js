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
const ScheduleEditSection = styled.div`
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
const ScheduleLists = [
  {DateTime: "2020年4月26日 (日)  19:00~", ScheduleId: 1},
  {DateTime: "2020年4月26日 (日)  19:00~", ScheduleId: 2},
  {DateTime: "2020年4月26日 (日)  19:00~", ScheduleId: 3},
]

class ScheduleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditableModal: false
    }
  }

  EditableChange = () => {
    this.setState({
      showEditableModal: !this.state.showEditableModal
    });
  }

  render() {
    let edit = '';
    if(this.props.editable){
      edit = (
        <Anchor margin="0" decoration="underline" text="変更する" color="#30AA89" fontSize=".8rem" clicked={this.EditableChange} />
      );
    }

    return(
      <Card width="100%" margin="2%">
        <h4 className="uk-text-bold uk-flex uk-flex-between uk-flex-middle"><span>今後の配信予定</span> { edit }</h4>
        <UlStyle className="uk-list">
          <li>
            <Text fontSize='.7rem' str="2020年4月26日 (日)  19:00~"></Text>
          </li>
        </UlStyle>
        <div className="uk-flex uk-flex-center">
          <Anchor fontSize=".8rem" className="uk-text-center" color="#30AA89" href="#" text="詳しく見る" />
        </div>

        <Modal width="50%" show={this.state.showEditableModal} modalClosed={this.EditableChange}>
          <ModalTitle>今後の配信予定</ModalTitle>
          <ScheduleEditSection>
            {
              ScheduleLists.map(item => {
                return (
                  <Div width="90%" margin=".1rem auto" padding=".5rem" justify="space-between" key={item.ScheduleId}>
                    <Div width="70%" margin="0rem" padding="0" justify="flex-start">
                      <Text str={item.DateTime} color="#313131"></Text>
                    </Div>
                    <Div width="30%" margin="0rem" padding="0" justify="flex-end">
                      <Anchor href="#" decoration="none" color="#9B9B9B" text="編集する" />
                    </Div>
                  </Div>
                )
              })
            }
            <Div width="100%" margin="1rem 0rem" padding="0" justify="center">
              <Anchor href="#" decoration="none" color="#30AA89" text="新しい予定を追加する" />
            </Div>
            <DivideLine width="80%" />
          </ScheduleEditSection>

          <div className="uk-flex uk-flex-center uk-margin-top">
            <Btn width="25%" radius="20px" backcolor="#30AA89" padding=".5rem 2rem" margin="1.5rem auto .5rem auto" text="更新する" btnType="rounded" />
          </div>
        </Modal>

      </Card>
    )
  }

}

export default ScheduleList;