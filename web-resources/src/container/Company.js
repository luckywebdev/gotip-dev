import React, { Component } from 'react';
import Aux from '../hoc/Au/Auxx';

import withErrorHandler from '../hoc/WithErrorHandler/WithErrorHandler';
import { withRouter } from 'react-router-dom';

import Modal from '../components/UI/Modal/Modal';
import axios from '../axios-instance';
import Layout from '../hoc/Layout/Layout';
import Cover from '../components/UI/Cover'
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';

import Sheet from '../components/Sheet';
import PlainTable from '../components/PlainTable';


const MainContainer = styled.div`
  max-width: 60%;
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
        logining: false,
        errorModal: false,
        errorMessage: ""
    };
  }

  render() {
    const companyTableData = {
      head: [
        'name',
        'description'
      ],
      body: [
        [
          '社名',
          '合同会社MDK'
        ],
        [
          '所在地',
          '東京都目黒区目黒2丁目2番8-701号'
        ],
        [
          '設立',
          '2018年11月7日'
        ],
        [
          '代表者',
          '河合大介'
        ],
        [
          '電話番号',
          '0570-550518'
        ]
      ]
    }


    const companyInfo = (
      <div>
        <article className="uk-article">
        <h2 className="uk-heading-divider">会社概要</h2>
          <p className="uk-article-meta">Company Information</p>
          {/* <p className="uk-text-lead">キャッチコピーなど、会社説明文をこちらに入れていただきます。</p> */}
        </article>
        <PlainTable tableData={ companyTableData } />
      </div>
    )

    return (
      <Aux>
        <Layout {...this.props}>
            <Modal show={this.state.errorModal}>
                {this.state.errorMessage}        
            </Modal>
            <MainContainer>
              <Cover></Cover>
              <Sheet content={ companyInfo } />
            </MainContainer>     
        </Layout>
      </Aux>
    );
  }
}

export default withErrorHandler(withRouter(Company), axios);
