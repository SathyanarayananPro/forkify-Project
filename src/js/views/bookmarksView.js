import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';
class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet, Find a nice recipe and bookmark it! `;
  _message = '';
  addHandlerRender(handel) {
    window.addEventListener('load', handel);
  }
  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new bookmarksView();
