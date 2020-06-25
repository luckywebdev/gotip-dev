// google login client id
export const GOOGLE_LOGIN_CLIENT_ID = "19664915066-2d2oegf9c0lrd4ameehvmloflcv3o4ff.apps.googleusercontent.com";

// API URL
export const API_BASE_URL = "http://localhost:5001";

// logo title
export const LOGOTITLE = "Mindojo Policies";

// google login button text
export const GOOGLE_LOGIN_BUTTON_TEXT = "Login with Google";

// local image url prefix
export const LOCAL_IMAGE_URL = "static/img/";

// NAVIGATION PAGE NAME
export const MAIN_PAGE = 'ホーム';
export const COMPANY_PAGE = "会社概要";
export const TERMS_PAGE = "利用規約";
export const PRIVACY_PAGE = "プライバシーポリシー";
export const CONTACT_PAGE = "お問い合わせ";

// BUTTON TEXT
export const MEMBER_REGISTER = "新規会員登録";
export const LOGIN = "ログイン";
export const SIGNUP = "アカウント新規作成";
export const NORMAL_RATE = "通常料金";
export const MONTHLY_RATE = "月額料金";
export const UPDATE_CONTENT = "更新する";
export const UPLOAD_PICTURE = "写真をアップロードする";
export const PROFILE_EDIT_BTN = "プロフィールを編集する";
export const SEND_REQUEST = "リクエストを送信";

// LOGIN TEXT
export const LOGIN_TITLE = "ログイン";
export const KEEP_SIGN_IN = "ログイン情報を保持する";
export const FORGOT_PASSWORD = "パスワードを忘れてしまった場合";
export const RESET_PASSWORD_TITLE = "パスワードを再設定する";
export const SNS_LOGIN_TITLE = "SNSアカウントでログインする";


//  HOME TEXT
export const HOME_INTRODUCTION_TITLE = "BLUETOOTH CONTROLLER";
export const HOME_INTRODUCTION = "ライブ配信サービスの配信者など、離れた場所にいる人との コミュニケーションツール.。";

// HOME ABOUT SECTION
export const HOME_ABOUT_TITLE = "GO TIP について";
export const HOME_ABOUT_CONTENT = "ライブ配信サービスの配信者など、離れた場所にいる人との \n コミュニケーションツールとして使うことが出来る \n BLUETOOTH CONTROLLERです。";
export const HOME_ABOUT_CARD_1_TITLE = "応援機能";
export const HOME_ABOUT_CARD_1_CONTENT = "ライブ配信者を応 援する機能としてご利用頂 けます。";
export const HOME_ABOUT_CARD_2_TITLE = "コミュニケーション機能";
export const HOME_ABOUT_CARD_2_CONTENT = "チャツトなどの画面上だけのコミュニケーションより現実に近いコミュニケーション楽しむツールとしてご利用頂けます。";
export const HOME_ABOUT_CARD_3_TITLE = "可視化できるツール";
export const HOME_ABOUT_CARD_3_CONTENT = "チップがリアルタイムに現実世界で可視化できるツールとしてご利用頂けます。";
export const HOME_ABOUT_CARD_4_TITLE = "イベントでの利用が可能";
export const HOME_ABOUT_CARD_4_CONTENT = "イベント企画のファンディングツールとしてご利用頂けます。";

// HOME ADVICE SECTION
export const HOME_ADVICE_TITLE = "配信者ともっとつながろう。\n ライブ配信者とファンをつなぐ \n 新しいコミュニケーションの形";
export const HOME_ADVICE_CONTENT_1 = "見るだけ、チャットするだけのライブ配信から視聴者がアクションを起こせるライプブ配信へ。";
export const HOME_ADVICE_CONTENT_2 = "指先でタップするだけで遠くに離れた人とのインタラクションが楽しめます。";
export const HOME_ADVICE_CARD_1_TITLE = "BLUETOOTH 機器が反応";
export const HOME_ADVICE_CARD_1_CONTENT = "GoTipではチップを配信者に送ると配信者の持っているGoTip対応bluetooth機器が反応します。";
export const HOME_ADVICE_CARD_2_TITLE = "様々なアクション";
export const HOME_ADVICE_CARD_2_CONTENT = "使用する機器によって様々なアクションが起こせるのでコミュニケーションの幅が広がります。(GOTIP対応機器は順次追加致します)";
export const HOME_ADVICE_CARD_3_TITLE = "様々な配信サイトで利用が可能";
export const HOME_ADVICE_CARD_3_CONTENT = "GoTipは様々なプラットフォームで利用が可能です(使用の際はサイトの規約をご確認ください)";

// HOME PRICE SECTION
export const HOME_PRICE_TITLE = "料金について";
export const HOME_PRICE_CONTENT = "利用毎にポイントをご購入頂く形と \n 月額にご利用頂けるプランを用意しています。";
export const HOME_PRICE_BOTTOM_TEXT = "※購入したボイントは6ケ月間有効です。";

export const HOME_COPYRIGHT = "©GO TIP All Rights Reserved";

// PROFILE EDITOR
export const PROFILE_EDIT_TITLE = "プロフィール編集";
export const DISPLAY_NAME = "表示名";
export const AGE_LABEL = "年齢";
export const AGE_DISPLAY_STATE = "年齢の公開設定";
export const THEME_COLOR = "テーマカラー";
export const PROFILE_PICTURE_EIDT_TITLE = "プロフィール写真を変更する";


// RGB(A) to HEX color code converter
export const rgb2hex = (rgb) => {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
     ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
     ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
   }

// get month shortly words
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov","Dec"];

export const convert_date = (input_date) => {
    let initial_date = new Date(input_date);
    let result_date = 'Due on: ' + MONTHS[initial_date.getUTCMonth()] + ' ' + initial_date.getUTCDate() + ', ' + initial_date.getUTCFullYear();
    return result_date;
}