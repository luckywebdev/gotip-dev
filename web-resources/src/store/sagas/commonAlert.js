export function alertErrorMessage (errMessage) {
  window.alert(`予期しないエラーが発生いたしました。申し訳ございませんが、ページを開き直して再度操作をお願いいたします。エラーコード：${ errMessage }`)
}

export function alertAccountSuccessMessage (Message) {
  window.alert(`${ Message }`)
}