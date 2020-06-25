import React, { Component } from 'react';
import Aux from '../hoc/Au/Auxx';

import { withRouter } from 'react-router-dom';

import Modal from '../components/UI/Modal/Modal';
import Layout from '../hoc/Layout/Layout';
import Cover from '../components/UI/Cover'
import UIkit from 'uikit';
import UIkitIcons from 'uikit/dist/js/uikit-icons'
UIkit.use(UIkitIcons)

import styled from 'styled-components';

import Sheet from '../components/Sheet';
import ListedTerms from '../components/Module/listedTerms';

const MainContainer = styled.div`
  max-width: 60%;
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const TermsContainer = styled.div`
  margin-top: 1em;
  padding: 1em 0.2em;
  border: solid #969696 2px;
  max-height: 60vh;
  overflow-y: scroll;
  background-color: #FFFFFF;
`
const pricacyPolicyData = [
  {
    heading: '1.個人情報の収集',
    text:
      `個人情報とは、個人に関する情報であり、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの(他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む。)を指します。
      当社(合同会社MDK 所在地:〒153-0063 東京都目黒区目黒２丁目２番８ 701号)は、個人情報を収集することがあります。
      当社は、個人情報の利用目的を公表します。
      `
  },
  {
    heading: '2.個人情報の利用目的',
    text:
      `当社は、収集した個人情報を以下の目的で利用することができるものとします。
      コンテンツその他の情報提供サービス、システム利用サービスの提供のため
      当社及び第三者の商品等(旅行、保険その他の金融商品を含む。以下同じ。)の販売、販売の勧誘、発送、サービス提供のため
      当社及び第三者の商品等の広告または宣伝(ダイレクトメールの送付、電子メールの送信を含む。)のため
      料金請求、課金計算のため
      本人確認、認証サービスのため
      アフターサービス、問い合わせ、苦情対応のため
      アンケートの実施のため
      懸賞、キャンペーンの実施のため
      アフィリエイト、ポイントサービスの提供のため
      マーケティングデータの調査、統計、分析のため
      決済サービス、物流サービスの提供のため
      新サービス、新機能の開発のため
      システムの維持、不具合対応のため
      オークションサービスにおける会員記述情報の掲載のため
      その他当社の各サービスにおいて個別に定める目的のため
      当社は、以下のとおり個人データを利用させていただきます。
      お客様を判別できる画像及び映像情報、音声、生年月日、ルーム名、ルーム説明文、演者名、ニックネーム、プロフィール、コメント、アカウントID、通報内容、及び端末識別情報
      利用目的
      新商品、新サービス及び新機能の研究開発及び提供のため
      個人データの管理についての責任を有する者の名称
      合同会社MDK
      `
  },
  {
    heading: '3.個人情報の提供',
    text:
      `当社は、以下に定める場合には、個人情報を第三者に提供することができるものとします。
      本人の同意がある場合
      裁判所、検察庁、警察、税務署、弁護士会またはこれらに準じた権限を持つ機関から、個人情報の開示を求められた場合
      保険金請求のために保険会社に開示する場合
      当社または関連サービスに対し支払うべき料金その他の金員の決済を行うために、金融機関、クレジットカード会社、回収代行業者その他の決済またはその代行を行う事業者に開示する場合
      当社が行う業務の全部または一部を第三者に委託する場合
      当社に対して秘密保持義務を負う者に対して開示する場合
      当社の権利行使に必要な場合
      合併、営業譲渡その他の事由による事業の承継の際に、事業を承継する者に対して開示する場合
      個人情報保護法その他の法令により認められた場合
      その他当社の各サービスにおいて個別に定める場合
      `
  },
  {
    heading: '4.リンク先等の個人情報の取扱い',
    text:
      `当社運営サイト上やメールマガジンにおいて、外部のサイトへのリンクが貼られることがあります。この外部のサイトで登録される個人情報は、当社で管轄する情報ではない為、一切の責任を負うことができません。 外部サイトで個人情報を登録される場合は、そのサイトのプライバシーポリシーをご確認ください。
      `
  },
  {
    heading: '5.個人情報を保護するための体制について',
    text:
      `当社では、個人情報管理委員会が個人情報の取扱いに関する方針を決定し、運用状況を確認しています。更に、個人情報を管理する責任部門に個人情報管理統括責任者を配置し、その者が個人情報の適切な管理を指導しています。また、従業員入社時に、個人情報保護に関する研修を行っています。
      `
  },
  {
    heading: '6.プライバシーポリシーの更新',
    text:
      `当社は、プライバシーポリシーを変更する場合があります。 プライバシーポリシーに重要な変更がある場合には、サイト上で告知します。 本ページを都度ご確認の上、当社のプライバシーポリシーをご理解いただくようお願いします。
      ※お客様へのお願い
      当社運営サイトでは、お客様の登録情報をID・パスワードで保護している場合があります。ID・パスワードの管理は、お客様ご自身が責任を持って行ってください。
      当社運営サイトを安全にご利用いただけるよう、当社運営サイト上に、他の方やお客様ご自身の個人情報は掲載されないようお願いいたします
      `
  }
]

class Privacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logining: false,
      errorModal: false,
      errorMessage: ""
    };

  }

  render() {
    const privacyInfo = (
      <div>
        <article className="uk-article">
        <h2 className="uk-heading-divider">個人情報保護方針</h2>
          <p className="uk-article-meta">Privacy Policy</p>
          <p className="uk-text-lead">当社はお客様から収集した個人情報を、以下の方針に則り適切に管理いたします。</p>
        </article>
        <TermsContainer className="uk-card">
          <ListedTerms data={ pricacyPolicyData } />
        </TermsContainer>
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
              <Sheet content={ privacyInfo } />
            </MainContainer>     
        </Layout>
      </Aux>
    );
  }
}

export default withRouter(Privacy);

