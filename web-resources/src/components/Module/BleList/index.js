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
const BLEDeviceEditSection = styled.div`
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

const BLEDeviceList = [
  {DeviceName: "Bluetooth機器001", DeviceId: 1},
  {DeviceName: "Bluetooth機器002", DeviceId: 2},
  {DeviceName: "Bluetooth機器003", DeviceId: 3},
]

class BleList extends Component {
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
      <Card width="100%" margin="1%">
        <h4 className="uk-text-bold uk-flex uk-flex-between uk-flex-middle"><span>現在使用中のBLE機器</span> { edit }</h4>
        <UlStyle className="uk-list">
          <li>
            <Text fontSize=".7rem" str="アイテム名が入ります"></Text>
            <Btn color="#FFF" fontSize=".7rem" border="none" backcolor="#30AA89" radius="20px" btnType="rounded" text="接続中" />
          </li>
          <li>
            <Text fontSize=".7rem" str="アイテム名が入ります"></Text>
            <Btn radius="20px" fontSize=".7rem" btnType="rounded" text="未接続" disabled />
          </li>
          <li>
            <Text fontSize=".7rem" str="アイテム名が入ります"></Text>
            <Btn radius="20px" fontSize=".7rem" btnType="rounded" text="未接続" disabled />
          </li>
        </UlStyle>
        <Modal width="50%" show={this.state.showEditableModal} modalClosed={this.EditableChange}>
          <ModalTitle>現在使用中のBLE機器</ModalTitle>
          <BLEDeviceEditSection>
            {
              BLEDeviceList.map(item => {
                return (
                  <Div width="90%" margin=".1rem auto" padding=".5rem" justify="space-between" key={item.DeviceId}>
                    <Div width="70%" margin="0rem" padding="0" justify="flex-start">
                      <Text str={item.DeviceName} color="#313131"></Text>
                    </Div>
                    <Div width="30%" margin="0rem" padding="0" justify="flex-end">
                      <Anchor href="#" decoration="none" color="#9B9B9B" text="削除する" />
                    </Div>
                  </Div>
                )
              })
            }
            <Div width="100%" margin="1rem 0rem" padding="0" justify="center">
              <Anchor href="#" decoration="none" color="#30AA89" text="新しい機器を追加する" />
            </Div>
            <DivideLine width="80%" />
          </BLEDeviceEditSection>

          <div className="uk-flex uk-flex-center uk-margin-top">
            <Btn width="25%" radius="20px" backcolor="#30AA89" padding=".5rem 2rem" margin="1.5rem auto .5rem auto" text="更新する" btnType="rounded" />
          </div>
        </Modal>


      </Card>
    )
  }

}

export default BleList;