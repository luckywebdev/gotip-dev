import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import userEdit from '../../../store/actions/userEdit';
import * as Constants from '../../../Constants';
import ImageUploading from "react-images-uploading";
import UIkit from 'uikit'
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)
import styled from 'styled-components';
import Img from '../img';
import Btn from '../btn';
import Modal from '../Modal/Modal';

const CoverDiv = styled.div`
  width: 100%;
  position: relative;
`
const PictureEditSection = styled.div`
  width: 100%;
  margin-top: 2rem;
`
const ModalTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.5rem !important;
  font-weight: bolder;
  margin-top: 2%;
`

let dispatch
export default (props) => {
  dispatch = useDispatch()
  const allState = useSelector( state => state )

  const maxMbFileSize = 5 * 1024 * 1024; // 5Mb
  const [editable, setEditable] = useState(
    false
  );
  const [loadingMessage, setLoadingMessage] = useState(
    null
  );

  const [coverImage, setCoverImage] = useState({});
  let coverImgUrl = '/static/img/cover.png';
  if(typeof allState.main.user !== 'undefined' && allState.main.user.coverImgUrl !== '' && typeof allState.main.user.coverImgUrl !== 'undefined') {
    coverImgUrl = allState.main.user.coverImgUrl;
  }
  useEffect(() => {
    setLoadingMessage(allState.main.loadingMessage);
  if(allState.userEdit.editResult && editable && allState.main.gettingState) {
      setEditable(false);
      dispatch(userEdit.changeState());
    }
  })

  const PhotoUpdate = () => {
    const imageData = coverImage;
    if(typeof imageData !== 'undefined') {
      const fileType = imageData.file.name.split('.').pop();
      imageData.fileType = fileType;
      imageData.imgType = 'cover';
      dispatch(userEdit.uploadImage(imageData));
    }
    else{
      alert("Please select image");
      setEditable(false);
    }

  }

  const onChangeHandler = () => {
    document.getElementById("cover_image").click();
  }

  const onChangeImage = (e) => {
    if (e.target && e.target.files && e.target.files[0] && e.target.files[0].type.match(/image/) && e.target.files[0].size < 10000000) {

      let imageData = { file: e.target.files[0]};
      const fileType = imageData.file.name.split('.').pop();
      const freader = new FileReader()
      
      freader.onload = async loaded => {
        if (freader.result) {
          const imageBlob = await Constants.convertToBlobPng(freader.result, fileType)
          imageData.dataURL = imageBlob;
          document.getElementById("coverImgShow").src = freader.result;
          console.log("imgageData====>", imageData);
        }
      }

      freader.readAsDataURL(e.target.files[0]);

      setCoverImage(imageData);
    }
  }

  return (
    <CoverDiv className="uk-cover-container">
        <Img src={coverImgUrl} width="100%" maxHeight='150px' minHeight="150px" alt="cover" uk-cover />
        {
         props.editable ?  (<Btn text="カバー写真を変更" backcolor="transparent" border="1px solid #FFF" color="#FFF" radius="20px" btnType="rounded" position="absolute" top="5px" right="10px" onClick={() => setEditable(!editable)} />) : ''
        }
        <Modal width="50%" show={editable} modalClosed={() => setEditable(!editable)}>
          <ModalTitle>カバー写真を変更する</ModalTitle>
          <PictureEditSection>
            {
              (loadingMessage !== null) ? (
                <div style={{position: "absolute", top: "50%", left: "50%", transform: 'translate(-50%, -50%)', display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                  <div uk-spinner={ `ratio: 2` } style={{ color: '#FFF', fontWeight: "600" }} /><span style={{ color: '#FFF', fontWeight: "600" }}>{loadingMessage}</span>
                </div>
              ) : null
            }
            <div className="uk-flex uk-flex-center" style={{width: "80%", height: "200px", zIndex: "2000", margin: 'auto', border: '1px solid #ddd'}}    >
              <img src={coverImgUrl} alt="avatar" id="coverImgShow" onClick={() => onChangeHandler()} />
              <input type="file" style={{display: "none"}} id="cover_image" onChange={(e) => onChangeImage(e)} />
            </div>

            {/* <ImageUploading
              onChange={(imageList) => setCoverImage(imageList[0])}
              maxFileSize={maxMbFileSize}
              // acceptType={["jpg", "gif", "png"]}
              defaultValue={[{dataURL: coverImgUrl}]}
            >
              {({ imageList, onImageUpload, onImageRemoveAll }) => {
                if(imageList.length !== 0) {
                  return imageList.map((image) => (
                    <div className="uk-flex uk-flex-center" style={{width: "80%", height: "200px", zIndex: "2000", margin: 'auto', border: '1px solid #ddd'}} key={image.key} onClick={image.onUpdate}>
                      <img src={image.dataURL} />
                    </div>
                  ));
                }
                else{
                  return (<div style={{width: "165px", height: "165px", zIndex: "2000", margin: 'auto', border: '1px solid #ddd'}} onClick={onImageUpload}></div>);
                }
              }}
            </ImageUploading> */}
          </PictureEditSection>
          <div className="uk-flex uk-flex-center uk-margin-top">
            <Btn width="25%" radius="20px" backcolor="#30AA89" fontSize=".7rem" padding=".5rem 2rem" onClick={ PhotoUpdate } margin="1.5rem auto .5rem auto" text="写真をアップロードする" btnType="rounded" />
          </div>
        </Modal>

    </CoverDiv>
  );
}

