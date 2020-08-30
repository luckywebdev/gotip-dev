import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import main from '../../../store/actions/main';
import admin from '../../../store/actions/admin';

import * as Constants from '../../../Constants';
import UIkit from 'uikit';
import styled from 'styled-components';
import Btn from '../../UI/btn';
import Modal from '../../UI/Modal/Modal';
import Text from '../../UI/text';
import Div from '../../UI/div';
import Anchor from '../../UI/a';

const MainContent = styled.nav`
    width: 65%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-right: 1%;
    margin-left: 1%;
`

const BlockContent = styled.div`
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
`;
const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 5%;
`

const NoticeContent = styled.textarea`
    width: 80%;
    resize: none;
    border: 1px solid #EAEAEA;
    font-size: 1rem;
    &:focus {
        border: 1px solid #BEBCBC;
    }
`;

export default (props) => {
    let history = useHistory();
    let dispatch = useDispatch();
    const [noticeData, setNoticeData] = useState([]);
    const [noticeID, setNoticeID] = useState("");
    const [content, setContent] = useState("");
    const [editable, setEditable] = useState(false);
    const adminState = useSelector( state => state.admin );
    const mainState = useSelector( state => state.main );
    const theme_color = typeof mainState.user !== 'undefined' && typeof mainState.user.theme_color !== 'undefined' ? mainState.user.theme_color : "#30AA89";

    useEffect(() => {
        dispatch(admin.tryGetNotice());
    }, []);

    useEffect(() => {
        if(typeof adminState.noticeData !== 'undefined'){
            setNoticeData(adminState.noticeData);
        }
    }, [adminState.noticeData])


    const handleCreate = () => {
        setEditable(true);
    }
    const handleUpdate = (notice) => {
        setContent(notice.content);
        setNoticeID(notice.id);
        setEditable(true);
    }
    const handleChange = (value) => {
        setContent(value);
    }

    const handleSubmit = () => {
        if(noticeID !== '' && noticeID !== 0){
            const sendData = {id: noticeID, content: content}
            dispatch(admin.tryUpdateNotice(sendData));
            setContent("");
            setNoticeID("");
        }
        else{
            const sendData = {content: content}
            dispatch(admin.tryCreateNotice(sendData));
        }
        setEditable(false);
    }

    return (
    <MainContent>
        <Div width="95%" padding=".8% 0 0 0" margin="0" backcolor="transparent" justify="flex-end" >
            <Anchor href="#" decoration="underline" color="#333" text={ Constants.ADD } id="addBtn" clicked={() => handleCreate()} />
        </Div>
        {(typeof noticeData !== 'undefined' && noticeData.length > 0) && noticeData.map((item, index) => {
            return (
                <BlockContent style={{backgroundColor: theme_color}} key={index}>
                    <Div width="95%" padding=".8% 0 0 0" margin="0" backcolor="transparent" justify="space-between" >
                        <Text str={item.created_at ? Constants.convert_fulldate(Number(item.created_at)) : Constants.convert_fulldate(Number(item.updated_at))} width="80%" textAlign="left" color="#FFF" margin=".5rem" />
                        <Anchor href="#" decoration="underline" color="#FFF" text={Constants.EDIT} id="editBtn" clicked={() => handleUpdate(item)} />
                    </Div>
                    <Div width="100%" backcolor="#FFF" margin="0rem 0 .5rem 0">
                        <Text str={item.content} width="80%" textAlign="left" color="#333" margin=".5rem" />
                    </Div>
                </BlockContent>
            )
        })}
        <Modal show={editable} width="35%" style={{height: "auto"}} modalClosed={() => setEditable(false)}>
            <ModalTitle>お知らせ編集</ModalTitle>
            <Div width="95%" padding=".8% 0 0 0" margin="5% auto 0" backcolor="transparent" justify="center" direction="column" alignItems="center" >
                <Div width="100%" padding=".8% 0 0 0" margin="0" backcolor="transparent" justify="center" >
                    <NoticeContent value={content} rows="5" onChange={(e) => handleChange(e.target.value)} />
                </Div>
                <Div width="100%" padding=".8% 0 0 0" margin="0" backcolor="transparent" justify="flex-end" >
                    <Btn text={Constants.SAVE} backcolor="#30AA89" width="15%" padding="0.5rem" radius="1px" color="#FFF" widthL="20%" widthS="30%" fontWeight="bold" fontSizeL=".8rem" fontSizeM=".6rem" fontSizeS=".5rem" marginL="0" onClick={ () => handleSubmit() } />
                </Div>
            </Div>
        </Modal>
    </MainContent>
  );
}

